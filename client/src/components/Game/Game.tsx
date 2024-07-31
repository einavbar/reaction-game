import React, { useState, useEffect, useRef } from 'react';
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
  gameDuration = 60000,
  roundDuration = 1000,
  shapeSize = 200,  
  minWaitingDuration = 2000,
  maxWaitingDuration = 5000,
}) => {
  const [shapePosition, setShapePosition] = useState<'left' | 'right'>();
  const [roundStatus, setRoundStatus] = useState<RoundStatus | null>();
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [displayShape, setDisplayShape] = useState(false);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // set random time for waiting state and start the game after that
  useEffect(() => {
    // display instruction
    const waitingDuration = Math.random() * (maxWaitingDuration - minWaitingDuration) + minWaitingDuration;
    setTimeout(() => {
      // stop display instructions and start the game
      setDisplayShape(true);
      setTimeout(() => {
        onEnd(scoreRef.current);
      }, gameDuration); 
    }, waitingDuration);
  }, []);

  // display shape for roundDuration and hide it for 1 second
  useEffect(() => {
    if (displayShape) {
      setTimeout(() => {
        if(roundStatus === null) {
          setRoundStatus(RoundStatus.TooLate);
        }
        setDisplayShape(false);
        setTimeout(() => {
          setRoundStatus(null);
          setDisplayShape(true); 
          setShapePosition(Math.random() < 0.5 ? 'left' : 'right');

      }, 1000);

    }, roundDuration);
  }
  }, [displayShape]);

  // listen for key press events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEnd(scoreRef.current);
      } else if (!displayShape) {
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
  }, [shapePosition, displayShape, score, onEnd]);
  
  return (
    <div>
      {displayShape && <Shape position={shapePosition} size={shapeSize} />}
      <ScoreDisplay score={score}/>
      {roundStatus && (<Feedback status={roundStatus} />)}
    </div>
  );
};

export default Game;
