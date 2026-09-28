import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { API } from "../api";

const PasswordUpdate = () => {
  const [accessToken, setAccessToken] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [requiresOwnerCode, setRequiresOwnerCode] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/login");
    setAccessToken(token);
    try {
      const roles = JSON.parse(localStorage.getItem("userRole") || "[]");
      setRequiresOwnerCode(roles.includes("ROLE_ADMIN"));
    } catch {
      setRequiresOwnerCode(false);
    }
  }, [navigate]);

  const requestVerificationCode = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    try {
      await axios.post(`${API}/requestPasswordChangeCode`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCodeRequested(true);
      setSuccessMessage("A verification code was sent to the demo owner email. It expires in 10 minutes.");
    } catch (error) {
      console.error("Verification code error:", error);
      setErrorMessage("Could not send the verification code. The owner email and SMTP must be configured on the backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }
    if (requiresOwnerCode && !codeRequested) {
      setErrorMessage("Request an owner verification code before changing the admin password.");
      return;
    }
    if (requiresOwnerCode && !/^\d{6}$/.test(verificationCode)) {
      setErrorMessage("Enter the six-digit owner verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/changePassword`,
        { oldPassword, newPassword, verificationCode: requiresOwnerCode ? verificationCode : undefined },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 200) {
        setSuccessMessage("Password updated successfully! Redirecting to login...");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        setVerificationCode("");
        localStorage.clear();
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to update password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Change Password</Title>
        <Subtitle>Enter your current password and choose a new one</Subtitle>
        <form onSubmit={handleSubmit}>
          <Label>Current Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {requiresOwnerCode && (
            <>
              <SubmitButton type="button" onClick={requestVerificationCode} disabled={loading}>
                {loading ? "Sending code..." : codeRequested ? "Resend owner verification code" : "Send owner verification code"}
              </SubmitButton>
              {codeRequested && (
                <>
                  <Label>Owner verification code</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </>
              )}
            </>
          )}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </SubmitButton>
        </form>
        {successMessage && <StatusMsg success>{successMessage}</StatusMsg>}
        {errorMessage && <StatusMsg>{errorMessage}</StatusMsg>}
      </Card>
    </PageWrapper>
  );
};

export default PasswordUpdate;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Card = styled.div`
  background-color: #111;
  border: 1px solid #1e1e1e;
  border-top: 3px solid #ff6b00;
  border-radius: 8px;
  padding: 44px 40px;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h2`
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.9rem;
  letter-spacing: 1px;
  margin: 0 0 6px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 28px;
`;

const Label = styled.label`
  display: block;
  color: #aaa;
  font-size: 0.82rem;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  margin-bottom: 18px;
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ff6b00;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e05e00;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMsg = styled.p`
  margin-top: 14px;
  color: ${({ success }) => (success ? "#4caf50" : "#e74c3c")};
  font-weight: 600;
  font-size: 0.9rem;
`;
