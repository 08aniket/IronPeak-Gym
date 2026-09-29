import { useState } from "react";
import styled, { keyframes } from "styled-components";
import firstImage from "../assets/a.jpg";
import secondImage from "../assets/gym2.webp";
import thirdImage from "../assets/gym3.webp";
import img1 from "../assets/fit.jpg";
import img2 from "../assets/yoga.jpg";
import img3 from "../assets/fines.jpg";
import img4 from "../assets/bks.jpg";
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
import fitnessTracker from "../assets/Fitness tracker-bro.png";
import coachStrengthProvided from "../assets/COACH 1.jpg";
import coachYogaProvided from "../assets/Coach 4.jpg";
import coachMobility from "../assets/coach-mobility.jpg";
import coachConditioning from "../assets/coach-conditioning.jpg";
import progressLossStart from "../assets/progress-loss-start.jpg";
import progressLossGoal from "../assets/progress-loss-goal.jpg";
import progressGainStart from "../assets/progress-gain-start.jpg";
import progressGainGoal from "../assets/progress-gain-goal.jpg";
import Footer from "./footer";
import CinematicScroll from "./CinematicScroll";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomePage = () => (
  <>
    <CinematicScroll />
    <RibbonBar>
      <RibbonTrack>
        {[
          "PRECISION NUTRITION", "ELITE COACHING", "STRENGTH TRAINING",
          "FITBIT WELLNESS", "FAT LOSS EXPERTS", "NASM CERTIFIED COACHES",
          "PROGRESSIVE OVERLOAD", "BODY RECOMPOSITION", "IOT GYM ACCESS",
          "OPTIMUM NUTRITION", "CARDIO & ENDURANCE", "TECHNOGYM EQUIPMENT",
          // duplicate for seamless loop
          "PRECISION NUTRITION", "ELITE COACHING", "STRENGTH TRAINING",
          "FITBIT WELLNESS", "FAT LOSS EXPERTS", "NASM CERTIFIED COACHES",
          "PROGRESSIVE OVERLOAD", "BODY RECOMPOSITION", "IOT GYM ACCESS",
          "OPTIMUM NUTRITION", "CARDIO & ENDURANCE", "TECHNOGYM EQUIPMENT",
        ].map((item, i) => (
          <RibbonItem key={i}><span>{item}</span><RibbonStar>★</RibbonStar></RibbonItem>
        ))}
      </RibbonTrack>
    </RibbonBar>
    <StatsSection>
      <StatItem><StatNum>4</StatNum><StatLbl>Membership Plans</StatLbl></StatItem><StatDivider />
      <StatItem><StatNum>IoT</StatNum><StatLbl>Smart Access</StatLbl></StatItem><StatDivider />
      <StatItem><StatNum>Live</StatNum><StatLbl>Occupancy Tracking</StatLbl></StatItem><StatDivider />
      <StatItem><StatNum>1</StatNum><StatLbl>Connected Community</StatLbl></StatItem>
    </StatsSection>
    <AboutUs />
    <CustomizedPrograms />
    <OurTeam />
    <CoachesSection />
    <BmiCalculator />
    <ProofOfWork />
    <MemberMilestones />
    <MemberMilestoneStats />
    <MemberTestimonials />
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

const CoachesSection = () => {
  const coaches = [
    { role: "STRENGTH & POWERLIFTING", name: "Arjun Menon", detail: "National powerlifting medalist · 8+ years coaching", copy: "Technique-first coaching across powerlifting, Olympic lifts, and body recomposition.", image: coachStrengthProvided, alt: "Strength coach Arjun Menon" },
    { role: "FAT LOSS & HIIT", name: "Priya Sharma", detail: "NASM certified · 200+ client transformations", copy: "Metabolic conditioning and structured plans built around sustainable fat-loss goals.", image: coachMobility, alt: "Illustrative stock portrait for HIIT coach Priya Sharma" },
    { role: "BODYBUILDING & AESTHETICS", name: "Raunak Verma", detail: "Men's physique competitor since 2016 · 500+ clients coached", copy: "Progressive muscle-building and physique preparation shaped to each athlete.", image: coachConditioning, alt: "Illustrative stock portrait for bodybuilding coach Raunak Verma" },
    { role: "YOGA & RECOVERY", name: "Sneha Pillai", detail: "Certified yoga therapist", copy: "Mobility and recovery practices to help athletes move well and train consistently.", image: coachYogaProvided, alt: "Yoga and recovery coach Sneha Pillai" },
  ];

  return (
    <CoachesSectionWrap>
      <SectionTitle>Meet Your Coaches</SectionTitle>
      <CoachesIntro>Specialist guidance for strength, conditioning, physique, mobility, and recovery.</CoachesIntro>
      <CoachGrid>
        {coaches.map((coach) => (
          <CoachCard key={coach.role}>
            <CoachPhoto src={coach.image} alt={coach.alt} loading="lazy" />
            <CoachInfo>
              <CoachRole>{coach.role}</CoachRole>
              <CoachTitle>{coach.name}</CoachTitle>
              <CoachCredential>{coach.detail}</CoachCredential>
              <CoachDescription>{coach.copy}</CoachDescription>
            </CoachInfo>
          </CoachCard>
        ))}
      </CoachGrid>
      <SectionFootnote>Your supplied photos are used for strength and yoga; the other coach portraits are illustrative stock images.</SectionFootnote>
    </CoachesSectionWrap>
  );
};

const ProofOfWork = () => {
  const examples = [
    { name: "Ricky.", type: "WEIGHT LOSS + MUSCLE GAIN", change: "−22 kg", goal: "Lost 22 kg · Muscle gain · 5 months", start: progressLossStart, end: progressGainGoal },
    { name: "Dexter", type: "MUSCLE GAIN ", change: "+26 kg", goal: "Gained 26 kg · Body building · 4 months", start: progressGainStart, end: progressLossGoal },
  ];

  return (
    <ProofSection>
      <SectionTitle>Proof of Work</SectionTitle>
      <ProofIntro>Real member milestones, built one session and one decision at a time.</ProofIntro>
      <ProofGrid>
        {examples.map((example) => (
          <ProofCard key={example.type}>
            <ProofPhotos>
              <ProofPhoto>
                <ProofImage src={example.start} alt={`Illustrative stock photo for ${example.type.toLowerCase()} starting point`} loading="lazy" />
                <ProofPhase>BEFORE</ProofPhase>
              </ProofPhoto>
              <ProofPhoto>
                <ProofImage src={example.end} alt={`Illustrative stock photo for ${example.type.toLowerCase()} goal`} loading="lazy" />
                <ProofPhase>AFTER</ProofPhase>
              </ProofPhoto>
              <ProofDivider aria-hidden="true"><i className="fas fa-arrow-right" /></ProofDivider>
            </ProofPhotos>
            <ProofDetails>
              <div><ProofMember>{example.name}</ProofMember><ProofType>{example.type}</ProofType><ProofGoal>{example.goal}</ProofGoal></div>
              <ProofChange>{example.change}</ProofChange>
            </ProofDetails>
          </ProofCard>
        ))}
      </ProofGrid>
      <ProofNotice>Results were supplied by IronPeak. The stock photos are representative visuals.</ProofNotice>
    </ProofSection>
  );
};

const MemberMilestones = () => {
  const milestones = [
    { step: "01 / SHOW UP", title: "Your First Check-In", copy: "Walk in, get comfortable, and make the gym part of your week.", image: i11, icon: "fa-door-open" },
    { step: "02 / FIND YOUR RHYTHM", title: "Build Your Routine", copy: "Explore strength, yoga, Pilates, or kickboxing at your own pace.", image: i6, icon: "fa-dumbbell" },
    { step: "03 / NOTICE THE CHANGE", title: "Track Your Progress", copy: "Use regular measurements to see how your effort is adding up.", image: i3, icon: "fa-chart-line" },
    { step: "04 / KEEP MOVING", title: "Choose Your Next Goal", copy: "Set a fresh target with support from the IronPeak team.", image: i8, icon: "fa-bullseye" },
  ];

  return (
    <MilestonesSection>
      <SectionTitle>The Path to a Stronger You</SectionTitle>
      <MilestonesCopy>Progress is personal. Every strong journey starts with the next small step.</MilestonesCopy>
      <MilestoneGrid>
        {milestones.map((milestone) => (
          <MilestoneCard key={milestone.step}>
            <MilestoneImage src={milestone.image} alt="" />
            <MilestoneShade />
            <MilestoneContent>
              <MilestoneIcon aria-hidden="true"><i className={`fas ${milestone.icon}`} /></MilestoneIcon>
              <MilestoneStep>{milestone.step}</MilestoneStep>
              <MilestoneTitle>{milestone.title}</MilestoneTitle>
              <MilestoneDescription>{milestone.copy}</MilestoneDescription>
            </MilestoneContent>
          </MilestoneCard>
        ))}
      </MilestoneGrid>
    </MilestonesSection>
  );
};

const MemberMilestoneStats = () => {
  const milestones = [
    { value: "200+", label: "Transformations", detail: "Member journeys shaped by consistent work", image: progressLossGoal },
    { value: "60+", label: "Competitions won", detail: "Strength, conditioning, and fight sports", image: img4 },
    { value: "5K+", label: "Classes held", detail: "Group training across multiple disciplines", image: img2 },
    { value: "25+", label: "National athletes", detail: "Athletes supported in pursuit of the next level", image: progressGainGoal },
  ];

  return (
    <MilestoneStatsSection>
      <SectionTitle>Member Milestones</SectionTitle>
      <MilestonesCopy>Big goals. Consistent training. A community built to keep progressing.</MilestonesCopy>
      <MilestoneStatsGrid>
        {milestones.map((item) => (
          <MilestoneStatCard key={item.label}>
            <MilestoneStatImage src={item.image} alt="" />
            <MilestoneStatShade />
            <MilestoneStatValue>{item.value}</MilestoneStatValue>
            <MilestoneStatLabel>{item.label}</MilestoneStatLabel>
            <MilestoneStatDetail>{item.detail}</MilestoneStatDetail>
          </MilestoneStatCard>
        ))}
      </MilestoneStatsGrid>
    </MilestoneStatsSection>
  );
};

const MemberTestimonials = () => {
  const testimonials = [
    { quote: "IronPeak didn't just change my body — it rewired my mindset. I left six months later as the strongest version of myself I've ever been. The coaches genuinely care.", name: "Ananya Krishnan", detail: "Lost 18 kg in 4 months · Pro member", initials: "AK" },
    { quote: "I've been to five gyms. None came close to the programming at IronPeak. My deadlift went from 80 kg to 165 kg in under a year. Unreal results.", name: "Siddharth Nair", detail: "2× deadlift PR in 11 months · Elite member", initials: "SN" },
    { quote: "Sneha's recovery sessions helped me return after two years of chronic back pain. Now I compete. The team here is extraordinary — genuinely life-changing.", name: "Meera Iyer", detail: "Back to competing · Pro member", initials: "MI" },
    { quote: "Having a clear plan and a coach who listens has made training feel manageable. I'm showing up more consistently and building strength at my own pace.", name: "Member story", detail: "Sample testimonial · replace with an approved member quote", initials: "IP" },
  ];

  return (
    <TestimonialsSection>
      <TestimonialsHeader>
        <TestimonialsEyebrow>MEMBER STORIES / IRONPEAK</TestimonialsEyebrow>
        <TestimonialsTitle>Stronger, in their own words.</TestimonialsTitle>
        <TestimonialsIntro>Different starting points. Personal goals. Progress worth sharing.</TestimonialsIntro>
      </TestimonialsHeader>
      <TestimonialLayout>
        {testimonials.map((item) => (
          <TestimonialCard key={item.name}>
            <TestimonialCardTop>
              <QuoteMark aria-hidden="true">“</QuoteMark>
              <TestimonialQuote>{item.quote}</TestimonialQuote>
            </TestimonialCardTop>
            <TestimonialPerson>
              <TestimonialAvatar>{item.initials}</TestimonialAvatar>
              <div><TestimonialName>{item.name}</TestimonialName><TestimonialDetail>{item.detail}</TestimonialDetail></div>
            </TestimonialPerson>
          </TestimonialCard>
        ))}
      </TestimonialLayout>
      <TestimonialsNote>Real words from real people who showed up, trusted the process, and got there.</TestimonialsNote>
    </TestimonialsSection>
  );
};

const BmiCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBmi = (event) => {
    event.preventDefault();
    const heightInMeters = Number(height) / 100;
    const value = Number(weight) / (heightInMeters * heightInMeters);
    const category = value < 18.5 ? "Below range" : value < 25 ? "Healthy range" : value < 30 ? "Above range" : "High range";
    setResult({ value: value.toFixed(1), category });
  };

  const markerPosition = result
    ? `${Math.min(100, Math.max(0, ((Number(result.value) - 15) / 25) * 100))}%`
    : "0%";

  return (
    <BmiSection>
      <BmiLayout>
        <BmiStory>
          <BmiEyebrow>IRONPEAK / FITNESS CHECK-IN</BmiEyebrow>
          <BmiHeading>Know your <span>baseline.</span></BmiHeading>
          <BmiDescription>Enter your height and weight for a quick BMI estimate. Use it as one data point alongside your training, energy, and overall wellbeing.</BmiDescription>
          <FitnessVisual>
            <FitnessArtwork src={fitnessTracker} alt="Fitness tracking illustration" />
            <FitnessDiagram style={{ top: "18px", left: "18px" }}><i className="fas fa-dumbbell" /><span>TRAIN</span></FitnessDiagram>
            <FitnessDiagram style={{ top: "42%", right: "14px" }}><i className="fas fa-heart-pulse" /><span>RECOVER</span></FitnessDiagram>
            <FitnessDiagram style={{ bottom: "18px", left: "22px" }}><i className="fas fa-chart-line" /><span>PROGRESS</span></FitnessDiagram>
            <FitnessAxis aria-hidden="true"><span>01</span><span>02</span><span>03</span><span>04</span></FitnessAxis>
          </FitnessVisual>
        </BmiStory>

        <BmiTool>
          <BmiToolHeader>
            <BmiToolIcon aria-hidden="true"><i className="fas fa-weight-scale" /></BmiToolIcon>
            <div><BmiToolEyebrow>QUICK CHECK</BmiToolEyebrow><BmiToolTitle>BMI Calculator</BmiToolTitle></div>
          </BmiToolHeader>
          <BmiForm onSubmit={calculateBmi}>
            <BmiField>
              <BmiLabel htmlFor="bmi-height">Height <span>CM</span></BmiLabel>
              <BmiInput id="bmi-height" type="number" inputMode="decimal" min="100" max="250" step="any" placeholder="e.g. 175" value={height} onChange={(event) => setHeight(event.target.value)} required />
            </BmiField>
            <BmiField>
              <BmiLabel htmlFor="bmi-weight">Weight <span>KG</span></BmiLabel>
              <BmiInput id="bmi-weight" type="number" inputMode="decimal" min="25" max="300" step="any" placeholder="e.g. 75" value={weight} onChange={(event) => setWeight(event.target.value)} required />
            </BmiField>
            <BmiSubmit type="submit">Calculate BMI <i className="fas fa-arrow-right" /></BmiSubmit>
          </BmiForm>

          {result && (
            <BmiResult aria-live="polite">
              <BmiResultLabel>Your estimate</BmiResultLabel>
              <BmiResultValue>{result.value}<span> BMI</span></BmiResultValue>
              <BmiCategory>{result.category}</BmiCategory>
            </BmiResult>
          )}

          <BmiScale aria-label="BMI reference ranges">
            <BmiScaleTrack>
              <BmiScaleSegment $tone="low" /><BmiScaleSegment $tone="healthy" /><BmiScaleSegment $tone="elevated" /><BmiScaleSegment $tone="high" />
              {result && <BmiScaleMarker style={{ left: markerPosition }} />}
            </BmiScaleTrack>
            <BmiScaleLabels>
              <span>Below<br />18.5</span><span>Healthy<br />18.5–24.9</span><span>Above<br />25–29.9</span><span>High<br />30+</span>
            </BmiScaleLabels>
          </BmiScale>
          <BmiDisclaimer>BMI is a general screening measure, not a medical diagnosis.</BmiDisclaimer>
        </BmiTool>
      </BmiLayout>
    </BmiSection>
  );
};

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

const countUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const scrollReveal = keyframes`from{opacity:0;transform:translateY(34px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const RibbonBar = styled.div`
  overflow: hidden;
  background: #0a0a0a;
  border-top: 1px solid #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  padding: 14px 0;
  white-space: nowrap;
`;

const RibbonTrack = styled.div`
  display: inline-flex;
  animation: ${scroll} 30s linear infinite;
  gap: 0;
`;

const RibbonItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 0 30px;
  font-size: 0.65rem;
  letter-spacing: 2.5px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  white-space: nowrap;
  &:hover { color: #fff; }
`;

const RibbonStar = styled.span`
  color: #ff2a2a;
  font-size: 0.5rem;
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

const CoachesSectionWrap = styled(Section)`
  background: #0b0b0b;
`;

const CoachesIntro = styled.p`
  max-width: 560px;
  margin: -30px auto 42px;
  color: #a0a0a0;
  font-size: 0.95rem;
  text-align: center;
`;

const CoachGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 20px;
  max-width: 1120px;
  margin: 0 auto;
  @media(max-width:950px){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media(max-width:560px){grid-template-columns:1fr;}
`;

const CoachCard = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 4px;
  background: #141414;
  transition: transform .3s ease,border-color .3s ease;
  &:hover { transform: translateY(-5px); border-color: #ff6b00; }
`;

const CoachPhoto = styled.img`
  display: block;
  width: 100%;
  height: 260px;
  object-fit: cover;
  object-position: center 35%;
  filter: saturate(.78) contrast(1.04);
  @media(max-width:560px){height:280px;}
`;

const CoachInfo = styled.div`
  padding: 22px 22px 24px;
`;

const CoachRole = styled.div`
  margin-bottom: 8px;
  color: #ff8a36;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 1.5px;
`;

const CoachTitle = styled.h3`
  margin-bottom: 6px;
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 1.2rem;
  text-transform: uppercase;
`;

const CoachCredential = styled.div`
  margin-bottom: 12px;
  color: #ff9a52;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.5;
`;

const CoachDescription = styled.p`
  margin: 0;
  color: #a0a0a0;
  font-size: 0.85rem;
  line-height: 1.65;
`;

const SectionFootnote = styled.p`
  margin: 20px auto 0;
  color: #777;
  font-size: 0.68rem;
  text-align: center;
`;

const ProofSection = styled(Section)`
  background: #101010;
  border-top: 1px solid #252525;
`;

const ProofIntro = styled.p`
  max-width: 620px;
  margin: -30px auto 42px;
  color: #a0a0a0;
  font-size: 0.95rem;
  text-align: center;
`;

const ProofGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 22px;
  max-width: 1120px;
  margin: 0 auto;
  @media(max-width:700px){grid-template-columns:1fr;}
`;

const ProofCard = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 4px;
  background: #171717;
`;

const ProofPhotos = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 250px;
  @media(max-width:480px){height:210px;}
`;

const ProofPhoto = styled.div`
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: #222;
  &::after { content: ''; position: absolute; inset: 35% 0 0; background: linear-gradient(transparent,rgba(0,0,0,.55)); }
  &:first-child { border-right: 1px solid rgba(255,255,255,.24); }
`;

const ProofImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.72) brightness(.78);
`;

const ProofPhase = styled.span`
  position: absolute;
  z-index: 1;
  left: 14px;
  bottom: 13px;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 1.4px;
