import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

type GameProps = {
  onEnd: (score: number) => void;
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
  onEnd,
  gameDuration = 10000,
  minWaitingTime = 2000,
  maxWaitingTime = 5000,
  shapeSize = 200,  
}) => {
  const [shapePosition, setShapePosition] = useState<'left' | 'right' | null>(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [displayShape, setDisplayShape] = useState(false);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // set random time for waiting state and start the game after that
  useEffect(() => {
    const waitingTime = Math.random() * (maxWaitingTime - minWaitingTime) + minWaitingTime;
    setTimeout(() => {
      setDisplayShape(true);
      setTimeout(() => {
        onEnd(scoreRef.current);
      }, gameDuration);
    }, waitingTime);
  }, []);

  // display shape for 1 second and hide it for 1 second
  useEffect(() => {
    if (displayShape) {
      const dispalyShapeTime = 1000;
      const timeWithoutShape = 1000;
      setTimeout(() => {
        setShapePosition(null)
        setDisplayShape(false);
        setMessage('');
        setTimeout(() => {
          setDisplayShape(true); 
          setShapePosition(Math.random() < 0.5 ? 'left' : 'right');

      }, timeWithoutShape);

    }, dispalyShapeTime);
  }
  }, [ displayShape ]);

  // listen for key press events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEnd(scoreRef.current);
      } else if (!displayShape) {
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
  }, [shapePosition, displayShape, scoreRef.current]);
  
  return (
    <div>
      {shapePosition && <Shape position={shapePosition} size={shapeSize} />}
      <div>Score: {score}</div>
      <Message isError={message === 'Too soon' || message === 'Wrong side' || message === 'Too late'}>
        {message}
      </Message>
    </div>
  );
};

export default Game;
