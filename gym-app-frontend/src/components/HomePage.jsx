import styled, { keyframes } from "styled-components";
import heroBg from "../assets/gy.jpg";
import firstImage from "../assets/a.jpg";
import secondImage from "../assets/gym2.webp";
import thirdImage from "../assets/gym3.webp";
import img1 from "../assets/fit.jpg";
import img2 from "../assets/yoga.jpg";
import img3 from "../assets/fines.jpg";
import img4 from "../assets/bks.jpg";
import { Link } from "react-router-dom";
import i1 from "../assets/img1.jpg";
import i2 from "../assets/img2.jpg";
import i3 from "../assets/img3.jpg";
import i4 from "../assets/img4.jpg";
import i5 from "../assets/img5.jpg";
import i6 from "../assets/img6.jpg";
import i7 from "../assets/img7.jpg";
import i8 from "../assets/img8.jpg";
import i9 from "../assets/img9.jpg";
import i10 from "../assets/img10.jpg";
import i11 from "../assets/img11.jpg";
import i12 from "../assets/img12.jpg";
import Footer from "./footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomePage = () => (
  <>
    <HeroSection>
      <HeroImage src={heroBg} alt="IronPeak Gym" />
      <HeroOverlay />
      <MotivationalText>
        <HeroTagline>INDIA&apos;S PREMIER FITNESS DESTINATION</HeroTagline>
        <MainText>IRON<span>PEAK</span></MainText>
        <HeroSub>GYM &amp; FITNESS CENTER</HeroSub>
        <HeroCTA to="/join">START YOUR JOURNEY →</HeroCTA>
      </MotivationalText>
      <HeroScrollHint><i className="fas fa-chevron-down" /></HeroScrollHint>
    </HeroSection>
    <StatsSection>
      <StatItem><StatNum>4</StatNum><StatLbl>Membership Plans</StatLbl></StatItem><StatDivider />
      <StatItem><StatNum>IoT</StatNum><StatLbl>Smart Access</StatLbl></StatItem><StatDivider />
      <StatItem><StatNum>Live</StatNum><StatLbl>Occupancy Tracking</StatLbl></StatItem><StatDivider />
      <StatItem><StatNum>1</StatNum><StatLbl>Connected Community</StatLbl></StatItem>
    </StatsSection>
    <AboutUs />
    <CustomizedPrograms />
    <OurTeam />
    <Gallery />
    <Footer />
  </>
);

const AboutUs = () => (
  <Section>
    <AboutUsContainer>
      <AboutText>
        <StepHeader><StepIcon $tone="orange"><i className="fas fa-link" /></StepIcon><StepIndex>01</StepIndex></StepHeader>
        <AccentHeading>Who We Are</AccentHeading>
        <h2>&quot;Be Part of a Stronger Community&quot;</h2>
        <p>IronPeak Gym is a fitness community built to support healthy living and personal growth. Our expert trainers and state-of-the-art facilities cater to every fitness level — from first-timers to seasoned athletes. We believe every rep counts and every goal is worth chasing.</p>
      </AboutText>
      <AboutText>
        <StepHeader><StepIcon $tone="green"><i className="fas fa-dumbbell" /></StepIcon><StepIndex>02</StepIndex></StepHeader>
        <AccentHeading>Our Mission</AccentHeading>
        <h2>&quot;Healthy Living. Real Results.&quot;</h2>
        <p>Our mission is to make fitness accessible, motivating, and results-driven. We provide personalised training programs and group classes that fit your schedule and match your ambition. Together, we build stronger bodies and sharper minds.</p>
      </AboutText>
      <AboutText>
        <StepHeader><StepIcon $tone="blue"><i className="fas fa-weight-hanging" /></StepIcon><StepIndex>03</StepIndex></StepHeader>
        <AccentHeading>Our Promise</AccentHeading>
        <h2>&quot;Smarter Training. Stronger Community.&quot;</h2>
        <p>Founded by Aniket Shaw, IronPeak Gym aspires to be India&apos;s premier fitness destination — where technology meets training. From IoT-powered smart access to digital member management, we&apos;re building the gym of tomorrow.</p>
      </AboutText>
    </AboutUsContainer>
  </Section>
);

const CustomizedPrograms = () => (
  <Section>
    <SectionTitle>Our Programs</SectionTitle>
    <ProgramSection>
      <ProgramImage src={firstImage} alt="Custom Programs" />
      <ProgramText>
        <h3>Personalised Training Programs</h3>
        <p>
          At IronPeak, reaching your dream physique is within reach. Our trainers
          design custom workout plans tailored to your goals — whether it&apos;s weight
          loss, muscle gain, or endurance. With 100+ program options available,
          you&apos;ll always have a plan that works for you.
        </p>
      </ProgramText>
    </ProgramSection>

    <ProgramSection>
      <ProgramText>
        <h3>GFX: Full Body Workout in 30 Minutes</h3>
        <p>
          Short on time? The GFX (Gym Floor Exercise) program burns maximum
          calories across all muscle groups in just 30 minutes. High-intensity
          HIIT themes, trainer-guided sessions, and zone-focused training — all
          packed into one powerful workout.
        </p>
      </ProgramText>
      <ProgramImage src={secondImage} alt="GFX Program" />
    </ProgramSection>

    <ProgramSection>
      <ProgramImage src={thirdImage} alt="Fitness Journey" />
      <ProgramText>
        <h3>We&apos;re With You Every Step</h3>
        <p>
          IronPeak isn&apos;t just a gym — it&apos;s a system. From IoT smart card check-in
          to digital body measurement tracking, we give you real data to track real
          progress. Sign up today and step into a stronger, healthier future.
        </p>
      </ProgramText>
    </ProgramSection>
  </Section>
);

const OurTeam = () => (
  <Section>
    <SectionTitle>Ways To Train</SectionTitle>
    <OurTeamContainer>
      <TeamText>
        <TeamImageWrap><TeamImage src={img1} alt="Pilates" /><TeamBadge $tone="orange"><i className="fas fa-spa" /></TeamBadge></TeamImageWrap>
        <TeamCopy><TeamTag>Mobility / Core</TeamTag><h2>PILATES</h2>
          <p>
            Pilates strengthens your core, improves posture and flexibility, and
            brings mental clarity. Our certified instructors guide you through
            breathing-focused routines adapted to your personal goals.
          </p>
        </TeamCopy>
      </TeamText>
      <TeamText>
        <TeamImageWrap><TeamImage src={img2} alt="Yoga" /><TeamBadge $tone="green"><i className="fas fa-leaf" /></TeamBadge></TeamImageWrap>
        <TeamCopy><TeamTag>Balance / Breath</TeamTag><h2>YOGA</h2>
          <p>
            Yoga unites body and mind. Multi-level classes help you build
            flexibility, reduce stress, and rediscover your body&apos;s full potential.
            Find your balance with our experienced yoga teachers.
          </p>
        </TeamCopy>
      </TeamText>
      <TeamText>
        <TeamImageWrap><TeamImage src={img3} alt="Strength and conditioning" /><TeamBadge $tone="blue"><i className="fas fa-dumbbell" /></TeamBadge></TeamImageWrap>
        <TeamCopy><TeamTag>Power / Progress</TeamTag><h2>STRENGTH &amp; CONDITIONING</h2>
          <p>
            General fitness training targeting all muscle groups — combining
            cardio, strength, and endurance. Group classes and solo sessions
            available at all levels.
          </p>
        </TeamCopy>
      </TeamText>
      <TeamText>
        <TeamImageWrap><TeamImage src={img4} alt="Kickboxing" /><TeamBadge $tone="red"><i className="fas fa-hand-fist" /></TeamBadge></TeamImageWrap>
        <TeamCopy><TeamTag>Fight / Focus</TeamTag><h2>KICKBOXING</h2>
          <p>
            Kickboxing builds physical endurance, coordination, and confidence.
            Train with our coaches to sharpen your technique while burning serious
            calories in a high-energy environment.
          </p>
        </TeamCopy>
      </TeamText>
    </OurTeamContainer>
  </Section>
);

const Gallery = () => (
  <Section>
    <SectionTitle>Gallery</SectionTitle>
    <GalleryContainer>
      <ImagesGrid>
        {[i11, i2, i9, i4, i5, i12, i7, i8, i3, i10, i1, i6].map((src, index) => (
          <ImageWrapper key={index}>
            <StyledImage src={src} alt={`IronPeak Gym ${index + 1}`} />
          </ImageWrapper>
        ))}
      </ImagesGrid>
    </GalleryContainer>
  </Section>
);

// ── Styled Components ──────────────────────────────────────────

const heroReveal = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const bounce = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}`;
const countUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const scrollReveal = keyframes`from{opacity:0;transform:translateY(34px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}`;

const HeroSection = styled.div`
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: grayscale(30%);
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.6) 50%,
    rgba(255,107,0,0.08) 100%
  );
  z-index: 1;
`;

const MotivationalText = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 20px;
`;

const HeroTagline = styled.div`
  font-size: 0.75rem;
  letter-spacing: 5px;
  color: #ff6b00;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0;
  animation: ${heroReveal} 0.6s ease 0.2s forwards;
`;

const MainText = styled.h1`
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(5rem, 14vw, 11rem);
  font-weight: 800;
  color: #fff;
  line-height: 0.9;
  margin: 0;
  letter-spacing: -2px;
  text-shadow: 0 0 60px rgba(255,107,0,0.3);
  opacity: 0;
  animation: ${heroReveal} 0.7s ease 0.4s forwards;

  span {
    color: #ff6b00;
    display: block;
  }
`;

const HeroSub = styled.div`
  font-size: 0.85rem;
  letter-spacing: 8px;
  color: #888;
  text-transform: uppercase;
  margin-top: 16px;
  opacity: 0;
  animation: ${heroReveal} 0.6s ease 0.6s forwards;
`;

const HeroCTA = styled(Link)`
  margin-top: 36px;
  padding: 14px 40px;
  background: #ff6b00;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-decoration: none;
  border-radius: 2px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  opacity: 0;
  animation: ${heroReveal} 0.6s ease 0.8s forwards;
  &:hover {
    background: #e05e00;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255,107,0,0.4);
  }
`;

const HeroScrollHint = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: #555;
  font-size: 1rem;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const StatsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 60px;
  background: #0d0d0d;
  border-bottom: 1px solid #1a1a1a;
  gap: 0;
  flex-wrap: wrap;
  @media(max-width:600px){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:28px 14px;gap:0 8px;}
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0 60px;
  opacity: 0;
  animation: ${countUp} 0.8s ease forwards;
  animation-delay: 0.2s;
  @media(max-width:600px){padding:16px 6px;}
`;

const StatNum = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 3.2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  span { color: #ff6b00; }
  @media(max-width:600px){font-size:2.35rem;}
`;

const StatLbl = styled.div`
  color: #666;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 6px;
  @media(max-width:600px){font-size:0.62rem;letter-spacing:1px;}
`;

const StatDivider = styled.div`
  width: 1px;
  height: 50px;
  background: #222;
  @media(max-width:600px){display:none;}
`;

const Section = styled.section`
  padding: 80px 60px;
  background-color: #0a0a0a;
  @media(max-width:768px){padding:60px 24px;}
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-size: 2.2rem;
  color: #fff;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 48px;

  &::after {
    content: '';
    display: block;
    width: 48px;
    height: 3px;
    background: #ff6b00;
    margin: 12px auto 0;
  }
`;

const AccentHeading = styled.h3`
  color: #ff6b00;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  margin-bottom: 8px;
`;

const AboutUsContainer = styled.div`
  position:relative;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
`;

const StepHeader = styled.div`
  position:relative;z-index:2;display:flex;align-items:center;gap:10px;margin-bottom:14px;
`;

const StepIcon = styled.div`
  width:48px;height:48px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:1.05rem;
  background:${p => p.$tone === "green" ? "#277a55" : p.$tone === "blue" ? "#2879a8" : "#c65b0b"};
  border:5px solid #111;box-shadow:0 0 0 1px #3a3a3a,0 8px 18px rgba(0,0,0,.28);
  transition:transform .3s ease,box-shadow .3s ease;
`;

const StepIndex = styled.span`
  font-family:'Rajdhani',sans-serif;font-size:.78rem;font-weight:800;letter-spacing:1px;color:#a0a0a0;
`;

const AboutText = styled.div`
  flex: 1;
  min-width: 240px;
  padding: 32px 28px;
  background: #111;
  border: 1px solid #1e1e1e;
  border-top: 3px solid #ff6b00;
  color: #ccc;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  position:relative;

  &:not(:last-child)::after{
    content:"";position:absolute;z-index:1;top:54px;right:-20px;width:20px;height:2px;
    background:repeating-linear-gradient(90deg,#ff6b00 0 7px,transparent 7px 11px);
    filter:drop-shadow(0 0 4px rgba(255,107,0,.6));
  }
  &:not(:last-child)::before{
    content:"";position:absolute;z-index:1;top:48px;right:-25px;width:12px;height:12px;
    border:2px solid #ff6b00;border-radius:50%;background:#111;box-shadow:0 0 0 4px #111;
  }

  @supports (animation-timeline: view()) {
    animation: ${scrollReveal} linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 32%;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(255,107,0,0.15);
  }
  &:hover ${StepIcon}{transform:rotate(-8deg) scale(1.08);box-shadow:0 0 0 1px #ff6b00,0 10px 22px rgba(255,107,0,.22);}

  h2 {
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    margin: 8px 0 16px;
  }

  p { line-height: 1.7; font-size: 0.9rem; }

  @media(max-width:768px){
    &:not(:last-child)::after{top:auto;right:auto;left:24px;bottom:-20px;width:2px;height:20px;background:repeating-linear-gradient(180deg,#ff6b00 0 7px,transparent 7px 11px);}
    &:not(:last-child)::before{top:auto;right:auto;left:19px;bottom:-25px;}
  }
`;

const ProgramSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 60px;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.2s;
  @supports (animation-timeline: view()) {
    animation: ${scrollReveal} linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
`;

const ProgramImage = styled.img`
  width: 48%;
  height: 320px;
  border-radius: 4px;
  object-fit: cover;
  transition:transform .7s cubic-bezier(.2,.7,.2,1),filter .7s ease;
  filter:saturate(.82) contrast(1.05);
  &:hover{transform:scale(1.035);filter:saturate(1.08) contrast(1.08);}
  @media(max-width:768px){width:100%;height:220px;}
`;

const ProgramText = styled.div`
  flex: 1;
  min-width: 240px;
  padding: 32px;
  background: #111;
  color: #ccc;
  border-left: 3px solid #ff6b00;

  h3 {
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 14px;
    letter-spacing: 1px;
  }
  p { line-height: 1.7; font-size: 0.9rem; }
`;

const OurTeamContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media(max-width:900px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:500px){grid-template-columns:1fr;}
`;

const TeamText = styled.div`
  position:relative;background:linear-gradient(145deg,#191919,#0d0d0d);
  border:1px solid #292929;border-radius:16px;overflow:hidden;
  color: #ccc;
  box-shadow:0 16px 30px rgba(0,0,0,.24);
  transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .45s ease,border-color .3s ease;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;

  @supports (animation-timeline: view()) {
    animation: ${scrollReveal} linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }

  &:hover {
    transform:translateY(-12px) rotate(-.5deg);
    border-color:#ff6b00;box-shadow:0 28px 52px rgba(255,107,0,.16);
  }

  &:hover img{transform:scale(1.09);filter:saturate(1.1) contrast(1.08);}
`;

const TeamImageWrap = styled.div`
  position:relative;height:220px;overflow:hidden;background:#090909;
  &::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.78));pointer-events:none;}
`;

const TeamImage = styled.img`
  width:100%;height:100%;display:block;object-fit:cover;filter:saturate(.78) contrast(1.05);
  transition:transform .7s cubic-bezier(.2,.7,.2,1),filter .7s ease;
`;

const TeamBadge = styled.div`
  position:absolute;z-index:2;left:18px;bottom:16px;width:46px;height:46px;border-radius:14px;
  display:grid;place-items:center;color:#fff;font-size:1.05rem;transform:rotate(-8deg);
  background:${p => p.$tone === "green" ? "#2d8b62" : p.$tone === "blue" ? "#2879a8" : p.$tone === "red" ? "#bd3d32" : "#c65b0b"};
  border:1px solid rgba(255,255,255,.3);box-shadow:0 10px 20px rgba(0,0,0,.35);
  transition:transform .35s ease;
  ${TeamText}:hover &{transform:rotate(0) scale(1.1);}
`;

const TeamCopy = styled.div`
  padding:20px 20px 22px;
  h2{color:#fff;font-family:'Rajdhani',sans-serif;letter-spacing:2px;font-size:1.05rem;line-height:1.2;margin:0 0 10px;}
  p{font-size:.84rem;line-height:1.7;margin:0;color:#9a9a9a;}
`;

const TeamTag = styled.div`
  color:#ff6b00;font-size:.64rem;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:7px;
`;

const GalleryContainer = styled.div`padding: 0;`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  @media(max-width:900px){grid-template-columns:repeat(2,1fr);}
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: .86;
  overflow: hidden;
  position: relative;
  padding:10px;
  background:linear-gradient(145deg,#181818,#0e0e0e);
  border:1px solid #303030;
  border-radius:10px;
  box-shadow:0 14px 28px rgba(0,0,0,.28);
  transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease;
  &:hover{transform:translateY(-8px) rotate(-1deg);border-color:#ff6b00;box-shadow:0 22px 42px rgba(255,107,0,.16);}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255,107,0,0);
    transition: background 0.3s;
  }
  &:hover::after { background: rgba(255,107,0,0.15); }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius:6px;
  transition: transform 0.5s ease;
  filter:saturate(.82);
  &:hover{filter:saturate(1.08);}
  ${ImageWrapper}:hover & { transform: scale(1.08); }
`;

export default HomePage;
