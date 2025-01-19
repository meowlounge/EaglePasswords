"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { getBaseApiUrl } from "@/lib/api";

const LogoutPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const loginUrl = `${getBaseApiUrl()}/api/auth`;

    useEffect(() => {
        const logout = async () => {
            try {
                document.cookie =
                    "eagletoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

                setLoading(false);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError("An error occurred while logging out.");
                setLoading(false);
            }
        };

        logout();
    }, [router]);

    if (loading) {
        return (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
                Logging out...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-neutral-800 mb-8 dark:text-neutral-100">
                You have been logged out.
            </h1>
            <div className="bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl border border-neutral-300 dark:border-neutral-800/50 p-6 text-center">
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    You have successfully logged out. We hope to see you again soon!
                </p>
                <Button
                    content="Go to Login Page"
                    onClick={() => router.push(loginUrl)}
                    className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                />
            </div>
        </div>
    );
};

export default LogoutPage;
