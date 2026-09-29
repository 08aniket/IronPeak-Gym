import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import PropTypes from 'prop-types';

// ─── Chapter Data (correct order 01→04) ──────────────────────────
const chapters = [
  {
    id: "01",
    icon: "💪",
    title: "STRENGTH TRAINING",
    subtitle: "Progressive overload programs built for maximum muscle gain and raw power.",
    features: ["Periodized 4–16 week programs", "1RM tracking & progressive overload", "Compound lift mastery"],
    accent: "#ff2a2a",
    label: "STRENGTH"
  },
  {
    id: "02",
    icon: "🔥",
    title: "FAT LOSS PROGRAMS",
    subtitle: "Science-backed cutting protocols with precision nutrition guidance.",
    features: ["Metabolic rate optimization", "Macro-based nutrition planning", "Body recomposition protocols"],
    accent: "#ff2a2a",
    label: "FAT LOSS"
  },
  {
    id: "03",
    icon: "🏋️",
    title: "PERSONAL COACHING",
    subtitle: "1-on-1 expert coaching sessions tailored to your exact goals.",
    features: ["Dedicated certified coach", "Weekly check-ins & adjustments", "Real-time form correction"],
    accent: "#ff2a2a",
    label: "COACHING"
  },
  {
    id: "04",
    icon: "🧠",
    title: "MIND & RECOVERY",
    subtitle: "Mobility, stretching & mental conditioning for elite performance.",
    features: ["Yoga & mobility therapy", "Sleep & stress optimization", "Mental performance coaching"],
    accent: "#ff2a2a",
    label: "RECOVERY"
  }
];

// ─── Right-side stats ──────────────────────────────────────────
const stats = [
  { value: "1200+", label: "MEMBERS" },
  { value: "4.9★", label: "RATING" },
  { value: "98%", label: "RETENTION" }
];

const FRAME_COUNT = 232;

export default function CinematicScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);
  const mainTextOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.6]);

  const [images, setImages] = useState([]);
  const [currentFrameText, setCurrentFrameText] = useState("001");
  const [activeChapter, setActiveChapter] = useState(0);

  // Preload all 232 frames
  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const numStr = i.toString().padStart(4, '0');
      img.src = `https://ironpeak-gym-gray.vercel.app/frames/frame_${numStr}.jpg`;
      img.onload = () => {
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Draw frame on scroll
  useMotionValueEvent(frameIndex, "change", (latestFrame) => {
    if (!canvasRef.current || images.length === 0) return;
    const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(latestFrame) - 1));
    const img = images[idx];
    if (img && img.complete) {
      const canvas = canvasRef.current;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    setCurrentFrameText(Math.floor(latestFrame).toString().padStart(3, '0'));

    // Determine which chapter is active
    const p = latestFrame / FRAME_COUNT;
    chapters.forEach((_, i) => {
      const start = 0.12 + i * 0.2;
      const end = start + 0.17;
      if (p >= start && p <= end) setActiveChapter(i);
    });
  });

  // Resize canvas
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(frameIndex.get()) - 1));
      if (images[idx]?.complete) {
        canvasRef.current.getContext('2d').drawImage(images[idx], 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [images, frameIndex]);

  return (
    <CinematicContainer ref={containerRef}>
      <StickyBackground>

        {/* 232-frame canvas scrubber (1.1x scale crops Veo watermark) */}
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, transform: 'scale(1.10)', transformOrigin: 'center' }}
        />

        {/* Radial gradient so edges are dark, center is bright */}
        <BackgroundOverlay />

        {/* ── CENTER TEXT ─────────────────────────────────────── */}
        <CentralTextContainer as={motion.div} style={{ opacity: mainTextOpacity }}>
          <PremiumTag>PREMIUM FITNESS CLUB • EST. 2026</PremiumTag>
          <MassiveText>TRANSFORM</MassiveText>
          <MassiveText $colored>YOUR BODY</MassiveText>
          <SubTag>Become Your Strongest Version</SubTag>
          <JourneyButton>START YOUR JOURNEY →</JourneyButton>
          <ScrollHint>
            <span>SCROLL TO CONTINUE</span>
            <ScrollArrows aria-hidden="true"><span>↓</span><span>↓</span><span>↓</span></ScrollArrows>
          </ScrollHint>
        </CentralTextContainer>

        {/* ── LEFT CHAPTER CARDS ──────────────────────────────── */}
        {chapters.map((chapter, i) => {
          const start = 0.12 + i * 0.2;
          const end = start + 0.17;
          return <ChapterCard key={chapter.id} chapter={chapter} start={start} end={end} progress={scrollYProgress} />;
        })}

        {/* ── RIGHT STATS PANEL ─────────────────────────────── */}
        <RightPanel>
          {stats.map((s, i) => (
            <StatBlock key={i}>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatBlock>
          ))}

          <ChapterDots>
            <DotsLabel>CHAPTER</DotsLabel>
            {chapters.map((ch, i) => (
              <DotRow key={i}>
                <ChapterDotLabel $active={i === activeChapter}>{ch.label}</ChapterDotLabel>
                <Dot $active={i === activeChapter} />
              </DotRow>
            ))}
          </ChapterDots>

          <ProgressCounter>
            {currentFrameText} / {FRAME_COUNT}
          </ProgressCounter>
          <ProgressBarWrap>
            <motion.div style={{ width: '1px', height: '100%', background: '#ff2a2a', scaleY: scrollYProgress, transformOrigin: 'top' }} />
          </ProgressBarWrap>
        </RightPanel>

      </StickyBackground>

      {/* Scrollable spacer */}
      <ScrollableContent>
        <div style={{ height: '40vh' }} />
        {chapters.map((_, i) => (
          <div key={i} style={{ height: '120vh' }} />
        ))}
        <div style={{ height: '30vh' }} />
      </ScrollableContent>
    </CinematicContainer>
  );
}

