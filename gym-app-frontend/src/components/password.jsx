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
  const [step, setStep] = useState("password");
  const [codeVerified, setCodeVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestingCode, setRequestingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
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
    setRequestingCode(true);
    try {
      await axios.post(`${API}/requestPasswordChangeCode`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setStep("verify");
      setCodeVerified(false);
      setVerificationCode("");
      setSuccessMessage("A verification code was sent to the owner email. It expires in 10 minutes.");
    } catch (error) {
      console.error("Verification code error:", error);
      if (error.response?.status === 403) {
        setErrorMessage("This login is not authorized as an admin, so no email was sent. Log out and sign in with the demo admin account.");
      } else {
        setErrorMessage("Could not send the code. Check the owner email and SMTP settings, or wait before requesting another code.");
      }
    } finally {
      setRequestingCode(false);
    }
  };

  const verifyCode = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    if (!/^\d{6}$/.test(verificationCode)) {
      setErrorMessage("Enter the six-digit owner verification code.");
      return;
    }

    setVerifyingCode(true);
    try {
      await axios.post(`${API}/verifyPasswordChangeCode`, { verificationCode }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCodeVerified(true);
      setSuccessMessage("Owner code verified. You can now change the password.");
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("The code is incorrect or expired. Request a new code and try again.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const validatePasswordFields = () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!oldPassword) {
      setErrorMessage("Enter your current password.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return false;
    }
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const continueToCode = () => {
    if (validatePasswordFields()) setStep("send");
  };

  const updatePassword = async () => {
    if (!validatePasswordFields()) return;
    if (requiresOwnerCode && !codeVerified) {
      setErrorMessage("Verify the owner code before changing the admin password.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await axios.post(
        `${API}/changePassword`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 200) {
        setSuccessMessage("Password updated successfully! Redirecting to login...");
        setOldPassword(""); setNewPassword(""); setConfirmPassword("");
        setVerificationCode("");
        setCodeVerified(false);
        localStorage.clear();
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to update password. Please check your current password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleMemberSubmit = (event) => {
    event.preventDefault();
    updatePassword();
  };

  return (
    <PageWrapper>
      <Card>
        <Title>Change Password</Title>
        <Subtitle>
          {requiresOwnerCode
            ? step === "password" ? "Step 1 of 3: Choose your new password" : step === "send" ? "Step 2 of 3: Send an owner verification code" : "Step 3 of 3: Verify the code to finish"
            : "Enter your current password and choose a new one"}
        </Subtitle>
        <form onSubmit={handleMemberSubmit}>
          {!requiresOwnerCode || step === "password" ? (
            <>
              {requiresOwnerCode && <VerificationHint>Admin password changes require a code sent to the owner email.</VerificationHint>}
              <Label>Current Password</Label>
              <Input type="password" placeholder="Current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
              <Label>New Password</Label>
              <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {requiresOwnerCode ? (
                <SubmitButton type="button" onClick={continueToCode}>Continue</SubmitButton>
              ) : (
                <SubmitButton type="submit" disabled={updatingPassword}>
                  {updatingPassword ? "Updating..." : "Update Password"}
                </SubmitButton>
              )}
            </>
          ) : step === "send" ? (
            <>
              <VerificationHint>We will send a one-time code to the owner email. Your password fields stay saved for the next step.</VerificationHint>
              <SubmitButton type="button" onClick={requestVerificationCode} disabled={requestingCode}>
                {requestingCode ? "Sending code..." : "Send verification code"}
              </SubmitButton>
              <SecondaryButton type="button" onClick={() => setStep("password")} disabled={requestingCode}>Back</SecondaryButton>
            </>
          ) : (
            <>
              {codeVerified ? (
                <>
                  <VerificationHint $verified>Owner email verified. Your password is ready to update.</VerificationHint>
                  <SubmitButton type="button" onClick={updatePassword} disabled={updatingPassword}>
                    {updatingPassword ? "Updating..." : "Update Password"}
                  </SubmitButton>
                </>
              ) : (
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
                  <SubmitButton type="button" onClick={verifyCode} disabled={verifyingCode || verificationCode.length !== 6}>
                    {verifyingCode ? "Verifying code..." : "Verify code"}
                  </SubmitButton>
                  <SecondaryButton type="button" onClick={requestVerificationCode} disabled={requestingCode || verifyingCode}>
                    {requestingCode ? "Sending code..." : "Resend code"}
                  </SecondaryButton>
                  <SecondaryButton type="button" onClick={() => setStep("password")} disabled={verifyingCode}>Back</SecondaryButton>
                </>
              )}
            </>
          )}
        </form>
        {successMessage && <StatusMsg success>{successMessage}</StatusMsg>}
        {errorMessage && <StatusMsg>{errorMessage}</StatusMsg>}
      </Card>
    </PageWrapper>
  );
};

export default PasswordUpdate;

const VerificationHint = styled.p`
  margin: 0 0 18px;
  color: ${p => p.$verified ? "#86efac" : "#aaa"};
  font-size: 0.85rem;
`;

const SecondaryButton = styled.button`
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #383838;
  border-radius: 6px;
  background: #171717;
  color: #ccc;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

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
