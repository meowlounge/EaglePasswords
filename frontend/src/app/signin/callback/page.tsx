/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Spinner } from "@/app/components/ui/Spinner";
import { RefreshCcw } from "lucide-react";
import { getBaseApiUrl } from "@/app/lib/api";

const DiscordCallback = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = new URLSearchParams(window.location.search).get("token");
                if (!token) {
                    setError("Kein Authentifizierungstoken vorhanden.");
                    return;
                }

                document.cookie = `eagletoken=${token}; Expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure; SameSite=Strict`;

                router.push("/passwords");
            } catch (error) {
                setError("Fehler beim Verarbeiten des Tokens. Bitte versuchen Sie es erneut.");
            }
        };

        fetchToken();
    }, [router]);

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center bg-neutral-900 text-center p-4">
                <div className="w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Fehler!</h2>
                    <p className="text-neutral-300 mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.href = `${getBaseApiUrl()}/api/auth`}
                        variant="danger"
                        className="w-full"
                        icon={RefreshCcw}
                        content="Erneut Anmelden"
                    >
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-neutral-900 text-center p-4">
            <div className="w-full max-w-md bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-600">
                <h2 className="text-3xl font-bold text-neutral-100 mb-4">Authentifizierung wird verarbeitet...</h2>
                <Spinner className="h-12 w-12 text-neutral-500 mx-auto mb-6" />
                <p className="text-neutral-300">Bitte warten Sie einen Moment...</p>
            </div>
        </div>
    );
};

export default DiscordCallback;
