import styled from "styled-components";
import logoImg from "../assets/logo.png";
import h1 from "../assets/h1.jpg";
import h2 from "../assets/h2.jpg";
import h3 from "../assets/h3.jpg";
import h5 from "../assets/h5s.jpg";
import h4 from "../assets/h4.jpg";
import coachStrength from "../assets/COACH 1.jpg";
import coachMobility from "../assets/coach-mobility.jpg";
import coachConditioning from "../assets/coach-conditioning.jpg";
import coachYoga from "../assets/Coach 4.jpg";
import progressLossStart from "../assets/progress-loss-start.jpg";
import progressLossGoal from "../assets/progress-loss-goal.jpg";
import progressGainStart from "../assets/progress-gain-start.jpg";
import progressGainGoal from "../assets/progress-gain-goal.jpg";
import Footer from "./footer";

const AboutPage = () => {
  return (
    <>
      <AboutContainer>
        <LogoBanner>
          <BigLogo src={logoImg} alt="IronPeak Gym" />
          <LogoBannerText>
            <h1>IRONPEAK GYM</h1>
            <p>INDIA&apos;S PREMIER FITNESS DESTINATION</p>
          </LogoBannerText>
        </LogoBanner>
        <PageTitle>About Our Gym</PageTitle>

        <AboutIntro>
          <span>TRAIN WITH INTENT</span>
          <p>Strong foundations, smart tools, and a community that keeps showing up.</p>
        </AboutIntro>

        <ImpactSection>
          <ImpactHeader>
            <ImpactEyebrow>IRONPEAK / PROOF OF WORK</ImpactEyebrow>
            <ImpactTitle>Built through consistency.</ImpactTitle>
            <ImpactCopy>Every number reflects a goal pursued through training, coaching, and community.</ImpactCopy>
          </ImpactHeader>
          <ImpactGrid>
            {[
              { value: "200+", label: "Transformations", detail: "Member journeys shaped by consistent work", image: progressLossGoal },
              { value: "60+", label: "Competitions won", detail: "Across strength, conditioning, and fight sports", image: h3 },
              { value: "5K+", label: "Classes held", detail: "Group training across multiple disciplines", image: h2 },
              { value: "25+", label: "National athletes", detail: "Athletes supported on their way to the next level", image: progressGainGoal },
            ].map((item) => (
              <ImpactCard key={item.label}>
                <ImpactImage src={item.image} alt="" loading="lazy" />
                <ImpactShade />
                <ImpactValue>{item.value}</ImpactValue>
                <ImpactLabel>{item.label}</ImpactLabel>
                <ImpactDetail>{item.detail}</ImpactDetail>
              </ImpactCard>
            ))}
          </ImpactGrid>
        </ImpactSection>

        <Timeline>
          <Section>
            <ImageContainer className="about-image">
              <Image src={h1} alt="Who We Are" />
            </ImageContainer>
            <TextContainer className="about-copy">
              <StoryMarker><i className="fas fa-people-group" /> 01 / COMMUNITY</StoryMarker>
              <h3>Who We Are</h3>
              <p>
                IronPeak Gym was founded by <strong>Aniket Shaw</strong> with a single
                vision: to build INDIA&apos;s most results-driven fitness community.
                Our experienced trainers and comprehensive facilities serve athletes
                of every level — beginner to elite. We are more than a gym; we are
                your fitness partner.
              </p>
            </TextContainer>
          </Section>

          <Section $reverse>
            <TextContainer className="about-copy">
              <StoryMarker><i className="fas fa-bullseye" /> 02 / PURPOSE</StoryMarker>
              <h3>Our Purpose</h3>
              <p>
                We exist to make consistent, healthy living achievable for everyone.
                Through personalised training programs, group classes, and smart
                technology — including IoT-powered RFID check-in and digital member
                tracking — we give our members the tools they need to stay
                accountable and progress faster.
              </p>
            </TextContainer>
            <ImageContainer className="about-image">
              <Image src={h2} alt="Our Purpose" />
            </ImageContainer>
          </Section>

          <Section>
            <ImageContainer className="about-image">
              <Image src={h3} alt="Our Services" />
            </ImageContainer>
            <TextContainer className="about-copy">
              <StoryMarker><i className="fas fa-list-check" /> 03 / MEMBERSHIP</StoryMarker>
              <h3>Plans &amp; Services</h3>
              <p>
                We offer flexible membership plans across 1, 3, 6, and 12-month
                durations. Training options include strength &amp; conditioning,
                fat loss, yoga, pilates, kickboxing, HIIT, and personal training.
                Members also get access to body measurement tracking and renewal
                reminders via email.
              </p>
            </TextContainer>
          </Section>

          <Section $reverse>
            <TextContainer className="about-copy">
              <StoryMarker><i className="fas fa-dumbbell" /> 04 / FACILITY</StoryMarker>
              <h3>Our Facility</h3>
              <p>
                Modern equipment, open training floors, dedicated studio spaces, and
                a clean, energising atmosphere — IronPeak Gym is designed to keep
                you motivated every time you walk through the door. Located in Salt
                Lake City, Sector V, Kolkata.
              </p>
            </TextContainer>
            <ImageContainer className="about-image">
              <Image src={h5} alt="Facility" />
            </ImageContainer>
          </Section>

          <Section>
            <ImageContainer className="about-image">
              <Image src={h4} alt="How We Operate" />
            </ImageContainer>
            <TextContainer className="about-copy">
              <StoryMarker><i className="fas fa-id-card" /> 05 / SMART ACCESS</StoryMarker>
              <h3>How We Operate</h3>
              <p>
                We&apos;re open 6 days a week with Sunday morning sessions available.
                Smart RFID cards give members seamless entry — tracked in real time
                by our backend system. Admins can manage memberships, update plans,
                log measurements, and monitor active members — all from a single
                dashboard.
              </p>
            </TextContainer>
          </Section>
          <Section $reverse>
            <TextContainer className="about-copy">
              <StoryMarker><i className="fas fa-chart-line" /> 06 / PROGRESS</StoryMarker>
              <h3>Progress You Can See</h3>
              <p>Training is personal, so progress should be too. Digital measurement history helps members and coaches follow changes over time, celebrate consistency, and adjust the plan with purpose.</p>
              <StoryPoints><span>Measure</span><i /><span>Review</span><i /><span>Improve</span></StoryPoints>
            </TextContainer>
            <ImageContainer className="about-image"><Image src={h2} alt="Member tracking and progress" /></ImageContainer>
          </Section>
        </Timeline>

        <CoachingSection>
          <AboutSectionHeader>
            <AboutEyebrow>THE PEOPLE BEHIND YOUR PROGRESS</AboutEyebrow>
            <AboutSectionTitle>Coaching for every kind of strong.</AboutSectionTitle>
            <AboutSectionCopy>Experienced guidance across performance, physique, conditioning, and recovery.</AboutSectionCopy>
          </AboutSectionHeader>
          <CoachGrid>
            {[
              { name: "Arjun Menon", focus: "Strength & Powerlifting", detail: "National powerlifting medalist · 8+ years coaching", copy: "Technique-first support across powerlifting, Olympic lifts, and body recomposition.", image: coachStrength, alt: "Strength coach Arjun Menon" },
              { name: "Priya Sharma", focus: "Fat Loss & HIIT", detail: "NASM certified · 200+ client transformations", copy: "Metabolic conditioning and structured plans centered on sustainable fat-loss goals.", image: coachMobility, alt: "Fat loss and HIIT coach Priya Sharma" },
              { name: "Raunak Verma", focus: "Bodybuilding & Aesthetics", detail: "Men's physique competitor since 2016 · 500+ clients coached", copy: "Progressive muscle-building and physique preparation tailored to each athlete.", image: coachConditioning, alt: "Bodybuilding coach Raunak Verma" },
              { name: "Sneha Pillai", focus: "Yoga & Recovery", detail: "Certified yoga therapist", copy: "Mobility and recovery practices to help members move well and train consistently.", image: coachYoga, alt: "Yoga and recovery coach Sneha Pillai" },
            ].map((coach) => (
              <CoachCard key={coach.name}>
                <CoachPhoto src={coach.image} alt={coach.alt} loading="lazy" />
                <CoachInfo>
                  <CoachFocus>{coach.focus}</CoachFocus>
                  <CoachName>{coach.name}</CoachName>
                  <CoachDetail>{coach.detail}</CoachDetail>
                  <CoachCopy>{coach.copy}</CoachCopy>
                </CoachInfo>
              </CoachCard>
            ))}
          </CoachGrid>
          <Disclosure>Strength and yoga portraits were supplied for IronPeak; other coach photos are representative stock images.</Disclosure>
        </CoachingSection>

        <ResultsSection>
          <AboutSectionHeader>
            <AboutEyebrow>MEMBER JOURNEYS</AboutEyebrow>
            <AboutSectionTitle>Progress, one rep at a time.</AboutSectionTitle>
            <AboutSectionCopy>Different goals call for different plans. Here are two milestones from the IronPeak community.</AboutSectionCopy>
          </AboutSectionHeader>
          <ResultsGrid>
            {[
              { name: "Ricky.", focus: "Weight loss + muscle gain", result: "−22 kg", detail: "Lost 22 kg · Muscle gain · 5 months", before: progressLossStart, after: progressGainGoal },
              { name: "Dexter", focus: "Muscle gain", result: "+26 kg", detail: "Gained 26 kg · Bodybuilding · 4 months", before: progressGainStart, after: progressLossGoal },
            ].map((story) => (
              <ResultCard key={story.name}>
                <ResultPhotos>
                  <ResultPhoto><img src={story.before} alt="Representative before photo" loading="lazy" /><ResultTag>BEFORE</ResultTag></ResultPhoto>
                  <ResultPhoto><img src={story.after} alt="Representative after photo" loading="lazy" /><ResultTag>AFTER</ResultTag></ResultPhoto>
                </ResultPhotos>
                <ResultInfo>
                  <div><ResultName>{story.name}</ResultName><ResultFocus>{story.focus}</ResultFocus><ResultDetail>{story.detail}</ResultDetail></div>
                  <ResultValue>{story.result}</ResultValue>
                </ResultInfo>
              </ResultCard>
            ))}
          </ResultsGrid>
          <Disclosure>Before and after photos are representative stock imagery, not photos of Ricky or Dexter. Individual results vary.</Disclosure>
        </ResultsSection>
      </AboutContainer>
      <Footer />
    </>
  );
};

