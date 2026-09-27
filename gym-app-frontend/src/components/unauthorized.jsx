import styled from "styled-components";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <Wrapper>
    <Icon className="fas fa-lock" />
    <Code>401</Code>
    <Title>Unauthorised Access</Title>
    <Subtitle>You need to be logged in to view this page.</Subtitle>
    <ButtonGroup>
      <PrimaryButton to="/login">Sign In</PrimaryButton>
      <SecondaryButton to="/">Back to Home</SecondaryButton>
    </ButtonGroup>
  </Wrapper>
);

export default Unauthorized;

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

const Icon = styled.i`
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 16px;
`;

const Code = styled.h1`
  font-family: 'Oswald', sans-serif;
  font-size: 7rem;
  color: #e74c3c;
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 1.7rem;
  margin: 10px 0 10px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled(Link)`
  padding: 12px 28px;
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

const SecondaryButton = styled(Link)`
  padding: 12px 28px;
  background-color: transparent;
  color: #fff;
  border: 1px solid #333;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: border-color 0.2s;

  &:hover {
    border-color: #ff6b00;
  }
`;
