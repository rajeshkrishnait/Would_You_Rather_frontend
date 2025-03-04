import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { addNewQuestion } from "../api/api";
import TextField from "./TextField";
import '../styles/NewQuestionForm.css'

interface FormData {
  questionOne: string;
  questionTwo: string;
}

const NewQuestionForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();

  // API Mutation for posting a new question
  const mutation = useMutation({
    mutationFn: async (data: FormData) => await addNewQuestion(data),
    onSuccess: () => reset()
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <TextField label="Question One" {...register("questionOne", { required: true })} />
      <TextField label="Question Two" {...register("questionTwo", { required: true })} />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default NewQuestionForm;