const AboutContainer = styled.div`
  width: min(1180px, 92%);
  margin: 0 auto;
  margin-top: 80px;
  background:radial-gradient(ellipse at 50% 0%,rgba(255,107,0,.08),transparent 42%),#0a0a0a;
  color: white;
  padding: 60px 20px;
  @media(max-width:600px){width:100%;margin-top:64px;padding:34px 14px;}
`;

const AboutIntro = styled.div`
  max-width:640px;margin:0 auto 58px;text-align:center;
  span{color:#ff6b00;font-size:.72rem;font-weight:800;letter-spacing:3px;}
  p{color:#aaa;font-size:1rem;line-height:1.7;margin:12px 0 0;}
`;

const Timeline = styled.div`position:relative;`;

const PageTitle = styled.h1`
  font-family: 'Oswald', sans-serif;
  text-align: center;
  font-size: 2.8rem;
  letter-spacing: 3px;
  color: #fff;
  margin-bottom: 50px;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: #ff6b00;
    margin: 10px auto 0;
  }
  @media(max-width:600px){font-size:2.15rem;letter-spacing:2px;margin-bottom:34px;}
`;

const Section = styled.div`
  display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);align-items:center;gap:clamp(24px,5vw,72px);
  margin-bottom:clamp(48px,7vw,92px);position:relative;
  ${p => p.$reverse && `grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);.about-image{grid-column:2;grid-row:1}.about-copy{grid-column:1;grid-row:1}`}
  &:not(:last-child)::after{content:"";position:absolute;left:50%;bottom:calc(clamp(48px,7vw,92px) / -1);height:clamp(48px,7vw,92px);border-left:2px dashed rgba(255,107,0,.42);}
  &:not(:last-child)::before{content:"";position:absolute;left:calc(50% - 5px);bottom:-7px;width:10px;height:10px;border-radius:50%;background:#ff6b00;box-shadow:0 0 16px rgba(255,107,0,.7);}
  @media(max-width:760px){grid-template-columns:1fr;gap:18px;${p => p.$reverse && `.about-image{grid-column:1;grid-row:1}.about-copy{grid-column:1;grid-row:2}`} &:not(:last-child)::after,&:not(:last-child)::before{display:none;}}
`;

const ImageContainer = styled.div`
  min-width:0;position:relative;padding:12px;border:1px solid #313131;border-radius:14px;
  background:linear-gradient(145deg,#171717,#0b0b0b);box-shadow:0 26px 50px rgba(0,0,0,.35);
  &::after{content:"";position:absolute;inset:12px;border:1px solid rgba(255,107,0,.38);border-radius:8px;pointer-events:none;}
`;

const TextContainer = styled.div`
  min-width:0;padding:clamp(22px,3vw,38px);background:linear-gradient(145deg,#171717,#101010);
  border:1px solid #2d2d2d;border-left:3px solid #ff6b00;border-radius:12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  @media(max-width:600px){padding:22px 18px;}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(255, 107, 0, 0.15);
  }

  h3 {
    color: #fff;
    font-family: 'Oswald', sans-serif;
    font-size: 1.6rem;
    margin-bottom: 12px;
    text-align: left;
  }

  p {
    font-size: 1rem;
    line-height: 1.7;
    color: #b6b6b6;
  }
`;

const StoryMarker = styled.div`color:#ff8b35;font-size:.66rem;font-weight:800;letter-spacing:1.7px;margin-bottom:13px;display:flex;align-items:center;gap:8px;i{font-size:.9rem;}`;

const StoryPoints = styled.div`display:flex;align-items:center;gap:9px;margin-top:22px;color:#dedede;font-size:.72rem;text-transform:uppercase;letter-spacing:1px;i{height:1px;width:24px;background:#ff6b00;}`;

const Image = styled.img`
  width:100%;height:clamp(250px,32vw,410px);object-fit:cover;border-radius:8px;display:block;
  transition:transform .65s cubic-bezier(.2,.7,.2,1),filter .65s ease;filter:saturate(.82) contrast(1.04);
  .about-image:hover &{transform:scale(1.035);filter:saturate(1.08) contrast(1.08);}
`;

const ImpactSection = styled.section`
  margin: 0 0 clamp(64px,8vw,96px);
`;

const ImpactHeader = styled.div`
  max-width: 720px;
  margin: 0 auto 30px;
  text-align: center;
`;

const ImpactEyebrow = styled.div`
  margin-bottom: 8px;
  color: #ff8a36;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: 2px;
`;

const ImpactTitle = styled.h2`
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 2rem;
  text-transform: uppercase;
`;

const ImpactCopy = styled.p`
  margin: 9px 0 0;
  color: #999;
  font-size: .84rem;
  line-height: 1.6;
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  border: 1px solid #292929;
  background: #111;
  @media(max-width:850px){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media(max-width:520px){grid-template-columns:1fr;}
`;

const ImpactCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 230px;
  overflow: hidden;
  padding: 24px 14px;
  border-right: 1px solid #292929;
  border-bottom: 2px solid #292929;
  text-align: center;
  &:hover { border-bottom-color: #ff6b00; }
  &:hover img { transform: scale(1.05); }
  @media(max-width:850px){&:nth-child(2n){border-right:0;}}
  @media(max-width:520px){min-height:220px;border-right:0;}
`;

const ImpactImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.65) brightness(.42);
  transition: transform .45s ease;
`;

const ImpactShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,rgba(0,0,0,.32),rgba(0,0,0,.62));
`;

const ImpactValue = styled.div`
  position: relative;
  z-index: 1;
  color: #ff7a1a;
  font-family: 'Oswald',sans-serif;
  font-size: 2.9rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 14px rgba(0,0,0,.8);
`;

const ImpactLabel = styled.h3`
  position: relative;
  z-index: 1;
  margin: 9px 0 5px;
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: .75rem;
  letter-spacing: 1.1px;
  text-transform: uppercase;
`;

const ImpactDetail = styled.p`
  position: relative;
  z-index: 1;
  max-width: 220px;
  margin: 0;
  color: #bbb;
  font-size: .68rem;
  line-height: 1.5;
