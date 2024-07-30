import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { GameResult } from '../types';
import axios from 'axios';

type GameProps = {
  username: string;
  fullName: string;
  onEnd: () => void;
  gameDuration?: number;
  minWaitingTime?: number;
  maxWaitingTime?: number;
  shapeSize?: number;
};

const Shape = styled.div<{ position: 'left' | 'right'; size: number }>`
  position: absolute;
  ${({ position }) => position}: 10%;
  top: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-color: black;
  border-radius: 50%;
  transform: translateY(-50%);
`;

const Message = styled.div<{ isError: boolean }>`
  color: ${({ isError }) => (isError ? 'red' : 'green')};
  font-size: 24px;
  margin-top: 20px;
`;

const Game: React.FC<GameProps> = ({
  username,
  fullName,
  onEnd,
  gameDuration = 60000,
  minWaitingTime = 2000,
  maxWaitingTime = 5000,
  shapeSize = 200,
}) => {
  const [shapePosition, setShapePosition] = useState<'left' | 'right' | null>(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        endGame();
      } else if (shapePosition === null) {
        setMessage('Too soon');
      } else if ((event.key === 'f' && shapePosition === 'left') || (event.key === 'j' && shapePosition === 'right')) {
        setMessage('Well done');
        setScore(score + 1);
      } else {
        setMessage('Wrong side');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [shapePosition, score]);

  useEffect(() => {
    const gameTimer = setTimeout(() => {
      endGame();
    }, gameDuration);

    return () => {
      clearTimeout(gameTimer);
    };
  }, [gameDuration]);

  useEffect(() => {
    if (!isWaiting) {
      const waitingTime = Math.random() * (maxWaitingTime - minWaitingTime) + minWaitingTime;
      setIsWaiting(true);
      setTimeout(() => {
        setShapePosition(Math.random() < 0.5 ? 'left' : 'right');
        setIsWaiting(false);
        timerRef.current = window.setTimeout(() => {
          setShapePosition(null);
          setMessage('Too late');
        }, 1000);
      }, waitingTime);
    }
  }, [isWaiting, minWaitingTime, maxWaitingTime]);

  const endGame = () => {
    sendResult();
    onEnd();
  };

  const sendResult = async () => {
    const result: GameResult = {
      username,
      fullName,
      score,
    };

    try {
      const response = await axios.post('http://localhost:8080/game/result', {
        username,
        fullName,
        score,
      });
      console.log('Game result sent:', response.data);
    } catch (error) {
      console.error('Error sending result:', error);
    }
  };

  return (
    <div>
      {shapePosition && <Shape position={shapePosition} size={shapeSize} />}
      <Message isError={message === 'Too soon' || message === 'Wrong side' || message === 'Too late'}>
        {message}
      </Message>
      <div>Score: {score}</div>
    </div>
  );
};

export default Game;
