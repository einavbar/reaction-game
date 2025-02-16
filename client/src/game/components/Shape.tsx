import styled from 'styled-components';

type ShapeProps = {
  position: 'left' | 'right' | undefined;
  size: number 
};

const ShapeContainer = styled.div<{ position: 'left' | 'right'| undefined; size: number }>`
position: absolute;
${({ position }) => position}: 10%;
top: 50%;
width: ${({ size }) => size}px;
height: ${({ size }) => size}px;
background-color: black;
border-radius: 50%;
transform: translateY(-50%);
`;

const Shape = ( { position, size }: ShapeProps) => {
  return <ShapeContainer position={position} size={size}/>;
};

export default Shape;