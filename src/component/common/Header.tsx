import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const Header = () => {
  const location = useLocation();
  const isRegist = location.pathname === '/regist';

  return (
    <StyledHeader $isRegist={isRegist}>
      <h1>{isRegist ? 'Make Your Plan' : 'What to do Today'}</h1>
    </StyledHeader>
  );
};

const StyledHeader = styled.div<{ $isRegist: boolean }>`
  background-color: ${(props) => props.$isRegist ? '#d9d9d9' : 'inherit'};
  text-align: center;
  margin: 0 auto;
  width: 360px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  
  h1 {
    padding: 20px 0;
    margin: 0;
  }
`;
