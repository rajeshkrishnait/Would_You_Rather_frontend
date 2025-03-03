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
  currentIndex: -1,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<Question>) => {
      // Remove forward history if new question is added
      if (state.currentIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.currentIndex + 1);
      }
      state.history.push(action.payload);
      state.currentIndex = state.history.length - 1;
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
    addNewQuestionToStore: (state, action: PayloadAction<Question>) => {
      state.history.push(action.payload);
      state.currentIndex = state.history.length - 1;
    },
  },
});

export const { addQuestion, goBack, goNext, updateVotes, addNewQuestionToStore } = questionSlice.actions;
export default questionSlice.reducer;