`;

const ProofDivider = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 2px solid #101010;
  border-radius: 50%;
  background: #ff6b00;
  color: #fff;
  font-size: 0.72rem;
  transform: translate(-50%,-50%);
`;

const ProofDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px;
  @media(max-width:420px){align-items:flex-start;flex-direction:column;}
`;

const ProofMember = styled.div`
  margin-bottom: 5px;
  color: #ff9a52;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

const ProofType = styled.h3`
  margin-bottom: 5px;
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 1.16rem;
  text-transform: uppercase;
`;

const ProofGoal = styled.p`
  margin: 0;
  color: #999;
  font-size: 0.72rem;
`;

const ProofChange = styled.strong`
  flex: 0 0 auto;
  color: #ff8a36;
  font-family: 'Oswald',sans-serif;
  font-size: 2.1rem;
  line-height: 1;
`;

const ProofNotice = styled.p`
  max-width: 800px;
  margin: 22px auto 0;
  color: #777;
  font-size: 0.69rem;
  line-height: 1.6;
  text-align: center;
`;

const MilestonesSection = styled(Section)`
  background: #080808;
`;

const MilestonesCopy = styled.p`
  max-width: 580px;
  margin: -30px auto 42px;
  color: #a0a0a0;
  font-size: 0.95rem;
  text-align: center;
`;

const MilestoneStatsSection = styled(Section)`
  background: #0b0b0b;
  border-top: 1px solid #252525;
`;

const MilestoneStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  max-width: 1120px;
  margin: 0 auto;
  border: 1px solid #2a2a2a;
  background: #111;
  @media(max-width:850px){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media(max-width:500px){grid-template-columns:1fr;}
`;

const MilestoneStatCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 320px;
  overflow: hidden;
  padding: 28px 18px;
  border-right: 1px solid #2a2a2a;
  border-bottom: 2px solid #292929;
  text-align: center;
  transition: background .25s ease,border-color .25s ease;
  &:hover { background: #171717; border-bottom-color: #ff6b00; }
  &:hover img { transform: scale(1.05); }
  &:last-child { border-right: 0; }
  @media(max-width:850px){&:nth-child(2n){border-right:0;}}
  @media(max-width:500px){min-height:270px;border-right:0;}
`;

const MilestoneStatImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.68) brightness(.52);
  transition: transform .45s ease;
`;

const MilestoneStatShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,rgba(0,0,0,.38),rgba(0,0,0,.36) 48%,rgba(0,0,0,.82));
`;

const MilestoneStatValue = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
  color: #ff7a1a;
  font-family: 'Oswald',sans-serif;
  font-size: 3.1rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 18px rgba(0,0,0,.75);
  @media(max-width:500px){font-size:2.7rem;}
`;

const MilestoneStatLabel = styled.h3`
  position: relative;
  z-index: 1;
  margin: 0 0 6px;
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 0.76rem;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  text-shadow: 0 1px 8px rgba(0,0,0,.85);
`;

const MilestoneStatDetail = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  color: #999;
  font-size: 0.68rem;
  line-height: 1.5;
  text-shadow: 0 1px 6px rgba(0,0,0,.9);
`;

const TestimonialsSection = styled.section`
  padding: 82px 60px;
  background: #101010;
  border-top: 1px solid #252525;
  @media(max-width:768px){padding:60px 24px;}
`;

const TestimonialsHeader = styled.div`
  max-width: 1120px;
  margin: 0 auto 36px;
  padding-left: 20px;
  border-left: 3px solid #ff6b00;
`;

const TestimonialsEyebrow = styled.div`
  margin-bottom: 10px;
  color: #ff8a36;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 2px;
`;

const TestimonialsTitle = styled.h2`
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 2.6rem;
  line-height: 1.1;
  text-transform: uppercase;
  @media(max-width:600px){font-size:2rem;}
`;

const TestimonialsIntro = styled.p`
  margin: 10px 0 0;
  color: #999;
  font-size: 0.88rem;
`;

const TestimonialLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  grid-auto-rows: 1fr;
  gap: 18px;
  max-width: 1120px;
  margin: 0 auto;
  @media(max-width:1050px){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media(max-width:580px){grid-template-columns:1fr;}
`;

const QuoteMark = styled.span`
  display: block;
  height: 55px;
  color: #ff6b00;
  font-family: Georgia,serif;
  font-size: 5rem;
  line-height: 1;
`;

const TestimonialQuote = styled.blockquote`
  margin: 8px 0 18px;
  color: #eee;
  font-size: 0.86rem;
  font-style: italic;
  line-height: 1.65;
`;

const TestimonialPerson = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid #303030;
`;

const TestimonialAvatar = styled.span`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid rgba(255,107,0,.5);
  border-radius: 50%;
  background: #222;
  color: #ff9a52;
  font-family: 'Oswald',sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
`;

const TestimonialName = styled.div`
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
`;

const TestimonialDetail = styled.div`
  margin-top: 3px;
  color: #888;
  font-size: 0.66rem;
`;

const TestimonialCard = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  min-height: 350px;
  padding: 22px 20px;
  border: 1px solid #303030;
  border-left: 3px solid #ff6b00;
  border-radius: 4px;
  background: #171717;
  ${QuoteMark} { height: 40px; font-size: 3.6rem; }
`;

const TestimonialCardTop = styled.div`
  flex: 1;
`;

const TestimonialsNote = styled.p`
  max-width: 1120px;
  margin: 22px auto 0;
  color: #777;
  font-size: 0.68rem;
  text-align: center;
`;

const MilestoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  max-width: 1120px;
  margin: 0 auto;
  @media(max-width:900px){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media(max-width:520px){grid-template-columns:1fr;}
`;

const MilestoneCard = styled.article`
  position: relative;
  min-width: 0;
  min-height: 320px;
  overflow: hidden;
  background: #141414;
  border: 1px solid #292929;
  border-radius: 4px;
  &:hover img { transform: scale(1.06); }
  &:hover > div:last-child { border-color: rgba(255,107,0,.75); }
  @media(max-width:520px){min-height:300px;}
`;

const MilestoneImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.72) brightness(.76);
  transition: transform .55s ease;
