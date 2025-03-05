import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addQuestions, goBack, goNext, updateVotes, updateFlip } from "../store/questionSlice";
import { fetchRandomQuestion, submitVote } from "../api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import QuestionCardItem from "./QuestionCardItem";
import { debounce } from 'lodash';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const fetchedIndices = useRef(new Set<number>());
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
      const question = history[currentIndex];
  
      if (!question) return; // Ensure question exists
  
      if (question.voteCompleted) {
        dispatch(updateFlip({ questionId: question.questionId }));
      } else {
        const updatedData = await submitVote(question.questionId, vote);
        
        dispatch(
          updateVotes({
            questionId: question.questionId,
            voteOne: updatedData.vote_one,
            voteTwo: updatedData.vote_two,
            totalVotes: updatedData.total_votes,
            flipped: true,
            voteCompleted: true,
          })
        );
  
        setTimeout(() => {
          if (containerRef.current) {
            const cards = containerRef.current.children;
            const nextCard = cards[currentIndex + 1] as HTMLElement | undefined;
  
            if (nextCard) {
              requestAnimationFrame(() => {
                nextCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
              });
              dispatch(goNext()); // Ensure state updates after scroll animation starts
            }
          }
        }, 1000);
      }
    },
  });
  

  useEffect(() => {
    if ((currentIndex === 0 || (currentIndex + 1) % 3 === 0) && !fetchedIndices.current.has(currentIndex)) {
      refetch();
      fetchedIndices.current.add(currentIndex);
    }
  }, [currentIndex, refetch]);

  const handleScroll = useCallback(
    debounce((event: WheelEvent) => {
      if (!containerRef.current) return;
  
      const scrollAmount = window.innerWidth + 20; // Exact card width + gap
      const currentScrollLeft = containerRef.current.scrollLeft;
      const nextScrollLeft = event.deltaY > 0 ? currentScrollLeft + scrollAmount : currentScrollLeft - scrollAmount;
  
      containerRef.current.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth",
      });
  
      if (event.deltaY > 0) {
        dispatch(goNext());
      } else {
        dispatch(goBack());
      }
    }, 300), // Debounce time adjusted
    [dispatch]
  );
  
  const handleKeyDown = useCallback(
    debounce((event: KeyboardEvent) => {
      event.preventDefault(); // Prevent default browser behavior
      if (!containerRef.current) return;
  
      const scrollAmount = window.innerWidth + 20;
      const currentScrollLeft = containerRef.current.scrollLeft;
      let nextScrollLeft = currentScrollLeft;
  
      if (event.key === "ArrowRight") {
        nextScrollLeft += scrollAmount;
        dispatch(goNext());
      } else if (event.key === "ArrowLeft") {
        nextScrollLeft -= scrollAmount;
        dispatch(goBack());
      }
  
      containerRef.current.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth",
      });
    }, 300),
    [dispatch]
  );
  

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

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
            onVote={debounce(() => voteMutation.mutate("vote_one"), 200)}
          />
          <div className="Questions__circle">
            <span> Would you Rather?</span>
          </div>
          <QuestionCardItem
            questionText={item.questionTwo}
            votePercentage={
              item.totalVotes > 0 ? ((item.voteTwo / item.totalVotes) * 100).toFixed(1) : "0.0"
            }
            flipState={!item.flipped}
            onVote={debounce(() => voteMutation.mutate("vote_two"), 200)}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionCard;