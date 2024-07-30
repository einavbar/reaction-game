import React from 'react';
import styled from 'styled-components';

export enum Status {
    TooSoon,
    TooLate,
    WrongSide,
    Success,
 }

type MessageProps = {
  status: Status;
};

const Message = styled.div<{ isSuccess: boolean }>`
  color: ${({ isSuccess }) => (isSuccess ? 'green' : 'red')};
  font-size: 24px;
  margin-top: 20px;
`;


const Feedback: React.FC<MessageProps> = ({ status }) => {
  let message = '';

  switch (status) {
    case Status.TooSoon:
      message = 'You pressed too soon!';
      break;
    case Status.TooLate:
      message = 'You pressed too late!';
      break;
    case Status.WrongSide:
      message = 'You pressed the wrong side!';
      break;
    case Status.Success:
      message = 'Success! You pressed correctly!';
      break;
    default:
      message = '';
  }

  return <Message isSuccess={status === Status.Success
  }>{message}</Message>;
};

export default Feedback;
