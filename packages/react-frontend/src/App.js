import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/header';
import Login from './Login';
import Register from './Register';
import WeekChart from './WeekChart';

function App() {
  const [serverStatus, setServerStatus] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealth(1);
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

  const fetchHealth = async (load) => {
    if (load === 1) {
      setServerStatus(null);
      setDatabaseStatus(null);
    }  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const healthData = await response.json();
      setServerStatus(healthData.serverStatus);
      setDatabaseStatus(healthData.databaseStatus);
    } catch (error) {
      console.error("Health check failed: ", error);
      setServerStatus("error");
      setDatabaseStatus("error");
    }
  };

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
    fetchHealth(0);
    setIsLoginMode(false);
  };

  const switchToLogin = () => {
    fetchHealth(0);
    setIsLoginMode(true);
  };

  const handleSignOut = () => {
    fetchHealth(0);
    setAuthenticated(false);
    setIsLoginMode(true);
    setUserId(null);
    navigate('/');
  };

  return (
    
      <div className="App">
              <Header
                handleSignOut={handleSignOut}
                serverStatus={serverStatus}
                databaseStatus={databaseStatus}
              />
        <div className="App-body mt-10">
          <Routes>
            {!authenticated ? (
              isLoginMode ? (
                <Route path="/" element={<Login login={handleLogin} onSwitchToRegister={switchToRegister} fetchHealth={fetchHealth}/>} />
              ) : (
                <Route path="/" element={<Register register={handleRegister} onSwitchToLogin={switchToLogin} fetchHealth={fetchHealth}/>} />
              )
            ) : (
              <>
                <Route path={`/WeekChart/*`} element={<WeekChart fetchHealth={fetchHealth} />} />
              </>
            )}

          </Routes>
        </div>
      </div>
  );
}

export default App;
