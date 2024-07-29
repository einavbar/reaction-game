import React, { useState } from 'react';

type HomePageProps = {
  onStart: (username: string, fullName: string) => void;
};

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onStart(username, fullName);
  };

  return (
    <form onSubmit={handleSubmit}>
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
