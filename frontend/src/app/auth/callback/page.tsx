"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { RefreshCcw } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const DiscordCallback = () => {
  const router = useRouter();
  const supabase = createBrowserClient("https://szzbigujyuvejetfffio.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6emJpZ3VqeXV2ZWpldGZmZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MzQxMzgsImV4cCI6MjA1MzAxMDEzOH0.ABCCnMC3VBilPmaDB79Fm5c3qdp-9C8QsFOH3LYuHlc");
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          setError("Konnte keinen Benutzer finden. Bitte erneut versuchen.");
          return;
        }

        console.log(data);

        router.push("/passwords");
      } catch (err) {
        console.error("Error during callback handling:", err);
        setError("Ein Fehler ist aufgetreten. Bitte erneut versuchen.");
      }
    };

    handleCallback();
  }, [router, supabase]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900 text-center p-4">
        <div className="w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Fehler!</h2>
          <p className="text-neutral-300 mb-6">{error}</p>
          <Button
            onClick={() => router.push("/auth")}
            variant="danger"
            className="w-full"
            icon={RefreshCcw}
            content="Erneut Anmelden"
          />
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
    </div>
  );
};

export default DiscordCallback;
