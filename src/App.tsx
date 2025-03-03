import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import './App.css'
import './styles/global.css'
import Header from "./components/Header";
// Lazy load components
const QuestionCard = lazy(() => import("./components/QuestionCard"));
const NewQuestionForm = lazy(() => import("./components/NewQuestionForm"));

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Header/>
          {/* Routing and Pages with Suspense for Lazy Loading */}
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<QuestionCard />} />
              <Route path="/home" element={<QuestionCard />} />
              <Route path="/add_question" element={<NewQuestionForm />} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
