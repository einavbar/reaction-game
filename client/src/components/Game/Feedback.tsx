import React, { useMemo } from 'react';
import styled from 'styled-components';

export enum RoundStatus {
    TooSoon,
    TooLate,
    WrongSide,
    Hit,
 }

type MessageProps = {
  status: RoundStatus;
};

const MessageContainer = styled.div<{ isSuccess: boolean }>`
  font-size: 24px;
  color: #fff;
  background-color: ${({ isSuccess }) => (isSuccess ? 'green' : 'red')};;
  padding: 10px 20px;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Feedback: React.FC<MessageProps> = ({ status }) => {
 const message = useMemo(()=> {
    switch (status) {
      case RoundStatus.TooSoon:
        return 'Too soon!';
      case RoundStatus.TooLate:
        return 'Too late!';
      case RoundStatus.WrongSide:
        return 'Wrong side!';
      case RoundStatus.Hit:
        return 'Well done!';
      default:
        return '';
    }
  },[status]);
  const isSuccess = useMemo(() => status === RoundStatus.Hit, [status]);

  return <MessageContainer isSuccess={isSuccess}>{message}</MessageContainer>;
};

export default Feedback;
