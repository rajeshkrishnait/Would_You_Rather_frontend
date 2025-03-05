import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { insertNewQuestion, Question } from "../store/questionSlice"; // ✅ FIXED IMPORT
import { addNewQuestion } from "../api/api";
import TextField from "./TextField";
import "../styles/NewQuestionForm.css";

interface FormData {
  questionOne: string;
  questionTwo: string;
}
interface FormProp {
  setIsOpen: (open: boolean) => void;
}

const smoothScroll = (element: HTMLElement, scrollOffset: number) => {
  if ("scrollBy" in element && "scrollBehavior" in document.documentElement.style) {
    element.scrollBy({ left: scrollOffset, behavior: "smooth" });
  } else {
    const start = element.scrollLeft;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 500, 1); // Adjust duration (500ms)
      element.scrollLeft = start + scrollOffset * progress;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
};

const NewQuestionForm: React.FC<FormProp> = ({ setIsOpen }) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => await addNewQuestion(data),
    onSuccess: (newQuestion) => {
      reset();
      const alteredObject: Question = {
        questionId: newQuestion.question.question_id,
        questionOne: newQuestion.question.question_one,
        questionTwo: newQuestion.question.question_two,
        voteOne: newQuestion.question.vote_one,
        voteTwo: newQuestion.question.vote_two,
        totalVotes: newQuestion.question.total_votes,
        flipped: false,
        voteCompleted: false,
      };

      if (newQuestion && newQuestion.question) {
        dispatch(insertNewQuestion(alteredObject));
      }

      setIsOpen(false);

      setTimeout(() => {
        const questionsContainer: HTMLElement | null = document.getElementById("questions-js");

        if (questionsContainer) {
          smoothScroll(questionsContainer, window.innerWidth);
        }
      }, 1000);
    },
    onError: (error) => {
      console.error("❌ API Error:", error);
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
      <TextField label="Question One" {...register("questionOne", { required: true })} />
      <TextField label="Question Two" {...register("questionTwo", { required: true })} />
      <button ref={closeButtonRef} type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default NewQuestionForm;