// ─── Chapter Card (left overlay) ─────────────────────────────────
function ChapterCard({ chapter, start, end, progress }) {
  const opacity = useTransform(progress, [start - 0.05, start, end, end + 0.05], [0, 1, 1, 0]);
  const y = useTransform(progress, [start - 0.05, start, end, end + 0.05], [40, 0, 0, -40]);

  return (
    <StickyChapter as={motion.div} style={{ opacity, y }}>
      <ChapterBox>
        <ChapterHeader>— CHAPTER {chapter.id}</ChapterHeader>
        <IconBubble>{chapter.icon}</IconBubble>
        <ChapterTitle>{chapter.title}</ChapterTitle>
        <ChapterSubtitle>{chapter.subtitle}</ChapterSubtitle>
        <FeaturesList>
          {chapter.features.map((f, idx) => <li key={idx}>{f}</li>)}
        </FeaturesList>
      </ChapterBox>
    </StickyChapter>
  );
}

ChapterCard.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  progress: PropTypes.object.isRequired,
};

// ─── STYLED COMPONENTS ───────────────────────────────────────────

const CinematicContainer = styled.section`
  position: relative;
  width: 100%;
  height: 680vh;
  background-color: #000;
  color: #fff;
`;

const StickyBackground = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 100%);
  pointer-events: none;
  z-index: 2;
`;

/* ── CENTER TEXT ── */
const CentralTextContainer = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  pointer-events: none;
  width: 100%;
  padding: 0;
`;

const PremiumTag = styled.div`
  letter-spacing: 5px;
  font-size: 0.65rem;
  color: #fff;
  font-weight: 500;
  text-shadow: 0 1px 8px #000;
  background: rgba(0,0,0,0.45);
  border-top: 1px solid rgba(255,255,255,0.65);
  border-bottom: 1px solid rgba(255,255,255,0.65);
  padding: 5px 22px;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

const MassiveText = styled.h1`
  font-family: 'Rajdhani', 'Bebas Neue', sans-serif;
  font-size: clamp(3.5rem, 7vw, 7.5rem);
  line-height: 0.9;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  color: ${p => p.$colored ? '#ff2a2a' : '#ffffff'};
  letter-spacing: 3px;
  text-shadow: 0 4px 30px rgba(0,0,0,0.9);
