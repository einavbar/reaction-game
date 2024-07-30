import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Game from './Game';


const GamePage: React.FC<{}> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, fullName } = location.state || {};

  useEffect(() => {
    if (!username || !fullName) {
      navigate('/');
    }
  }, [username, fullName, navigate]);

  return <Game username={username} fullName={fullName} onEnd={()=> navigate('/')} />;
 
}
export default GamePage;
