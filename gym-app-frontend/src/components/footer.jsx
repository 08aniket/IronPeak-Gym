import styled from "styled-components";
import logoImg from "../assets/logo.png";

const trainingIcons = [
    { icon: "fa-dumbbell", label: "Strength", tone: "orange" },
    { icon: "fa-person-running", label: "Cardio", tone: "blue" },
    { icon: "fa-heart-pulse", label: "Fitness", tone: "red" },
    { icon: "fa-stopwatch", label: "Training", tone: "green" },
    { icon: "fa-weight-hanging", label: "Weights", tone: "amber" },
    { icon: "fa-bicycle", label: "Cycling", tone: "teal" },
];

const Footer = () => (
    <FooterContainer>
        <FooterScene aria-hidden="true">
            <Plate className="plate-one" />
            <Plate className="plate-two" />
            <Plate className="plate-three" />
            <Plate className="plate-four" />
            <Dumbbell>
                <DumbbellWeight className="weight-left" />
                <DumbbellBar />
                <DumbbellWeight className="weight-right" />
            </Dumbbell>
            <Kettlebell><KettlebellHandle /><KettlebellBody /></Kettlebell>
            <ColorBar className="color-bar-one" />
            <ColorBar className="color-bar-two" />
            <FloorLines />
        </FooterScene>

        <FooterCallout>
            <div>
                <CalloutEyebrow>Your next chapter starts here</CalloutEyebrow>
                <CalloutTitle>Ready to get stronger?</CalloutTitle>
            </div>
            <FooterJoin href="/join">Join IronPeak <i className="fas fa-arrow-right" /></FooterJoin>
        </FooterCallout>

        <Column>
            <BrandRow><FooterLogo src={logoImg} alt="IronPeak Gym" /></BrandRow>
            <BrandName>IRONPEAK GYM</BrandName>
            <Tagline>Forge Your Strength. Own Your Journey.</Tagline>
            <OwnerLine>Owned &amp; operated by <strong>Aniket Shaw</strong></OwnerLine>
            <SocialRow aria-label="Contact links">
                <SocialLink href="mailto:contact@ironpeakgym.in" aria-label="Email IronPeak Gym"><i className="fas fa-envelope" /></SocialLink>
                <SocialLink href="tel:+919876543210" aria-label="Call IronPeak Gym"><i className="fas fa-phone" /></SocialLink>
                <SocialLink href="/join" aria-label="Join IronPeak Gym"><i className="fas fa-arrow-up-right-from-square" /></SocialLink>
            </SocialRow>
        </Column>

        <Column>
            <ColumnTitle>Contact Us</ColumnTitle>
            <InfoItem><i className="fas fa-location-dot" />Salt Lake City, Sector V, Kolkata, West Bengal, India — 700091</InfoItem>
            <InfoItem><i className="fas fa-phone" />+91 98765 43210</InfoItem>
            <InfoItem><i className="fas fa-envelope" />contact@ironpeakgym.in</InfoItem>
        </Column>

        <Column>
            <ColumnTitle>Opening Hours</ColumnTitle>
            <InfoItem>Monday – Friday: 6:00 AM – 10:00 PM</InfoItem>
            <InfoItem>Saturday: 7:00 AM – 8:00 PM</InfoItem>
            <InfoItem>Sunday: 8:00 AM – 2:00 PM</InfoItem>
        </Column>

        <EquipmentRail aria-label="Training activities">
            {trainingIcons.map(item => (
                <EquipmentIcon key={item.label} $tone={item.tone} title={item.label} aria-hidden="true">
                    <i className={`fas ${item.icon}`} />
                </EquipmentIcon>
            ))}
        </EquipmentRail>

        <FooterBottom>
            <BackToTop type="button" aria-label="Back to top" title="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <BackToTopArrow><i className="fas fa-arrow-up" /></BackToTopArrow>
                <BackToTopBarbell><i className="fas fa-dumbbell" /></BackToTopBarbell>
            </BackToTop>
            <BackToTopLabel>BACK TO TOP</BackToTopLabel>
            <CopyRight>© {new Date().getFullYear()} IronPeak Gym — Aniket Shaw. All rights reserved.</CopyRight>
        </FooterBottom>
    </FooterContainer>
);

export default Footer;

