import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Game from './components/Game';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = (username: string, fullName: string) => {
    setUsername(username);
    setFullName(fullName);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      {isPlaying ? (
        <Game username={username} fullName={fullName} onEnd={handleEnd} />
      ) : (
        <HomePage onStart={handleStart} />
      )}
    </div>
  );
};

export default App;
