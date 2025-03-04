import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  questionId: string;
  questionOne: string;
  questionTwo: string;
  voteOne: number;
  voteTwo: number;
  totalVotes: number;
}

interface QuestionState {
  history: Question[];
  currentIndex: number;
}

const initialState: QuestionState = {
  history: [],
  currentIndex: 0,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    addQuestions: (state, action: PayloadAction<Question[]>) => {
      // Clear forward history if new questions are added
      if (state.currentIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.currentIndex + 1);
      }

      // Append new questions to history
      state.history = [...state.history, ...action.payload];
    },
    goBack: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
      }
    },
    goNext: (state) => {
      if (state.currentIndex < state.history.length - 1) {
        state.currentIndex++;
      }
    },
    updateVotes: (state, action: PayloadAction<{ questionId: string; voteOne: number; voteTwo: number; totalVotes: number }>) => {
      const { questionId, voteOne, voteTwo, totalVotes } = action.payload;
      const question = state.history.find(q => q.questionId === questionId);
      if (question) {
        question.voteOne = voteOne;
        question.voteTwo = voteTwo;
        question.totalVotes = totalVotes;
      }
    },
  },
});

export const { addQuestions, goBack, goNext, updateVotes } = questionSlice.actions;
export default questionSlice.reducer;