`;

const MilestoneShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,rgba(0,0,0,.08) 10%,rgba(0,0,0,.28) 42%,rgba(0,0,0,.94) 100%);
`;

const MilestoneContent = styled.div`
  position: absolute;
  inset: auto 0 0;
  min-height: 170px;
  padding: 20px 18px;
  border-bottom: 3px solid #292929;
  transition: border-color .25s ease;
`;

const MilestoneIcon = styled.span`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  margin-bottom: 16px;
  background: #ff6b00;
  color: #fff;
  border-radius: 3px;
`;

const MilestoneStep = styled.div`
  margin-bottom: 7px;
  color: #ff9a52;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 1.4px;
`;

const MilestoneTitle = styled.h3`
  margin-bottom: 7px;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 1.22rem;
  text-transform: uppercase;
`;

const MilestoneDescription = styled.p`
  max-width: 260px;
  margin: 0;
  color: #c1c1c1;
  font-size: 0.78rem;
  line-height: 1.5;
`;

const BmiSection = styled(Section)`
  background: #101010;
  border-top: 1px solid #252525;
  border-bottom: 1px solid #252525;
`;

const BmiLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(340px, .95fr);
  align-items: center;
  gap: 56px;
  max-width: 1120px;
  margin: 0 auto;
  @media(max-width:800px){grid-template-columns:1fr;gap:34px;}
`;

const BmiStory = styled.div`
  min-width: 0;
`;

const BmiEyebrow = styled.div`
  margin-bottom: 14px;
  color: #ff8a36;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
`;

const BmiHeading = styled.h2`
  max-width: 460px;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 2.8rem;
  line-height: 1.05;
  text-transform: uppercase;
  span { color: #ff6b00; }
  @media(max-width:600px){font-size:2.25rem;}
`;

const BmiDescription = styled.p`
  max-width: 470px;
  margin: 16px 0 24px;
  color: #aaa;
  font-size: 0.92rem;
  line-height: 1.7;
`;

const FitnessVisual = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  height: 310px;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 4px;
  background: radial-gradient(ellipse at center, #25221f 0%, #171717 60%, #101010 100%);
  &::before {
    content: '';
    position: absolute;
    inset: 16px;
    border: 1px solid rgba(255,255,255,.08);
    pointer-events: none;
  }
  @media(max-width:600px){height:260px;}
`;

const FitnessArtwork = styled.img`
  position: relative;
  z-index: 1;
  width: 72%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 12px 20px rgba(0,0,0,.5));
`;

const FitnessDiagram = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #45413d;
  border-radius: 3px;
  background: rgba(12,12,12,.92);
  color: #ff7a1a;
  font-size: 0.9rem;
  span { color: #ddd; font-size: 0.56rem; font-weight: 700; letter-spacing: 1px; }
`;

const FitnessAxis = styled.div`
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #888;
  font-family: 'Oswald', sans-serif;
  font-size: 0.55rem;
  &::before { content: ''; position: absolute; top: 3px; right: 18px; width: 1px; height: calc(100% - 6px); background: #ff6b00; }
`;

const BmiTool = styled.div`
  min-width: 0;
  padding: 30px;
  border: 1px solid #303030;
  border-radius: 4px;
  background: #141414;
  box-shadow: 0 18px 44px rgba(0,0,0,.22);
  @media(max-width:480px){padding:22px 18px;}
`;

const BmiToolHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 26px;
`;

const BmiToolIcon = styled.span`
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border: 1px solid rgba(255,107,0,.45);
  border-radius: 3px;
  background: rgba(255,107,0,.1);
  color: #ff7a1a;
  font-size: 1.05rem;
`;

const BmiToolEyebrow = styled.div`
  margin-bottom: 3px;
  color: #999;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 1.8px;
`;

const BmiToolTitle = styled.h3`
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 1.45rem;
  text-transform: uppercase;
`;

const BmiForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 16px 12px;
`;

const BmiField = styled.div`
  min-width: 0;
`;

const BmiLabel = styled.label`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #bbb;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  span { color: #ff8a36; }
`;

const BmiInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 48px;
  padding: 0 13px;
  border: 1px solid #373737;
  border-radius: 3px;
  background: #1d1d1d;
  color: #fff;
  font: inherit;
  &:focus { border-color: #ff6b00; outline: 2px solid rgba(255,107,0,.2); }
  &::placeholder { color: #777; }
`;

const BmiSubmit = styled.button`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  margin-top: 3px;
  padding: 0 16px;
  border: 0;
  border-radius: 3px;
  background: #ff6b00;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: background .2s ease;
  &:hover { background: #e65f00; }
`;

const BmiResult = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 3px 12px;
  margin-top: 22px;
  padding: 16px;
  border-left: 3px solid #ff6b00;
  background: #1c1c1c;
`;

const BmiResultLabel = styled.span`
  color: #aaa;
  font-size: 0.68rem;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const BmiResultValue = styled.strong`
  grid-row: span 2;
  color: #ff7a1a;
  font-family: 'Oswald', sans-serif;
  font-size: 2rem;
  line-height: 1;
  span { color: #999; font-family: 'Outfit', sans-serif; font-size: 0.6rem; }
`;

const BmiCategory = styled.span`
  color: #fff;
  font-size: 0.84rem;
  font-weight: 700;
`;

const BmiScale = styled.div`
  margin-top: 24px;
`;

const BmiScaleTrack = styled.div`
  position: relative;
  display: flex;
  height: 8px;
  gap: 3px;
  border-radius: 6px;
`;

const BmiScaleSegment = styled.span`
  flex: ${p => p.$tone === "low" ? 3.5 : p.$tone === "healthy" ? 6.5 : p.$tone === "elevated" ? 5 : 10};
  border-radius: 6px;
  background: ${p => p.$tone === "low" ? "#4187a5" : p.$tone === "healthy" ? "#5a9d62" : p.$tone === "elevated" ? "#d58b36" : "#b7483c"};
`;

const BmiScaleMarker = styled.span`
  position: absolute;
  top: -5px;
  width: 3px;
  height: 18px;
  border: 1px solid #141414;
  border-radius: 2px;
  background: #fff;
  transform: translateX(-50%);
  box-shadow: 0 0 0 1px rgba(255,255,255,.7);
`;

const BmiScaleLabels = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.25fr 1.15fr 1fr;
  gap: 5px;
  margin-top: 10px;
  color: #999;
  font-size: 0.58rem;
  line-height: 1.4;
  text-align: center;
  span:nth-child(2) { color: #8fc394; }
`;

const BmiDisclaimer = styled.p`
  margin: 18px 0 0;
  color: #777;
  font-size: 0.67rem;
  line-height: 1.5;
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
