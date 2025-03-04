import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addQuestions, goBack, goNext, updateVotes, updateFlip } from "../store/questionSlice";
import { fetchRandomQuestion, submitVote } from "../api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import QuestionCardItem from "./QuestionCardItem";
import "../styles/QuestionCard.css";
interface RawQuestionData {
  question_id: string;
  question_one: string;
  question_two: string;
  vote_one: number;
  vote_two: number;
  total_votes: number;
}

interface FormattedQuestion {
  questionId: string;
  questionOne: string;
  questionTwo: string;
  voteOne: number;
  voteTwo: number;
  totalVotes: number;
  flipped: boolean;
  voteCompleted: boolean;
}
const QuestionCard: React.FC = () => {
  const dispatch = useDispatch();
  const { history, currentIndex } = useSelector((state: RootState) => state.question);
  const question = history[currentIndex] || null;
  const containerRef = useRef<HTMLDivElement>(null);

  console.log(history, currentIndex);

  const { refetch } = useQuery({
    queryKey: ["randomQuestions"],
    queryFn: async () => {
      const rawDataArray = await fetchRandomQuestion();
      const formattedQuestions: FormattedQuestion[] = rawDataArray.map(
        (rawData: RawQuestionData) => ({
          questionId: rawData.question_id,
          questionOne: rawData.question_one,
          questionTwo: rawData.question_two,
          voteOne: rawData.vote_one,
          voteTwo: rawData.vote_two,
          totalVotes: rawData.total_votes,
          flipped: false,
          voteCompleted: false,
        })
      );

      dispatch(addQuestions(formattedQuestions));
      return formattedQuestions;
    },
    staleTime: 0,
    enabled: false,
  });

  const voteMutation = useMutation({
    mutationFn: async (vote: "vote_one" | "vote_two") => {
      if (question) {
        if(question.voteCompleted){
          dispatch(updateFlip({questionId: question.questionId}))
        }else{
          const updatedData = await submitVote(question.questionId, vote);
          dispatch(
            updateVotes({
              questionId: question.questionId,
              voteOne: updatedData.vote_one,
              voteTwo: updatedData.vote_two,
              totalVotes: updatedData.total_votes,
              flipped: true,
              voteCompleted: true
            })
          );
        }
      }
    },
  });

  useEffect(() => {
    if (currentIndex === 0 || (currentIndex + 1) % 3 === 0) refetch();
  }, [currentIndex, refetch]);

  const handleScroll = (event: WheelEvent) => {
    if (!containerRef.current) return;

    if (event.deltaY > 0) {
      dispatch(goNext());
    } else if (event.deltaY < 0) {
      dispatch(goBack());
    }

    containerRef.current.scrollBy({
      left: event.deltaY > 0 ? window.innerWidth : -window.innerWidth,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!containerRef.current) return;

    if (event.key === "ArrowRight") {
      dispatch(goNext());
      containerRef.current.scrollBy({ left: window.innerWidth, behavior: "smooth" });
    } else if (event.key === "ArrowLeft") {
      dispatch(goBack());
      containerRef.current.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!question) return <div>Loading...</div>;
  console.log(history)
  return (
    <div className="Questions" ref={containerRef}>
      {history?.map((item, index) => (
        <div className="Questions__card-wrap" key={index}>
          <QuestionCardItem
            questionText={item.questionOne}
            votePercentage={
              item.totalVotes > 0 ? ((item.voteOne / item.totalVotes) * 100).toFixed(1) : "0.0"
            }
            flipState={!item.flipped}
            onVote={() => voteMutation.mutate("vote_one")}
          />
          <QuestionCardItem
            questionText={item.questionTwo}
            votePercentage={
              item.totalVotes > 0 ? ((item.voteTwo / item.totalVotes) * 100).toFixed(1) : "0.0"
            }
            flipState={!item.flipped}
            onVote={() => voteMutation.mutate("vote_two")}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionCard;
