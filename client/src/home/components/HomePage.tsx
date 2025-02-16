import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game', { state: { username, fullName } });
  };

  return (
      <form onSubmit={handleStart}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Full Name:
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </label>
      <button type="submit">PLAY</button>
    </form> 
  );
};

export default HomePage;
