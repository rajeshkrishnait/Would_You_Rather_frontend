import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import QuestionCard from "./components/QuestionCard";
import NewQuestionForm from "./components/NewQuestionForm";
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div>
          <h1>Would You Rather?</h1>
          <QuestionCard />
        </div>
        <NewQuestionForm />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
