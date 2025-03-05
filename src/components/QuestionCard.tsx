import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addQuestions, goBack, goNext, updateVotes, updateFlip } from "../store/questionSlice";
import { fetchRandomQuestion, submitVote } from "../api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import QuestionCardItem from "./QuestionCardItem";
import { debounce } from "lodash";
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
  
      if (!question) return;

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

                setTimeout(() => dispatch(goNext()), 1500);
              });
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

  const handleWheel = useCallback(
    debounce((event: WheelEvent) => {
      if (!containerRef.current) return;
  
      event.preventDefault(); // Stop default browser scrolling
  
      const scrollAmount = containerRef.current.offsetWidth; // Full card width
  
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        // If vertical scroll detected (mouse wheel)
        if (event.deltaY > 0) {
          containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
          setTimeout(()=>{
            dispatch(goNext());
        }, 1000)
        } else {
          containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          setTimeout(()=>{
            dispatch(goBack());
          }, 1000)
        }
      } else {
        // If horizontal swipe detected (trackpad)
        if (event.deltaX > 0) {
          containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
          setTimeout(()=>{
          dispatch(goNext());
        }, 1500)
        } else {
          containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          setTimeout(()=>{

          dispatch(goBack());
        }, 1500)
        }
      }
    }, 200),
    [dispatch]
  );
  
  
  
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    container.addEventListener("wheel", handleWheel, { passive: false });
  
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);
  return (
    <div id={'questions-js'}className="Questions" ref={containerRef}>
      {history?.map((item, index) => (
        <div className="Questions__card-wrap" key={index}>
          <QuestionCardItem
            questionText={item.questionOne}
            votePercentage={
              item.totalVotes > 0 ? ((item.voteOne / item.totalVotes) * 100).toFixed(1) : "0.0"
            }
            flipState={!item.flipped}
            onVote={debounce(() => voteMutation.mutate("vote_one"), 200)}
            index={1}
          />
          <div className="Questions__circle">
            {voteMutation.status === "pending" ? (
              <>
                <div className="loader"></div> 
                <span>Would you Rather?</span>
              </>
            ) : (
              <span>Would you Rather?</span>
            )}
          </div>
          <QuestionCardItem
            questionText={item.questionTwo}
            votePercentage={
              item.totalVotes > 0 ? ((item.voteTwo / item.totalVotes) * 100).toFixed(1) : "0.0"
            }
            flipState={!item.flipped}
            onVote={debounce(() => voteMutation.mutate("vote_two"), 200)}
            index={2}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionCard;