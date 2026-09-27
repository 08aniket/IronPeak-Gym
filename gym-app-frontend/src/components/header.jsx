import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => { localStorage.clear(); navigate("/"); };
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  return (
    <HeaderContainer>
      <LogoContainer to="/">
        <LogoImg src={logoImg} alt="IronPeak Gym" />
        <GymName className="gym-name">IRONPEAK GYM</GymName>
      </LogoContainer>

      <NavMenu $open={menuOpen}>
        {[
          { to: "/", label: "Home" },
          { to: "/about", label: "About Us" },
          { to: "/plans", label: "Membership Plans" },
          { to: "/contact", label: "Contact" },
          ...(isLoggedIn ? [{ to: "/dashboard", label: "Dashboard" }] : []),
        ].map(({ to, label }) => (
          <NavItem key={to} to={to} $active={location.pathname === to ? "true" : undefined} onClick={() => setMenuOpen(false)}>
            {label}
          </NavItem>
        ))}
      </NavMenu>

      <AuthButtons>
        {isLoggedIn && (
          <ChangePasswordButton className="change-password" to="/password">Change Password</ChangePasswordButton>
        )}
        {!isLoggedIn && <AuthButtonLogin to="/login">Login</AuthButtonLogin>}
        {!isLoggedIn && <AuthButtonJoin to="/join">Join Now</AuthButtonJoin>}
        {isLoggedIn && (
          <AuthButton as="button" onClick={handleLogout}>LOGOUT</AuthButton>
        )}
      </AuthButtons>
      <MenuToggle type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>
        <i className={`fas fa-${menuOpen ? "xmark" : "bars"}`} />
      </MenuToggle>
    </HeaderContainer>
  );
};

export default Header;

const slideDown = keyframes`from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}`;

const HeaderContainer = styled.header`
  background: rgba(8, 8, 8, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 107, 0, 0.15);
  animation: ${slideDown} 0.4s ease;
  box-sizing: border-box;
  overflow:visible;
  @media(max-width:700px){padding:0 12px;gap:8px;}
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;
  flex-shrink: 0;
  min-width: 0;
`;

const LogoImg = styled.img`
  height: 44px;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
  @media(max-width:700px){height:36px;}
`;

const GymName = styled.span`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.3rem;
  color: #fff;
  font-weight: 700;
  letter-spacing: 2px;
  white-space: nowrap;
  @media(max-width:700px){display:none;}
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 36px;
  @media (max-width: 900px) {
    display:${p => p.$open ? "flex" : "none"};
    position:absolute;top:64px;left:0;right:0;flex-direction:column;gap:0;
    padding:10px 16px 14px;background:rgba(8,8,8,0.98);border-bottom:1px solid #2a2a2a;
  }
`;

const NavItem = styled(Link)`
  color: ${({ $active }) => ($active ? "#ff6b00" : "#aaa")};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;

  &:hover { color: #ff6b00; }

  &::after {
    content: "";
    position: absolute;
    width: ${({ $active }) => ($active ? "100%" : "0")};
    height: 2px;
    background: #ff6b00;
    left: 0;
    bottom: -4px;
    transition: width 0.3s ease;
  }
  &:hover::after { width: 100%; }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  @media(max-width:700px){
    margin-left:auto;
    .change-password{display:none;}
    a,button{padding:6px 10px;font-size:0.72rem;}
  }
`;

const MenuToggle = styled.button`
  display:none;padding:8px 10px;background:transparent;border:1px solid #333;color:#fff;
  border-radius:4px;font-size:0.9rem;
  @media(max-width:900px){display:block;}
  @media(max-width:700px){flex-shrink:0;}
`;

const ChangePasswordButton = styled(Link)`
  padding: 6px 12px;
  background: transparent;
  color: #888;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 0.82rem;
  text-decoration: none;
  transition: all 0.2s;
  &:hover { border-color: #ff6b00; color: #ff6b00; }
`;

const AuthButtonLogin = styled(Link)`
  padding: 7px 18px;
  background: transparent;
  color: #fff;
  border: 1px solid #ff6b00;
  border-radius: 4px;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
  &:hover { background: rgba(255,107,0,0.12); }
`;

const AuthButtonJoin = styled(Link)`
  padding: 7px 18px;
  background: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
  &:hover { background: #e05e00; transform: translateY(-1px); }
`;

const AuthButton = styled.button`
  padding: 7px 18px;
  background: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(231,76,60,0.1); }
`;
