import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { API } from "../api";
import Footer from "./footer";

function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setSending(true);
    const [firstName, ...rest] = formData.fullName.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      await axios.post(`${API}/interest`, {
        fullName: formData.fullName,
        email: formData.email,
        phone: null,
        age: null,
        gender: null,
        fitnessGoal: "Contact inquiry",
        message: formData.message,
      });

      // Email is a notification; the saved inquiry remains available in the dashboard.
      axios.post(`${API}/sendEmail`, {
        firstName: firstName || "",
        lastName: lastName || "",
        email: formData.email,
        message: `Contact inquiry from ${formData.fullName}:\n${formData.message}`,
      }).catch((error) => console.error("Contact notification failed:", error));

      setStatus("success");
      setFormData({ fullName: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageWrapper>
        <ContactIntro>
          <ContactEyebrow>COME SAY HELLO</ContactEyebrow>
          <PageTitle>Let&apos;s Get You Moving</PageTitle>
          <ContactLead>Questions about membership, training, or your first visit? Our team is ready to help you find your next step.</ContactLead>
        </ContactIntro>

        <ContactGrid>
          <ContactRail>
            <RailTitle>Reach IronPeak</RailTitle>
            <RailCopy>Drop by, give us a call, or send a note. We&apos;ll point you in the right direction.</RailCopy>
            <InfoRow>
              <InfoBox>
                <InfoIcon $tone="orange"><i className="fas fa-location-dot" /></InfoIcon>
                <InfoTitle>Visit</InfoTitle>
                <InfoText>Salt Lake City, Sector V<br />Kolkata, West Bengal — 700091</InfoText>
              </InfoBox>
              <InfoBox>
                <InfoIcon $tone="green"><i className="fas fa-phone" /></InfoIcon>
                <InfoTitle>Call</InfoTitle>
                <InfoText><a href="tel:+919876543210">+91 98765 43210</a></InfoText>
              </InfoBox>
              <InfoBox>
                <InfoIcon $tone="blue"><i className="fas fa-envelope" /></InfoIcon>
                <InfoTitle>Email</InfoTitle>
                <InfoText><a href="mailto:contact@ironpeakgym.in">contact@ironpeakgym.in</a></InfoText>
              </InfoBox>
              <InfoBox>
                <InfoIcon $tone="amber"><i className="fas fa-clock" /></InfoIcon>
                <InfoTitle>Open</InfoTitle>
                <InfoText>Mon–Fri: 6AM–10PM<br />Sat: 7AM–8PM<br />Sun: 8AM–2PM</InfoText>
              </InfoBox>
            </InfoRow>
            <RailAccent><i className="fas fa-dumbbell" /><span>YOUR FIRST SESSION STARTS WITH A CONVERSATION</span></RailAccent>
          </ContactRail>

          <FormCard>
            <FormTopline><span>01 / CONTACT FORM</span><i className="fas fa-arrow-down-long" /></FormTopline>
            <FormTitle>Tell us what you&apos;re working toward.</FormTitle>
            <form onSubmit={handleSubmit}>
              <InputRow>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputRow>
              <TextArea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
              <SubmitButton type="submit" disabled={sending}>{sending ? "Sending..." : <>Send Message <i className="fas fa-arrow-right" /></>}</SubmitButton>
            </form>
            {status === "success" && (
              <StatusMsg $success>Message sent successfully! We&apos;ll get back to you soon.</StatusMsg>
            )}
            {status === "error" && (
              <StatusMsg>Something went wrong. Please try again.</StatusMsg>
            )}
          </FormCard>
        </ContactGrid>
      </PageWrapper>
      <Footer />
    </>
  );
}

export default ContactPage;

const PageWrapper = styled.div`
  background:radial-gradient(ellipse at 10% 15%,rgba(255,107,0,.09),transparent 34%),#080808;
  min-height: 100vh;
  padding: 108px clamp(16px,5vw,72px) 72px;
  color: #fff;
  width: 100%;
`;

