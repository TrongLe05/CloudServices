"use client";

import { useState } from "react";
import { EmailStep } from "./forgot-password/EmailStep";
import { OtpStep } from "./forgot-password/OtpStep";
import { NewPasswordStep } from "./forgot-password/NewPasswordStep";
import { SuccessStep } from "./forgot-password/SuccessStep";

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleEmailSuccess = (validEmail: string) => {
    setEmail(validEmail);
    setStep(2);
  };

  const handleOtpSuccess = (token: string) => {
    setResetToken(token);
    setStep(3);
  };

  const handlePasswordSuccess = () => {
    setStep(4);
  };

  const handleBackToEmail = () => {
    setStep(1);
  };

  // Orchestrate rendering based on the active step (4-step workflow)
  switch (step) {
    case 1:
      return <EmailStep onSuccess={handleEmailSuccess} />;
    case 2:
      return (
        <OtpStep
          email={email}
          onSuccess={handleOtpSuccess}
          onBack={handleBackToEmail}
        />
      );
    case 3:
      return (
        <NewPasswordStep
          resetToken={resetToken}
          onSuccess={handlePasswordSuccess}
        />
      );
    case 4:
      return <SuccessStep />;
    default:
      return null;
  }
};