`;

const SubTag = styled.div`
  font-size: 0.95rem;
  color: #ddd;
  margin-top: 14px;
  letter-spacing: 0.5px;
`;

const JourneyButton = styled.button`
  margin-top: 22px;
  padding: 11px 32px;
  background: transparent;
  border: 1px solid #ff2a2a;
  color: #ff2a2a;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.3s;
  &:hover { background: rgba(255,42,42,0.12); }
`;

const ScrollHint = styled.div`
  margin-top: 22px;
  font-size: 0.55rem;
  letter-spacing: 3px;
  color: #fff;
  text-shadow: 0 1px 8px #000;
  text-transform: uppercase;
  line-height: 1.8;
`;

const ScrollArrows = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff4545;
  font-size: 1rem;
  line-height: 0.75;
  text-shadow: 0 1px 8px #000;
`;

/* ── LEFT CHAPTER CARD ── */
const StickyChapter = styled.div`
  position: absolute;
  left: 44px;
  top: 55%;
  transform: translateY(-50%);
  z-index: 20;
  @media (max-width: 768px) { left: 14px; width: calc(100% - 28px); }
`;

const ChapterBox = styled.div`
  background: rgba(8,8,8,0.88);
  border-left: 2px solid #ff2a2a;
  padding: 28px 32px 34px;
  width: 320px;
  backdrop-filter: blur(10px);
  @media (max-width: 768px) { width: 100%; padding: 18px; }
`;

const ChapterHeader = styled.div`
  color: #ff2a2a;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 2.5px;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const IconBubble = styled.div`
  font-size: 1.6rem;
  margin-bottom: 10px;
`;

const ChapterTitle = styled.h2`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.45rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.1;
`;

const ChapterSubtitle = styled.div`
  color: #b0b0b0;
  font-size: 0.78rem;
  line-height: 1.5;
  margin-bottom: 14px;
`;

const FeaturesList = styled.ul`
  list-style: none; padding: 0; margin: 0;
  li {
    position: relative;
    padding-left: 14px;
    color: #888;
    font-size: 0.75rem;
    margin-bottom: 7px;
    &::before {
      content: '';
      position: absolute; left: 0; top: 6px;
      width: 5px; height: 5px;
      background: #ff2a2a;
      border-radius: 50%;
    }
  }
`;

/* ── RIGHT STATS PANEL ── */
const RightPanel = styled.div`
  position: absolute;
  right: 40px;
  top: 76px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 20;
  @media (max-width: 768px) { display: none; }
`;

const StatBlock = styled.div`
  text-align: right;
  margin-bottom: 22px;
`;

const StatValue = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.7rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.55rem;
  letter-spacing: 2px;
  color: #555;
  margin-top: 2px;
`;

const ChapterDots = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 20px;
`;

const DotsLabel = styled.div`
  writing-mode: vertical-rl;
  font-size: 0.55rem;
  letter-spacing: 4px;
  color: #444;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const DotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChapterDotLabel = styled.span`
  font-size: 0.6rem;
  letter-spacing: 1.5px;
  color: ${p => p.$active ? '#fff' : '#444'};
  text-transform: uppercase;
  transition: color 0.4s;
`;

const Dot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${p => p.$active ? '#ff2a2a' : '#333'};
  transition: background 0.4s;
  box-shadow: ${p => p.$active ? '0 0 8px #ff2a2a' : 'none'};
`;

const ProgressCounter = styled.div`
  writing-mode: vertical-rl;
  font-size: 0.62rem;
  letter-spacing: 6px;
  color: #444;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ProgressBarWrap = styled.div`
  height: 160px;
  width: 1px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
  align-self: flex-end;
`;

const ScrollableContent = styled.div`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
`;
