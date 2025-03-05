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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  console.log(currentIndex)
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
      if (!question) return null;
  
      if (question.voteCompleted) {
        return { questionId: question.questionId, alreadyVoted: true };
      } else {
        const updatedData = await submitVote(question.questionId, vote);
        return { ...updatedData, questionId: question.questionId, alreadyVoted: false };
      }
    },
    onSuccess: (data) => {
      if (!data) return;
  
      if (data.alreadyVoted) {
        dispatch(updateFlip({ questionId: data.questionId }));
      } else {
        dispatch(
          updateVotes({
            questionId: data.questionId,
            voteOne: data.vote_one,
            voteTwo: data.vote_two,
            totalVotes: data.total_votes,
            flipped: true,
            voteCompleted: true,
          })
        );
  
        setTimeout(() => {
          if (containerRef.current) {
            const cards = containerRef.current.children;
            const nextCard = cards[currentIndex + 1] as HTMLElement | undefined;
  
            if (nextCard) {
              smoothScrollTo(nextCard.offsetLeft);
              setTimeout(() => dispatch(goNext()), 1500);
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

  // ✅ Custom smooth scrolling function for Safari compatibility
  const smoothScrollTo = (targetLeft: number) => {
    if (!containerRef.current) return;

    const startX = containerRef.current.scrollLeft;
    const distance = targetLeft - startX;
    const duration = 500;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      containerRef.current!.scrollLeft = startX + distance * progress;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handleWheel = useCallback(
    debounce((event: WheelEvent) => {
      if (!containerRef.current) return;
  
      event.preventDefault(); // Prevent default scrolling behavior
  
      const scrollAmount = containerRef.current.offsetWidth; // Full card width
      const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      
      const minSwipeThreshold = 30; // Minimum pixel movement required
  
      if (isHorizontal) {
        // Ensure swipe distance is significant
        if (Math.abs(event.deltaX) < minSwipeThreshold) return;
  
        if (event.deltaX > 0) {
          smoothScrollTo(containerRef.current.scrollLeft + scrollAmount);
          setTimeout(() => dispatch(goNext()), 1000);
        } else {
          smoothScrollTo(containerRef.current.scrollLeft - scrollAmount);
          setTimeout(() => dispatch(goBack()), 1000);
        }
      } else {
        // Handle vertical scrolls (optional, but follows the same threshold logic)
        if (Math.abs(event.deltaY) < minSwipeThreshold) return;
  
        if (event.deltaY > 0) {
          smoothScrollTo(containerRef.current.scrollLeft + scrollAmount);
          setTimeout(() => dispatch(goNext()), 1000);
        } else {
          smoothScrollTo(containerRef.current.scrollLeft - scrollAmount);
          setTimeout(() => dispatch(goBack()), 1000);
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


  //Mobile card events
  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };
  
  const handleTouchMove = (event: TouchEvent) => {
    if (touchStartX.current !== null) {
      event.preventDefault(); // 🚫 Stops default horizontal scroll/swipe behavior
    }
    touchEndX.current = event.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
  
    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeThreshold = 50;
  
    if (Math.abs(swipeDistance) > minSwipeThreshold) {
      if (swipeDistance > 0) {
        smoothScrollTo(containerRef.current!.scrollLeft - containerRef.current!.offsetWidth);
        setTimeout(() => dispatch(goBack()), 500);
      } else {
        smoothScrollTo(containerRef.current!.scrollLeft + containerRef.current!.offsetWidth);
        setTimeout(() => dispatch(goNext()), 500);
      }
    }
  
    touchStartX.current = null;
    touchEndX.current = null;
  };
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
  
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
  return (
    <div id="questions-js" className="Questions" ref={containerRef}>
      {history?.map((item) => (
        <div className="Questions__card-wrap" key={item.questionId}>
          <QuestionCardItem
            questionText={item.questionOne}
            votePercentage={
              item.totalVotes > 0 ? ((item.voteOne / item.totalVotes) * 100).toFixed(1) : "0.0"
            }
            flipState={!item.flipped}
            onVote={debounce(() => voteMutation.mutate("vote_one"), 300)}
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
            onVote={debounce(() => voteMutation.mutate("vote_two"), 300)}
            index={2}
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionCard;
