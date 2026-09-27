import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import logoImg from "../assets/logo.png";
import { API } from "../api";


const JoinPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    fitnessGoal: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const [firstName, ...rest] = formData.name.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      // Save to database
      await axios.post(`${API}/interest`, {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        fitnessGoal: formData.fitnessGoal,
        message: formData.message,
      });

      // Also try email — fire and forget, don't block on failure
      axios.post(`${API}/sendEmail`, {
        firstName: firstName || formData.name,
        lastName: lastName || "",
        email: formData.email,
        message: `Interest Form:\nPhone: ${formData.phone}\nAge: ${formData.age}\nGender: ${formData.gender}\nGoal: ${formData.fitnessGoal}\nMessage: ${formData.message}`,
      }).catch(() => { });

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", age: "", gender: "", fitnessGoal: "", message: "" });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormCard>
        <LogoHeader>
          <img src={logoImg} alt="IronPeak" style={{ height: "120px", marginBottom: "14px", filter: "drop-shadow(0 0 20px rgba(255,107,0,0.4))" }} />
          <PageTitle>Join IronPeak Gym</PageTitle>
        </LogoHeader>
        <PageSubtitle>
          Welcome! Fill in this form and our team will contact you within 24 hours
          to get you started.
        </PageSubtitle>

        {status === "success" && (
          <StatusMsg $success>
            <i className="fas fa-check-circle" /> Your form has been submitted! We&apos;ll reach out soon.
          </StatusMsg>
        )}
        {status === "error" && (
          <StatusMsg>
            <i className="fas fa-exclamation-circle" /> Something went wrong. Please try again.
          </StatusMsg>
        )}

        <form onSubmit={handleSubmit}>
          <InputRow>
            <InputGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                name="name"
                placeholder="Aniket Shaw"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Email Address *</Label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </InputRow>

          <InputRow>
            <InputGroup>
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Age *</Label>
              <Input
                type="number"
                name="age"
                placeholder="e.g. 25"
                min="10"
                max="100"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </InputRow>

          <InputRow>
            <InputGroup>
              <Label>Gender</Label>
              <Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>Primary Fitness Goal</Label>
              <Select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
                <option value="">Select a goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Improve Endurance">Improve Endurance</option>
                <option value="Flexibility & Mobility">Flexibility &amp; Mobility</option>
                <option value="General Fitness">General Fitness</option>
                <option value="Stress Relief">Stress Relief</option>
              </Select>
            </InputGroup>
          </InputRow>

          <InputGroup style={{ marginBottom: "20px" }}>
            <Label>Additional Message (optional)</Label>
            <TextArea
              name="message"
              placeholder="Any specific requirements or questions..."
              rows={4}
              value={formData.message}
              onChange={handleChange}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Interest Form"}
          </SubmitButton>
        </form>
      </FormCard>
    </PageWrapper>
  );
};

export default JoinPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 100px 40px 60px;
  @media(max-width:600px){padding:88px 14px 36px;}
`;

const FormCard = styled.div`
  background-color: #111;
  border: 1px solid #1e1e1e;
  border-top: 3px solid #ff6b00;
  border-radius: 8px;
  padding: 50px 40px;
  width: 100%;
  max-width: 700px;
  @media(max-width:600px){padding:32px 18px;}
`;

const LogoHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
`;

const PageTitle = styled.h1`
  font-family: 'Rajdhani', sans-serif;
  text-align: center;
  font-size: 2.2rem;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const InputRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 220px;
`;

const Label = styled.label`
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  margin-bottom: 6px;
  letter-spacing: 0.4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }

  &::placeholder {
    color: #444;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }

  option {
    background-color: #0a0a0a;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background-color: #0a0a0a;
  color: #fff;
  font-size: 0.95rem;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }

  &::placeholder {
    color: #444;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e05e00;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMsg = styled.div`
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: ${({ $success }) =>
    $success ? "rgba(76, 175, 80, 0.1)" : "rgba(231, 76, 60, 0.1)"};
  border: 1px solid ${({ $success }) => ($success ? "#4caf50" : "#e74c3c")};
  color: ${({ $success }) => ($success ? "#4caf50" : "#e74c3c")};

  i {
    margin-right: 8px;
  }
`;