`;

const CoachingSection = styled.section`
  margin: clamp(72px,9vw,110px) 0;
  padding-top: 60px;
  border-top: 1px solid #292929;
`;

const AboutSectionHeader = styled.div`
  max-width: 700px;
  margin: 0 auto 34px;
  text-align: center;
`;

const AboutEyebrow = styled.div`
  margin-bottom: 9px;
  color: #ff8a36;
  font-size: .65rem;
  font-weight: 800;
  letter-spacing: 2px;
`;

const AboutSectionTitle = styled.h2`
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 2rem;
  line-height: 1.2;
  text-transform: uppercase;
  @media(max-width:600px){font-size:1.65rem;}
`;

const AboutSectionCopy = styled.p`
  margin: 10px 0 0;
  color: #999;
  font-size: .86rem;
  line-height: 1.6;
`;

const CoachGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 14px;
  @media(max-width:900px){grid-template-columns:repeat(2,minmax(0,1fr));}
  @media(max-width:540px){grid-template-columns:1fr;}
`;

const CoachCard = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 4px;
  background: #141414;
`;

const CoachPhoto = styled.img`
  display: block;
  width: 100%;
  height: 210px;
  object-fit: cover;
  object-position: center 35%;
  filter: saturate(.78) contrast(1.04);
`;

const CoachInfo = styled.div`
  padding: 18px 16px 20px;
`;

const CoachFocus = styled.div`
  margin-bottom: 7px;
  color: #ff8a36;
  font-size: .62rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const CoachName = styled.h3`
  margin: 0 0 6px;
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 1.15rem;
  text-transform: uppercase;
`;

const CoachDetail = styled.div`
  margin-bottom: 10px;
  color: #c17a44;
  font-size: .67rem;
  line-height: 1.5;
`;

const CoachCopy = styled.p`
  margin: 0;
  color: #999;
  font-size: .75rem;
  line-height: 1.6;
`;

const ResultsSection = styled.section`
  margin: 0 0 30px;
  padding-top: 60px;
  border-top: 1px solid #292929;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 18px;
  @media(max-width:700px){grid-template-columns:1fr;}
`;

const ResultCard = styled.article`
  min-width: 0;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 4px;
  background: #151515;
`;

const ResultPhotos = styled.div`
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  height: 230px;
  @media(max-width:500px){height:200px;}
`;

const ResultPhoto = styled.div`
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: #222;
  & + & { border-left: 2px solid #ff6b00; }
  img { display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.75) brightness(.78); }
`;

const ResultTag = styled.span`
  position: absolute;
  left: 12px;
  bottom: 12px;
  color: #fff;
  font-size: .6rem;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-shadow: 0 1px 8px #000;
`;

const ResultInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px;
  @media(max-width:420px){align-items:flex-start;flex-direction:column;}
`;

const ResultName = styled.div`
  margin-bottom: 4px;
  color: #fff;
  font-family: 'Oswald',sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
`;

const ResultFocus = styled.div`
  margin-bottom: 4px;
  color: #ff8a36;
  font-size: .7rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const ResultDetail = styled.p`
  margin: 0;
  color: #999;
  font-size: .68rem;
`;

const ResultValue = styled.strong`
  flex: 0 0 auto;
  color: #ff7a1a;
  font-family: 'Oswald',sans-serif;
  font-size: 1.9rem;
  line-height: 1;
`;

const Disclosure = styled.p`
  margin: 16px 0 0;
  color: #777;
  font-size: .67rem;
  line-height: 1.55;
  text-align: center;
`;

export default AboutPage;

const LogoBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 40px 0 20px;
  flex-wrap: wrap;
`;

const BigLogo = styled.img`
  height: 140px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 24px rgba(255,107,0,0.4));
`;

const LogoBannerText = styled.div`
  text-align: left;
  h1 {
    font-family: 'Rajdhani', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: 3px;
    margin: 0 0 4px;
  }
  p {
    color: #ff6b00;
    font-size: 0.85rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin: 0;
  }
  @media(max-width:600px){text-align:center;h1{font-size:2.2rem;letter-spacing:2px;}p{font-size:0.7rem;letter-spacing:2px;}}
`;
