import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import './App.css'
import './styles/global.css'
import Header from "./components/Header";
import Notification from './components/Notification.tsx'
import ServerSuspenseWrapper from "./components/ServerHealthCheckWrapper.tsx";
// Lazy load components
const QuestionCard = lazy(() => import("./components/QuestionCard"));

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          {/* Routing and Pages with Suspense for Lazy Loading */}
          <Suspense fallback={<p>...Loading</p>}>
          <ServerSuspenseWrapper>
          <Header/>
            <Routes>
              <Route path="/would_you_rather_frontend/" element={<QuestionCard />} />
            </Routes>
            </ServerSuspenseWrapper>
          </Suspense>
          <Notification/>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
