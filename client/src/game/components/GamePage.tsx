import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Game from './Game';
import { sendGameResult } from '../../services/api';

const GamePage: React.FC<{}> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, fullName } = location.state || {};

  useEffect(() => {
    if (!username || !fullName) {
      navigate('/');
    }
  }, [username, fullName, navigate]);

  const handleGameEnd = async (score: number) => {
    navigate('/');
    try {
      const response = await sendGameResult({
        username,
        fullName,
        score,
      });
      console.log('Game result sent:', response.data);
    } catch (error) {
      console.error('Error sending result:', error);
    }
  };

  return <Game onEnd={handleGameEnd} />;
};

export default GamePage;
