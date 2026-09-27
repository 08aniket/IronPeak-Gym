import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../api";
import Footer from "./footer";

const MembershipPlans = () => {
  const [plans, setPlans] = useState([
    { title: "1 MONTH", duration: "1 Month", price: 1200, icon: "fa-bolt" },
    { title: "3 MONTHS", duration: "3 Months", price: 3000, icon: "fa-dumbbell" },
    { title: "6 MONTHS", duration: "6 Months", price: 5500, icon: "fa-medal" },
    { title: "12 MONTHS", duration: "12 Months", price: 10000, icon: "fa-trophy", popular: true },
  ]);

  const [features] = useState([
    "Full gym access",
    "Group fitness classes",
    "Locker room access",
    "RFID smart card entry",
    "Body measurement tracking",
    "Email renewal reminders",
  ]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(
          `${API}/prices`
        );
        const { oneMonths, threeMonths, sixMonths, twelveMonths } = response.data;
        setPlans([
          { title: "1 MONTH", duration: "1 Month", price: oneMonths, icon: "fa-bolt" },
          { title: "3 MONTHS", duration: "3 Months", price: threeMonths, icon: "fa-dumbbell" },
          { title: "6 MONTHS", duration: "6 Months", price: sixMonths, icon: "fa-medal" },
          { title: "12 MONTHS", duration: "12 Months", price: twelveMonths, icon: "fa-trophy", popular: true },
        ]);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };
    fetchPrices();
  }, []);

  return (
    <>
      <PageWrapper>
        <PlansIntro>
          <IntroEyebrow>YOUR NEXT REP STARTS HERE</IntroEyebrow>
          <PageTitle>Membership Plans</PageTitle>
          <Subtitle>Choose your pace. We&apos;ll help you build the consistency.</Subtitle>
        </PlansIntro>
        <PlanContainer>
          {plans.map((plan, index) => (
            <Plan key={index} $popular={plan.popular} style={{ animationDelay: `${index * 0.15}s` }}>
              <PlanTopline><PlanIcon $popular={plan.popular}><i className={`fas ${plan.icon}`} /></PlanIcon>{plan.popular && <PopularBadge>BEST VALUE</PopularBadge>}</PlanTopline>
              <PlanDuration>{plan.title}</PlanDuration>
              <PriceDisplay>₹{Number(plan.price).toLocaleString("en-IN")}</PriceDisplay>
              <PlanSubtext>/ {plan.duration}</PlanSubtext>
              {index > 0 && <MonthlyRate>₹{Math.round(Number(plan.price) / (index === 1 ? 3 : index === 2 ? 6 : 12)).toLocaleString("en-IN")} / month</MonthlyRate>}
              <Divider />
              <FeatureList>
                {features.map((f, i) => (
                  <Feature key={i}>
                    <i className="fas fa-check" />
                    {f}
                  </Feature>
                ))}
              </FeatureList>
              <JoinButton to="/join">Choose this plan <i className="fas fa-arrow-right" /></JoinButton>
            </Plan>
          ))}
        </PlanContainer>
        <Note>
          All plans include a one-time registration fee. Contact us at{" "}
          <a href="mailto:contact@ironpeakgym.in">contact@ironpeakgym.in</a> for
          corporate or student discounts.
        </Note>
      </PageWrapper>
      <Footer />
    </>
  );
};

const PageWrapper = styled.div`
  background-color: #050505;
  min-height: 100vh;
  padding: 100px clamp(16px,4vw,56px) 72px;
  color: #fff;
  width: 100%;
  @media(max-width:600px){padding:88px 14px 40px;}
`;

const PlansIntro = styled.div`max-width:760px;margin:0 auto 46px;text-align:center;`;
const IntroEyebrow = styled.div`color:#ff8b35;font-weight:800;font-size:.7rem;letter-spacing:3px;margin-bottom:10px;`;

const PageTitle = styled.h1`
  font-family: 'Oswald', sans-serif;
  text-align: center;
  font-size: 2.8rem;
  letter-spacing: 3px;
  margin-bottom: 10px;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: #ff6b00;
    margin: 10px auto 0;
  }
  @media(max-width:600px){font-size:2.15rem;letter-spacing:2px;}
`;

const Subtitle = styled.p`
  text-align: center;
  color: #888;
  margin-bottom: 50px;
  font-size: 1rem;
`;

const PlanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;max-width:1320px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Plan = styled.div`
  background:${({ $popular }) => ($popular ? "radial-gradient(ellipse at 50% 0%,rgba(255,107,0,.2),transparent 55%),linear-gradient(155deg,#1b1713,#101010)" : "linear-gradient(155deg,#181818,#101010)")};
  border:${({ $popular }) => ($popular ? "1px solid rgba(255,107,0,.68)" : "1px solid #292929")};
  padding:28px 24px 24px;border-radius:14px;min-height:100%;
  text-align: center;
  position: relative;
  overflow:hidden;
  box-shadow:0 18px 40px rgba(0,0,0,.2);
  animation: ${fadeUp} 0.5s ease-out both;
  transition: transform 0.35s ease, box-shadow 0.35s ease,border-color .35s ease;
  &::after{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:${p => p.$popular ? "#ff6b00" : "#343434"};transition:height .25s ease;}

  &:hover {
    transform: translateY(-9px);
    box-shadow: 0 26px 55px rgba(255,107,0,0.16);border-color:rgba(255,107,0,.55);
    &::after{height:5px;background:#ff6b00;}
  }
`;

const PlanTopline = styled.div`display:flex;align-items:center;justify-content:space-between;min-height:50px;margin-bottom:14px;`;
const PlanIcon = styled.div`width:46px;height:46px;display:grid;place-items:center;border-radius:14px;color:${p => p.$popular ? "#ff8b35" : "#b9b9b9"};background:${p => p.$popular ? "rgba(255,107,0,.14)" : "#222"};border:1px solid ${p => p.$popular ? "rgba(255,107,0,.35)" : "#343434"};font-size:1rem;`;
const MonthlyRate = styled.div`color:#91c9a2;font-size:.76rem;font-weight:700;margin-top:8px;`;

const PopularBadge = styled.div`
  background-color: #ff6b00;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 14px;
  border-radius: 20px;
  letter-spacing: 1px;
`;

const PlanDuration = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: 1.3rem;
  letter-spacing: 2px;
  color: #ccc;
  margin-bottom: 16px;
`;

const PriceDisplay = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #fff;
`;

const PlanSubtext = styled.p`
  color: #666;
  font-size: 0.85rem;
  margin-top: 4px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #222;
  margin: 20px 0;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  text-align: left;
`;

const Feature = styled.li`
  color: #aaa;
  font-size: 0.9rem;
  padding: 5px 0;
`;

const JoinButton = styled(Link)`
  display: block;
  padding: 10px;
  background:linear-gradient(100deg,#ff6b00,#df5200);
  color: #fff;
  font-weight: 700;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: transform .25s ease,box-shadow .25s ease,filter .25s ease;
  i{margin-left:8px;transition:transform .25s ease;}

  &:hover {
    color:#fff;filter:brightness(1.1);transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,107,0,.22);
    i{transform:translateX(4px);}
  }
`;

const Note = styled.p`
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  margin-top: 40px;

  a {
    color: #ff6b00;
  }
`;

export default MembershipPlans;
