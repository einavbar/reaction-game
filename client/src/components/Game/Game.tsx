import React, { useState, useEffect, useRef, useCallback } from 'react';
import Feedback, { RoundStatus } from './Feedback';
import ScoreDisplay from './ScoreDisplay';
import Shape from './Shape';

type GameProps = {
  onEnd: (score: number) => void;
  gameDuration?: number;
  roundDuration?: number;
  shapeSize?: number;
  minWaitingDuration?: number;
  maxWaitingDuration?: number;
};

const Game: React.FC<GameProps> = ({
  onEnd,
  gameDuration = 10000,
  roundDuration = 1000,
  shapeSize = 200,  
  minWaitingDuration = 2000,
  maxWaitingDuration = 5000,
}) => {
  const [waitingState, setWaitingState] = useState(true);
  const [shapePosition, setShapePosition] = useState<'left' | 'right'>();
  const [roundStatus, setRoundStatus] = useState<RoundStatus | null>(null);
  const roundStatusRef = useRef<RoundStatus | null>(null); 
  const [score, setScore] = useState<number>(0);
  const scoreRef = useRef<number>(0);
  const [displayShape, setDisplayShape] = useState(false);

  useEffect(() => {
    // todo display instruction
    const waitingDuration = Math.random() * (maxWaitingDuration - minWaitingDuration) + minWaitingDuration;
    setTimeout(() => {
      setWaitingState(false);
      startGame();
    }, waitingDuration);
  }, []);

  const startGame = () => {
    setTimeout(() => {
      onEnd(scoreRef.current);
    }, gameDuration); 
    setDisplayShape(true);
    setShapePosition(Math.random() < 0.5 ? 'left' : 'right');
  };

  // set timeout for roundDuration and hide shape
  useEffect(() => {
    if (displayShape) {
      setTimeout(() => {
        if(roundStatusRef.current === null) {
          setRoundStatus(RoundStatus.TooLate);
        }          
        setDisplayShape(false);
      }, roundDuration);
  }
}, [displayShape]);

  // set timeout for 1 second and display shape
  useEffect(() => {
    if (!waitingState && !displayShape) {
        setTimeout(() => {
          setRoundStatus(null);
          setDisplayShape(true); 
          setShapePosition(Math.random() < 0.5 ? 'left' : 'right');

      }, 1000);
  }}, [displayShape, waitingState]);

  // listen for key press events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEnd(scoreRef.current);
      } else if (waitingState) {
        setRoundStatus(RoundStatus.TooSoon);
      } else if ((event.key === 'f' && shapePosition === 'left') || (event.key === 'j' && shapePosition === 'right')) {
        setRoundStatus(RoundStatus.Hit);
        setScore(score + 1);
      } else {
        setRoundStatus(RoundStatus.WrongSide);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [shapePosition, score]);

  useEffect(() => {
    roundStatusRef.current = roundStatus;
  }, [roundStatus]);
 
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  return (
    <div>
      {displayShape && <Shape position={shapePosition} size={shapeSize} />}
      <ScoreDisplay score={score}/>
      {roundStatus && (<Feedback status={roundStatus} />)}
    </div>
  );
};

export default Game;