const FooterContainer = styled.footer`
  position:relative;isolation:isolate;overflow:hidden;color:#ccc;
  display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px;
  padding:0 clamp(16px,4vw,52px) 12px;border-top:1px solid rgba(255,107,0,.25);
  background:radial-gradient(ellipse at 14% 88%,rgba(37,132,139,.09),transparent 34%),radial-gradient(ellipse at 86% 26%,rgba(255,107,0,.09),transparent 32%),repeating-linear-gradient(135deg,rgba(255,255,255,.022) 0 1px,transparent 1px 12px),#0d0d0d;
  @media(max-width:760px){grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;padding-bottom:12px;}
  @media(max-width:520px){grid-template-columns:1fr;gap:0;}
`;

const FooterScene = styled.div`
  position:absolute;inset:0;z-index:0;pointer-events:none;perspective:700px;overflow:hidden;opacity:.48;
`;

const Plate = styled.div`
  position:absolute;width:118px;height:118px;border:10px solid rgba(255,107,0,.16);border-radius:50%;
  box-shadow:inset 0 0 0 9px rgba(255,255,255,.035),0 0 26px rgba(255,107,0,.1);
  transform:rotateX(62deg) rotateZ(24deg);animation:plateFloat 9s ease-in-out infinite alternate;
  &::after{content:"";position:absolute;inset:37px;border:4px solid rgba(255,255,255,.08);border-radius:50%;}
  &.plate-one{right:8%;top:17%;}
  &.plate-two{right:19%;bottom:-36px;transform:scale(.65) rotateX(62deg) rotateZ(-18deg);animation-delay:-3s;}
  &.plate-three{right:2%;bottom:13%;width:82px;height:82px;border-width:8px;border-color:rgba(47,158,131,.27);animation-delay:-5s;}
  &.plate-four{left:4%;bottom:1%;width:94px;height:94px;border-width:9px;border-color:rgba(62,117,190,.22);animation-delay:-2s;}
  @keyframes plateFloat{to{translate:0 -9px;rotate:0 0 1 8deg;}}
`;

const Dumbbell = styled.div`
  position:absolute;right:7%;bottom:16%;width:230px;height:46px;transform:rotate(-18deg) rotateY(-18deg);
  animation:dumbbellFloat 7s ease-in-out infinite alternate;
  @keyframes dumbbellFloat{to{translate:0 -12px;rotate:-13deg;}}
`;

const DumbbellBar = styled.div`
  position:absolute;left:18px;right:18px;top:19px;height:8px;border-radius:8px;background:linear-gradient(#dedede,#777 48%,#292929 52%,#aaa);
`;

const DumbbellWeight = styled.div`
  position:absolute;top:0;width:44px;height:46px;border:7px solid #ff6b00;border-radius:11px;
  background:linear-gradient(135deg,#292929,#0a0a0a);box-shadow:7px 7px 0 rgba(255,107,0,.16);
  &.weight-left{left:0;}&.weight-right{right:0;}
`;

const Kettlebell = styled.div`
  position:absolute;right:34%;bottom:5%;width:70px;height:84px;transform:rotate(12deg);opacity:.55;
  @media(max-width:600px){right:8%;bottom:8%;transform:scale(.65) rotate(12deg);}
`;

const KettlebellHandle = styled.div`
  position:absolute;left:17px;top:0;width:36px;height:38px;border:7px solid rgba(255,107,0,.5);border-bottom:0;border-radius:22px 22px 0 0;
`;

const KettlebellBody = styled.div`
  position:absolute;left:4px;right:4px;bottom:0;height:59px;border:2px solid rgba(47,158,131,.62);border-radius:40% 40% 46% 46%;
  background:linear-gradient(135deg,rgba(47,158,131,.22),rgba(12,12,12,.85));box-shadow:inset 7px 0 12px rgba(255,255,255,.04),9px 10px 18px rgba(0,0,0,.3);
`;

const ColorBar = styled.div`
  position:absolute;height:8px;width:102px;border-radius:8px;opacity:.5;transform:rotate(-24deg);
  &.color-bar-one{left:14%;top:45%;background:linear-gradient(90deg,#d35416,#f0a22e);}
  &.color-bar-two{right:23%;top:61%;width:68px;background:linear-gradient(90deg,#2f9e83,#3e75be);transform:rotate(28deg);}
`;

const FloorLines = styled.div`
  position:absolute;left:28%;right:-10%;bottom:-54%;height:90%;transform:rotate(-8deg) perspective(320px) rotateX(58deg);
  border-top:1px solid rgba(255,107,0,.13);background:repeating-linear-gradient(90deg,transparent 0 54px,rgba(255,255,255,.03) 55px 56px),repeating-linear-gradient(0deg,transparent 0 35px,rgba(255,255,255,.03) 36px 37px);
`;

const FooterCallout = styled.div`
  position:relative;z-index:1;grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:16px;
  padding:19px 0 16px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:2px;
  @media(max-width:520px){padding:17px 0 13px;}
`;

