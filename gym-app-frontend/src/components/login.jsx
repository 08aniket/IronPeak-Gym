import { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { API } from "../api";

// Using high-quality Unsplash gym images via URL (no local file needed)
const BG_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=90";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API}/generateToken`, { email, password });
      const { accessToken: token, refreshToken: refresh, role } = response.data;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userRole", JSON.stringify(role));
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      {/* Left panel — hero */}
      <HeroPanel style={{ backgroundImage: `url(${BG_IMAGE})` }}>
        <HeroOverlay />
        <HeroContent>
          <GymBadge>IRONPEAK</GymBadge>
          <HeroTitle>
            <LoginLogo src={logoImg} alt="IronPeak Gym" />
          </HeroTitle>
          <HeroMeta>
            <MetaItem><i className="fas fa-map-marker-alt" /> Salt Lake City, Kolkata</MetaItem>
            <MetaItem><i className="fas fa-phone" /> +91 98765 43210</MetaItem>
            <MetaItem><i className="fas fa-calendar" /> Est. 2024</MetaItem>
          </HeroMeta>
          <StatsRow>
            <StatBox><StatNum>500+</StatNum><StatLbl>Members</StatLbl></StatBox>
            <StatBox><StatNum>₹10L+</StatNum><StatLbl>Payments</StatLbl></StatBox>
            <StatBox><StatNum>1000+</StatNum><StatLbl>Renewals</StatLbl></StatBox>
          </StatsRow>
          <PoweredBy>IronPeak Gym Management System · v2.0</PoweredBy>
        </HeroContent>
      </HeroPanel>

      {/* Right panel — form */}
      <FormPanel>
        <FormInner>
          <FormTitle>WELCOME BACK</FormTitle>
          <FormSubtitle>Sign in to access your gym dashboard</FormSubtitle>

          {error && <ErrorAlert><i className="fas fa-exclamation-circle" /> {error}</ErrorAlert>}

          <form onSubmit={handleLogin}>
            <FieldLabel>EMAIL</FieldLabel>
            <FieldInput
              type="email"
              placeholder="admin@ironpeak.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <FieldLabel>PASSWORD</FieldLabel>
            <FieldInput
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <LoginBtn type="submit" disabled={loading}>
              {loading
                ? <><i className="fas fa-spinner fa-spin" /> SIGNING IN...</>
                : <><i className="fas fa-arrow-right" /> LOGIN TO DASHBOARD</>}
            </LoginBtn>
          </form>

          <Divider />
          <FooterLinks>
            <Link to="/password">Forgot password?</Link>
            <span>·</span>
            <Link to="/join">New member? Join Now</Link>
          </FooterLinks>
        </FormInner>
      </FormPanel>
    </PageWrapper>
  );
};

export default Login;

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

const HeroPanel = styled.div`
  flex: 1.1;
  position: relative;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  @media(max-width:768px){display:none;}
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,rgba(0,0,0,0.85) 0%,rgba(20,0,0,0.6) 100%);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 50px 44px;
  width: 100%;
  animation: ${fadeIn} 0.6s ease;
`;

const GymBadge = styled.div`
  display: inline-block;
  background: #ff6b00;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 3px;
  padding: 4px 12px;
  margin-bottom: 16px;
`;

const HeroTitle = styled.div`margin: 0 0 16px;`;

const LoginLogo = styled.img`
  height: 160px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 30px rgba(255,107,0,0.5));
`;

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
`;

const MetaItem = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  i{color:#ff6b00;}
`;

const StatsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
`;

const StatBox = styled.div`
  border-left: 2px solid #ff6b00;
  padding-left: 12px;
`;

const StatNum = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #ff6b00;
`;

const StatLbl = styled.div`
  font-size: 0.72rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PoweredBy = styled.div`
  color: #444;
  font-size: 0.75rem;
  letter-spacing: 1px;
`;

const FormPanel = styled.div`
  width: 420px;
  flex-shrink: 0;
  background: #0d0d0d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
  @media(max-width:768px){width:100%;}
`;

const FormInner = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease 0.1s both;
`;

const FormTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  margin: 0 0 6px;
`;

const FormSubtitle = styled.p`
  color: #555;
  font-size: 0.85rem;
  margin-bottom: 28px;
`;

const FieldLabel = styled.label`
  display: block;
  color: #666;
  font-size: 0.72rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  margin-top: 16px;
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #111;
  border: 1px solid #222;
  border-radius: 4px;
  color: #fff;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  &:focus{outline:none;border-color:#ff6b00;}
  &::placeholder{color:#333;}
`;

const LoginBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s, transform 0.1s;
  &:hover:not(:disabled){background:#e05e00;color:#fff;transform:translateY(-1px);}
  &:disabled{opacity:0.6;cursor:not-allowed;}
`;

const ErrorAlert = styled.div`
  background: rgba(231,76,60,0.1);
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  i{margin-right:6px;}
`;

const Divider = styled.hr`
  border:none;border-top:1px solid #1a1a1a;margin:20px 0;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #444;
  a{color:#ff8b35;text-decoration:none;&:hover{color:#fff;text-decoration:underline;}}
`;
