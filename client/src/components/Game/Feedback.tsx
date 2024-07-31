import React from 'react';
import styled from 'styled-components';

export enum RoundStatus {
    None,
    TooSoon,
    TooLate,
    WrongSide,
    Hit,
 }

type MessageProps = {
  status: RoundStatus;
};

const Message = styled.div<{ isSuccess: boolean }>`
  color: ${({ isSuccess }) => (isSuccess ? 'green' : 'red')};
  font-size: 24px;
  margin-top: 20px;
`;


const Feedback: React.FC<MessageProps> = ({ status }) => {
  let message = '';

  switch (status) {
    case RoundStatus.TooSoon:
      message = 'Too soon!';
      break;
    case RoundStatus.TooLate:
      message = 'Too late!';
      break;
    case RoundStatus.WrongSide:
      message = 'Wrong side!';
      break;
    case RoundStatus.Hit:
      message = 'Well done!';
      break;
    default:
      message = '';
  }

  return <Message isSuccess={status === RoundStatus.Hit
  }>{message}</Message>;
};

export default Feedback;
