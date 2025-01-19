"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Key } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface TwoFactorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  secret: string;
}

export const TwoFactorDialog: React.FC<TwoFactorDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  secret,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setOtp("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={"Enable 2FA"}
    >
      {step === 1 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-neutral-600">Scan the QR code below with your 2FA app:</p>
          <QRCodeSVG bgColor={"#f5f5f5"} value={secret} size={128} />
          <div className="mt-4 text-neutral-600">
            <p>Or use this secret to configure your 2FA app:</p>
            <span className="block mt-2 font-mono">{secret}</span>
          </div>
          <div className="flex justify-center mt-6">
            <Button onClick={() => setStep(2)} className="w-full bg-blue-500 hover:bg-blue-600">
              Next
            </Button>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm text-neutral-400 mb-1"
            >
              Enter the OTP from your 2FA app
            </label>
            <Input
              id="otp"
              type="text"
              className="w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              icon={Key}
              required
              maxLength={6}
              placeholder="Enter OTP (6 digits)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" disabled={!otp.trim() || otp.length !== 6}>
              Enable 2FA
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
};
