import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addQuestion, goBack, goNext, updateVotes } from "../store/questionSlice";
import { fetchRandomQuestion, submitVote } from "../api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import '../styles/QuestionCard.css'
const QuestionCard: React.FC = () => {
    const [flip, setFlip] = useState(true);

  const dispatch = useDispatch();
  const { history, currentIndex } = useSelector((state: RootState) => state.question);
  const question = history[currentIndex] || null;
  console.log(question?.voteOne, question?.voteTwo)
  // Fetch a new random question and map it correctly to our interface
  const { refetch, isFetching } = useQuery({
    queryKey: ["randomQuestion"],
    queryFn: async () => {
      const rawData = await fetchRandomQuestion();
      
      // ✅ Map API response to Redux store structure
      const formattedQuestion = {
        questionId: rawData.question_id, // Ensure correct key
        questionOne: rawData.question_one,
        questionTwo: rawData.question_two,
        voteOne: rawData.vote_one,
        voteTwo: rawData.vote_two,
        totalVotes: rawData.total_votes,
      };

      dispatch(addQuestion(formattedQuestion)); // Store in Redux
      return formattedQuestion;
    },
    staleTime: 0,
    enabled: false, // Prevent auto-fetching on mount
  });

  // Handle voting
  const voteMutation = useMutation({
    mutationFn: async (vote: "vote_one" | "vote_two") => {
      if (question) {
        const updatedData = await submitVote(question.questionId, vote);
        // ✅ Ensure updated vote data matches the store's structure
        dispatch(updateVotes({
          questionId: question.questionId,
          voteOne: updatedData.vote_one,
          voteTwo: updatedData.vote_two,
          totalVotes: updatedData.total_votes,
        }));
      }
    },
  });

  // Fetch a question on first load
  useEffect(() => {
    if (history.length === 0) {
      refetch();
    }
  }, [history, refetch]);

  if (!question) return <div>Loading...</div>;

  // Correctly calculate percentages
  const voteOnePercentage = question.totalVotes > 0 ? ((question.voteOne / question.totalVotes) * 100).toFixed(1) : "0.0";
  const voteTwoPercentage = question.totalVotes > 0 ? ((question.voteTwo / question.totalVotes) * 100).toFixed(1) : "0.0";

  return (
    <div className='Questions'>
      <h2 className='Questions__title'>Would you rather?</h2>
      <div className='Questions__card-wrap'>
        <div className='Questions__card-wrap--card-one question__card'>
          <button onClick={() => voteMutation.mutate("vote_one")}>
            {question.questionOne} 
          </button>
          <span>{voteOnePercentage}%</span>
        </div>

        <div className="Questions__card-wrap--card-two question__card">
          <button onClick={() => voteMutation.mutate("vote_two")}>
            {question.questionTwo} 
          </button>
          <span>{voteTwoPercentage}%</span>
        </div>
      </div>
      <br />
    <div className="Questions__controls">
      <button onClick={() => dispatch(goBack())} disabled={currentIndex <= 0}>Back</button>
      <button onClick={() => dispatch(goNext())} disabled={currentIndex >= history.length - 1}>Next</button>
      <button onClick={() => refetch()} disabled={isFetching}>New Question</button>
    </div>
    </div>
  );
};

export default QuestionCard;
