import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/header';
import Login from './Login';
import Register from './Register';
import WeekChart from './WeekChart';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('userId'));
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));
    if (id && isAuthenticated) {
      setUserId(id);
    }
  }, []);
  
  useEffect(() => {
    if (userId) {
      setAuthenticated(true);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && authenticated) {
      navigate('/WeekChart', { state: { userId: userId } });
    }
  }, [userId, authenticated, navigate]);

  useEffect(() => {
    localStorage.setItem('userId', JSON.stringify(userId));
    console.log("set the user Id in local storage as " + userId)
  }, [userId]);

  const handleLogin = (userID) => {
    setUserId(userID);
    setAuthenticated(true);
    localStorage.setItem('authenticated', 'true')
    navigate(`/WeekChart`, { state: {userId: userID} });
  };

  const handleRegister = (userID) => {
    setUserId(userID);
    setAuthenticated(true);
    localStorage.setItem('authenticated', 'true')
    navigate(`/WeekChart`, { state: {userId: userID} });
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
  };

  const handleSignOut = () => {
    setAuthenticated(false);
    setIsLoginMode(true);
    setUserId(null);
    navigate('/');
  };

  return (
    
      <div className="App">
        <Header handleSignOut={handleSignOut} />
        <div className="App-body mt-10">
          <Routes>
            {!authenticated ? (
              isLoginMode ? (
                <Route path="/" element={<Login login={handleLogin} onSwitchToRegister={switchToRegister} />} />
              ) : (
                <Route path="/" element={<Register register={handleRegister} onSwitchToLogin={switchToLogin} />} />
              )
            ) : (
              <>
                <Route path={`/WeekChart/*`} element={<WeekChart />} />
              </>
            )}

          </Routes>
        </div>
      </div>
  );
}

export default App;
