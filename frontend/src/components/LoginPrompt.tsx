'use client'

import React from "react";
import { Button } from "@/components/ui/Button";
import { LogInIcon } from "lucide-react";
import { connectDB } from "@/lib/api";
import { useRouter } from "next/navigation";

export const LoginPrompt: React.FC = () => {
  const router = useRouter();
  const handleLoginClick = async () => {
    try {
      const supabase = await connectDB();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: "http://localhost:3000/signin/callback" }
      });

      if (error) {
        console.error("Error during Discord sign-in:", error.message);
      } else {
        router.push("/passwords");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="flex bg-neutral-900 items-center justify-center p-8 min-h-screen">
      <div className="w-full max-w-md bg-neutral-800 rounded-2xl p-8 shadow-xl border border-neutral-700/50">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-neutral-100">
            Willkommen zurück!
          </h1>
          <p className="text-neutral-400">
            Melde dich an, um die Plattform zu nutzen.
          </p>
        </div>

        <Button
          size="lg"
          className="w-full"
          content="Anmelden (yur)"
          icon={LogInIcon}
          onClick={handleLoginClick}
        />
      </div>
    </div>
  );
};
