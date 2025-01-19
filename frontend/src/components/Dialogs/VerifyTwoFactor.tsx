"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Key } from "lucide-react";
import { useState } from "react";

interface VerifyTwoFactorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (otp: string) => void;
}

export const VerifyTwoFactorDialog: React.FC<VerifyTwoFactorDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [otp, setOtp] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(otp);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={"Verify 2FA"}
        >
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
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!otp.trim() || otp.length !== 6}>
                        Verify 2FA
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
