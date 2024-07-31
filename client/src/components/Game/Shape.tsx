import React from 'react';
import styled from 'styled-components';

const ShapeContainer = styled.div<{ position: 'left' | 'right'; size: number }>`
position: absolute;
${({ position }) => position}: 10%;
top: 50%;
width: ${({ size }) => size}px;
height: ${({ size }) => size}px;
background-color: black;
border-radius: 50%;
transform: translateY(-50%);
`;

const Shape = ( { position, size}: { position: 'left' | 'right'; size: number }) => {
  return <ShapeContainer position={position} size={size}/>;
};

export default Shape;