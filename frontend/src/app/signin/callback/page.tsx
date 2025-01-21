/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { RefreshCcw } from "lucide-react";
import { getBaseApiUrl, fetchUserById, getUserIdFromToken, verifyTwoFactorCode } from "@/lib/api";
import { VerifyTwoFactorDialog } from "@/components/Dialogs/VerifyTwoFactor";

const DiscordCallback = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state");

        if (!state) {
          setError("Kein Authentifizierungstoken vorhanden.");
          return;
        }

        setToken(state);

        const decodedToken = JSON.parse(atob(state.split('.')[1]));

        document.cookie = `eagletoken=${state}; Expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;

        const userId = decodedToken?.id;
        if (!userId) {
          setError("Benutzer nicht gefunden.");
          return;
        }

        const userData = await fetchUserById(userId || "");

        if (!userData) {
          setError("Benutzer nicht gefunden.");
          return;
        }

        if (userData.twoFactorEnabled) {
          setTwoFASecret(userData.twoFactorSecret || "");
          setIs2FADialogOpen(true);
        } else {
          router.push("/passwords");
        }
      } catch (error) {
        setError("Fehler beim Verarbeiten des Tokens. Bitte versuchen Sie es erneut.");
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900 text-center p-4">
        <div className="w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Fehler!</h2>
          <p className="text-neutral-300 mb-6">{error}</p>
          <Button
            onClick={() => (window.location.href = `${getBaseApiUrl()}/api/auth`)}
            variant="danger"
            className="w-full"
            icon={RefreshCcw}
            content="Erneut Anmelden"
          ></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-900 text-center p-4">
      <div className="w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600">
        <h2 className="text-3xl font-bold text-neutral-100 mb-4">
          Authentifizierung wird verarbeitet...
        </h2>
        <Spinner className="h-12 w-12 text-neutral-500 mx-auto mb-6" />
        <p className="text-neutral-300">Bitte warten Sie einen Moment...</p>
      </div>
      <VerifyTwoFactorDialog
        isOpen={is2FADialogOpen}
        onClose={() => setIs2FADialogOpen(false)}
        onSubmit={verify2FACode}
      />
    </div>
  );

  async function verify2FACode(otp: string) {
    try {
      const isValid = await verifyTwoFactorCode(otp, token || "");

      if (isValid) {
        router.push("/passwords");
      } else {
        setError("Ungültiger 2FA-Code. Bitte versuche es erneut.");
      }
    } catch (err) {
      console.error("Error during 2FA verification:", err);
      setError("Fehler bei der Verifizierung des 2FA-Codes.");
    }
  }
};

export default DiscordCallback;
