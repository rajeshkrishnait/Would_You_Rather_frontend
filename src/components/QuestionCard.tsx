import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addQuestions, goBack, goNext, updateVotes } from "../store/questionSlice";
import { fetchRandomQuestion, submitVote } from "../api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import QuestionCardItem from "./QuestionCardItem";

import '../styles/QuestionCard.css';

const QuestionCard: React.FC = () => {
  const [flip, setFlip] = useState([true, true]);

  const dispatch = useDispatch();
  const { history, currentIndex } = useSelector((state: RootState) => state.question);
  const question = history[currentIndex] || null;
  console.log(history, currentIndex)
  const { refetch } = useQuery({
    queryKey: ["randomQuestions"],
    queryFn: async () => {
      const rawDataArray = await fetchRandomQuestion();

      const formattedQuestions = rawDataArray.map((rawData: any) => ({
        questionId: rawData.question_id,
        questionOne: rawData.question_one,
        questionTwo: rawData.question_two,
        voteOne: rawData.vote_one,
        voteTwo: rawData.vote_two,
        totalVotes: rawData.total_votes,
      }));
  
      // Dispatch all questions at once
      dispatch(addQuestions(formattedQuestions));
  
      return formattedQuestions;
    },
    staleTime: 0,
    enabled: false,
  });

  const voteMutation = useMutation({
    mutationFn: async (vote: "vote_one" | "vote_two") => {
      if (question) {
        const updatedData = await submitVote(question.questionId, vote);
        dispatch(updateVotes({
          questionId: question.questionId,
          voteOne: updatedData.vote_one,
          voteTwo: updatedData.vote_two,
          totalVotes: updatedData.total_votes,
        }));
      }
    },
  });

  // Initial Fetch when history is empty
  useEffect(() => {
    if(currentIndex==0 || (currentIndex + 1)%3==0)
      refetch();
  },[currentIndex, refetch]);

  if (!question) return <div>Loading...</div>;

  const voteOnePercentage = question.totalVotes > 0 ? ((question.voteOne / question.totalVotes) * 100).toFixed(1) : "0.0";
  const voteTwoPercentage = question.totalVotes > 0 ? ((question.voteTwo / question.totalVotes) * 100).toFixed(1) : "0.0";

  const handleFlip = (index: number) => {
    setFlip(prev => {
      const newFlip = [...prev];
      newFlip[index] = !newFlip[index];
      return newFlip;
    });
  };

  const handleNext = () => {
      dispatch(goNext());
  };

  return (
    <div className="Questions">
      <h2 className="Questions__title">Would you rather?</h2>
      <div className="Questions__card-wrap">
        <QuestionCardItem
          questionText={question.questionOne}
          votePercentage={voteOnePercentage}
          flipState={flip[0]}
          onFlip={() => handleFlip(0)}
          onVote={() => voteMutation.mutate("vote_one")}
        />

        <QuestionCardItem
          questionText={question.questionTwo}
          votePercentage={voteTwoPercentage}
          flipState={flip[1]}
          onFlip={() => handleFlip(1)}
          onVote={() => voteMutation.mutate("vote_two")}
        />
      </div>

      <div className="Questions__controls">
        <button onClick={() => dispatch(goBack())} disabled={currentIndex <= 0}>Back</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default QuestionCard;
