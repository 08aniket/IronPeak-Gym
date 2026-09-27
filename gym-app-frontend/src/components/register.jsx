import styled from "styled-components";
import { Link } from "react-router-dom";

// Registration is handled by admins via the dashboard.
// This page redirects users to the Join page for interest forms
// or directs them to contact the gym.
const Register = () => {
  return (
    <Wrapper>
      <Card>
        <Icon className="fas fa-dumbbell" />
        <Title>Want to Join IronPeak?</Title>
        <Subtitle>
          New memberships are set up by our staff. Fill in your interest form
          and we&apos;ll get you onboarded.
        </Subtitle>
        <ButtonGroup>
          <PrimaryButton to="/join">Fill Interest Form</PrimaryButton>
          <SecondaryButton to="/contact">Contact Us</SecondaryButton>
        </ButtonGroup>
        <LoginHint>
          Already a member? <Link to="/login">Sign in here</Link>
        </LoginHint>
      </Card>
    </Wrapper>
  );
};

export default Register;

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Card = styled.div`
  background-color: #111;
  border: 1px solid #1e1e1e;
  border-top: 3px solid #ff6b00;
  border-radius: 8px;
  padding: 50px 40px;
  text-align: center;
  max-width: 480px;
  width: 100%;
`;

const Icon = styled.i`
  font-size: 2.5rem;
  color: #ff6b00;
  margin-bottom: 20px;
  display: block;
`;

const Title = styled.h2`
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.9rem;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  color: #888;
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const PrimaryButton = styled(Link)`
  padding: 12px 28px;
  background-color: #ff6b00;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
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
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: #ff6b00;
    color: #ff8b35;
  }
`;

const LoginHint = styled.p`
  color: #555;
  font-size: 0.85rem;

  a {
    color: #ff8b35;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
