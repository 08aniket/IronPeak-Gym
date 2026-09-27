import styled from "styled-components";
import { Link } from "react-router-dom";

const NotFound = () => (
  <Wrapper>
    <Code>404</Code>
    <Title>Page Not Found</Title>
    <Subtitle>The page you&apos;re looking for doesn&apos;t exist or has been moved.</Subtitle>
    <HomeButton to="/">Back to Home</HomeButton>
  </Wrapper>
);

export default NotFound;

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
`;

const Code = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: 8rem;
  color: #ff6b00;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 1.8rem;
  margin: 10px 0 12px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 30px;
`;

const HomeButton = styled(Link)`
  padding: 12px 32px;
  background-color: #ff6b00;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 700;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e05e00;
  }
`;
