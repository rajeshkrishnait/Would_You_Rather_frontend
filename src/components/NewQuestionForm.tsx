import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addNewQuestion } from "../api/api";

interface FormData {
  questionOne: string;
  questionTwo: string;
}

const NewQuestionForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
//   const dispatch = useDispatch();

  // API Mutation for posting a new question
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await addNewQuestion(data);
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