const ContactIntro = styled.div`max-width:760px;margin:0 auto 42px;text-align:center;`;
const ContactEyebrow = styled.div`color:#ff8732;font-size:.7rem;font-weight:800;letter-spacing:3px;margin-bottom:10px;`;
const ContactLead = styled.p`max-width:590px;margin:14px auto 0;color:#aaa;line-height:1.7;font-size:.96rem;`;
const ContactGrid = styled.div`max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:24px;align-items:stretch;@media(max-width:820px){grid-template-columns:1fr;}`;
const ContactRail = styled.div`position:relative;overflow:hidden;padding:clamp(24px,4vw,42px);border:1px solid #2a2a2a;border-radius:14px;background:linear-gradient(145deg,#171717,#101010);&::after{content:"";position:absolute;width:220px;height:220px;border:1px solid rgba(255,107,0,.18);border-radius:50%;right:-100px;bottom:-120px;box-shadow:0 0 0 18px rgba(255,107,0,.025),0 0 0 38px rgba(255,107,0,.02);pointer-events:none;}`;
const RailTitle = styled.h2`font-family:'Rajdhani',sans-serif;color:#fff;font-size:1.7rem;margin:0 0 8px;`;
const RailCopy = styled.p`color:#999;line-height:1.65;margin:0 0 24px;font-size:.88rem;`;
const RailAccent = styled.div`display:flex;align-items:center;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid #303030;color:#aaa;font-size:.62rem;font-weight:800;letter-spacing:1.2px;i{color:#ff6b00;font-size:1.3rem;}`;

const PageTitle = styled.h1`
  font-family: 'Oswald', sans-serif;
  text-align: center;
  font-size: 2.8rem;
  letter-spacing: 3px;
  margin-bottom: 50px;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: #ff6b00;
    margin: 10px auto 0;
  }
  @media(max-width:600px){font-size:2.1rem;letter-spacing:2px;margin-bottom:32px;}
`;

const InfoRow = styled.div`
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;
  @media(max-width:460px){grid-template-columns:1fr;}
`;

const InfoBox = styled.div`
  min-width:0;background:#111;border:1px solid #2a2a2a;padding:15px;border-radius:9px;
  transition:transform .25s ease,border-color .25s ease,background .25s ease;

  &:hover {
    transform:translateY(-3px);border-color:#555;background:#151515;
  }
`;

const InfoIcon = styled.div`width:34px;height:34px;display:grid;place-items:center;border-radius:10px;margin-bottom:10px;color:${p => p.$tone === "green" ? "#65c58a" : p.$tone === "blue" ? "#69b9e6" : p.$tone === "amber" ? "#f0b94d" : "#ff8732"};background:${p => p.$tone === "green" ? "rgba(76,175,80,.13)" : p.$tone === "blue" ? "rgba(52,152,219,.14)" : p.$tone === "amber" ? "rgba(243,156,18,.14)" : "rgba(255,107,0,.14)"};`;

const InfoTitle = styled.p`
  font-weight: 700;
  color: #fff;
  margin: 6px 0 4px;
  font-size: 0.9rem;
  text-transform: uppercase;letter-spacing:.8px;
`;

const InfoText = styled.p`
  color: #aaa;
  font-size: 0.78rem;
  margin: 0;
  line-height: 1.6;
  overflow-wrap:anywhere;
  a{color:#c9c9c9;text-decoration:none;&:hover{color:#ff8732;}}
`;

const FormCard = styled.div`
  background:linear-gradient(145deg,#171717,#101010);border:1px solid #2b2b2b;
  border-radius:14px;padding:clamp(24px,4vw,42px);box-shadow:0 24px 48px rgba(0,0,0,.22);
`;

const FormTopline = styled.div`display:flex;justify-content:space-between;color:#ff8732;font-size:.68rem;font-weight:800;letter-spacing:1.8px;margin-bottom:16px;i{color:#888;}`;

const FormTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: clamp(1.4rem,3vw,1.9rem);
  margin-bottom: 24px;
  letter-spacing: 1px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  &>*{min-width:0;}
`;

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 12px 14px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }

  &::placeholder {
    color: #555;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 0.95rem;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }

  &::placeholder {
    color: #555;
  }
`;

const SubmitButton = styled.button`
  margin-top: 16px;
  padding: 12px 32px;
  background:linear-gradient(100deg,#ff6b00,#db5200);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:transform .25s ease,box-shadow .25s ease,filter .25s ease;
  i{margin-left:10px;transition:transform .2s ease;}

  &:hover {
    filter:brightness(1.08);transform:translateY(-2px);box-shadow:0 10px 24px rgba(255,107,0,.2);
    i{transform:translateX(4px);}
  }
  &:disabled{opacity:.65;cursor:wait;transform:none;}
`;

const StatusMsg = styled.p`
  margin-top: 16px;
  color: ${({ $success }) => ($success ? "#4caf50" : "#e74c3c")};
  font-weight: 600;
`;