const CalloutEyebrow = styled.div`color:#ff8732;font-size:.62rem;font-weight:800;letter-spacing:1.8px;margin-bottom:4px;`;
const CalloutTitle = styled.h2`font-family:'Rajdhani',sans-serif;color:#fff;font-size:clamp(1.4rem,3vw,1.9rem);line-height:1.1;`;
const FooterJoin = styled.a`
  display:inline-flex;align-items:center;gap:9px;padding:9px 13px;border-radius:6px;background:#ff6b00;color:#fff;
  font-weight:800;font-size:.78rem;text-decoration:none;white-space:nowrap;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;
  &:hover{background:#e45e00;transform:translateY(-3px);box-shadow:0 9px 20px rgba(255,107,0,.2);}
`;

const Column = styled.div`
  min-width:0;padding:9px 10px 10px;position:relative;z-index:1;
  @media(max-width:520px){padding:9px 2px;}
`;

const BrandRow = styled.div`display:flex;align-items:center;margin-bottom:7px;`;
const FooterLogo = styled.img`height:48px;width:auto;object-fit:contain;`;
const BrandName = styled.h2`font-family:'Rajdhani',sans-serif;color:#ff6b00;font-size:1.45rem;letter-spacing:2px;margin:0;`;
const Tagline = styled.p`color:#aaa;font-style:italic;font-size:.82rem;margin:0;`;
const OwnerLine = styled.p`color:#999;font-size:.78rem;margin:6px 0 0;strong{color:#ff8732;}`;
const ColumnTitle = styled.h3`color:#ff8732;font-size:.9rem;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;`;
const InfoItem = styled.p`margin:5px 0;font-size:.82rem;color:#b0b0b0;line-height:1.5;overflow-wrap:anywhere;i{color:#ff8732;margin-right:8px;}`;
const SocialRow = styled.div`display:flex;gap:7px;margin-top:12px;`;
const SocialLink = styled.a`
  width:31px;height:31px;display:grid;place-items:center;border:1px solid #3b3b3b;border-radius:50%;color:#bbb;
  transition:transform .2s ease,color .2s ease,border-color .2s ease;
  &:hover{transform:translateY(-3px);color:#ff8732;border-color:#ff8732;}
`;

const EquipmentRail = styled.div`
  grid-column:1/-1;position:relative;z-index:1;display:flex;align-items:center;justify-content:center;
  gap:clamp(18px,5vw,54px);padding:7px 0 10px;border-top:1px solid rgba(255,255,255,.07);
  @media(max-width:520px){gap:clamp(16px,7vw,32px);padding:8px 0 10px;}
`;

const EquipmentIcon = styled.span`
  font-size:1rem;opacity:.75;transition:transform .25s ease,opacity .25s ease,filter .25s ease;
  color:${p => p.$tone === "blue" ? "#64a8e7" : p.$tone === "red" ? "#e26c5c" : p.$tone === "green" ? "#69c791" : p.$tone === "amber" ? "#e8ba57" : p.$tone === "teal" ? "#4dc2ae" : "#ff8732"};
  &:hover{opacity:1;transform:translateY(-4px) scale(1.16);filter:drop-shadow(0 0 8px currentColor);}
`;

const FooterBottom = styled.div`
  grid-column:1/-1;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;
`;

const BackToTop = styled.button`
  position:relative;width:54px;height:54px;padding:0;border:1px solid #424242;border-radius:50%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;
  background:radial-gradient(circle at 35% 25%,#313131,#111 68%);color:#f4ba4a;
  box-shadow:0 7px 18px rgba(0,0,0,.4),inset 0 0 0 4px rgba(255,255,255,.025);
  transition:transform .3s ease,box-shadow .3s ease,color .3s ease;
  &:hover{transform:translateY(-4px);color:#fff;box-shadow:0 12px 24px rgba(0,0,0,.5),0 0 18px rgba(47,158,131,.24);}
`;
const BackToTopArrow = styled.span`font-size:.78rem;line-height:1;`;
const BackToTopBarbell = styled.span`font-size:.95rem;line-height:1;`;
const BackToTopLabel = styled.span`color:#929292;font-size:.52rem;font-weight:800;letter-spacing:1.4px;margin-top:4px;`;

const CopyRight = styled.div`
  width:100%;text-align:center;color:#858585;font-size:.74rem;padding-top:9px;
  border-top:1px solid rgba(255,255,255,.09);margin-top:7px;z-index:1;
  @media(max-width:600px){padding-top:8px;}
`;
