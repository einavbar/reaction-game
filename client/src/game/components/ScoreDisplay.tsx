import styled from 'styled-components';

const ScoreContainer = styled.div`
  font-size: 24px;
  padding: 10px 20px;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ScoreDisplay = ({ score }: { score: number }) => {
  return <ScoreContainer>Score: {score}</ScoreContainer>;
};

export default ScoreDisplay;