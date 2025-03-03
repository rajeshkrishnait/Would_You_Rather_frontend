import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addNewQuestion } from "../api/api";
import { useDispatch } from "react-redux";
import { addNewQuestionToStore } from "../store/questionSlice";

interface FormData {
  questionOne: string;
  questionTwo: string;
}

const NewQuestionForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const dispatch = useDispatch();

  // API Mutation for posting a new question
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await addNewQuestion(data);
    },
    onSuccess: (newQuestion) => {
      // ✅ Add new question to Redux store
      dispatch(addNewQuestionToStore({
        questionId: newQuestion.question_id,
        questionOne: newQuestion.question_one,
        questionTwo: newQuestion.question_two,
        voteOne: newQuestion.vote_one,
        voteTwo: newQuestion.vote_two,
        totalVotes: newQuestion.total_votes,
      }));
      reset(); // ✅ Reset form after successful submission
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <label>Question 1:</label>
      <input {...register("questionOne", { required: true })} />

      <label>Question 2:</label>
      <input {...register("questionTwo", { required: true })} />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default NewQuestionForm;
