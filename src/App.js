import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Matches from "./pages/Matches/Matches";
import PreviousCards from "./pages/PreviousCards/PreviousCards";
import Friends from "./pages/Friends/Friends";
import Navbar from "./components/Navbar/Navbar";
import { useAuthContext } from "./hooks/useAuthContext";
import { useState, useEffect } from "react";
import LoadingPage from "./pages/LoadingPage/LoadingPage";

const App = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <BrowserRouter className="App">
      {loading ? (
        <LoadingPage loading={loading} />
      ) : (
        <>
          <Navbar matches={matches} />
          <div>
            <Routes>
              <Route path="/" element={<Home setMatches={setMatches} />} />
              <Route
                path="/dashboard"
                element={user ? <Dashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/matches"
                element={
                  user ? <Matches matches={matches} setMatches={setMatches}/> : <Navigate to="/" />
                }
              />
              <Route
                path="/history"
                element={user ? <PreviousCards /> : <Navigate to="/" />}
              />
              <Route
                path="/friends"
                element={user ? <Friends /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
