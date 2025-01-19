/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
    Trash2,
    Shield,
    Lock,
    Download,
    Upload,
    Moon,
    Sun,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DeleteAccountDialog } from "@/components/Dialogs/DeleteAccountDialog";
import { DataImporter } from "@/components/Dialogs/ImportDataDialog";
import { DataExporter } from "@/components/Dialogs/ExportDataDialog";
import { useHomePageLogic } from "@/hooks/useHomePage";
import { deleteUserById, disableTwoFactorAuth, enableTwoFactorAuth, fetchPasswords, fetchUserById, getUserIdFromToken, verifyTwoFactorCode } from "@/lib/api";
import { User } from "@/types";
import { TimeStamp } from "@/components/ui/Timestamp";
import { TwoFactorDialog } from "@/components/Dialogs/TwoFactorDialog";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

const SettingsPage = () => {
    const { setPasswords, passwords } =
        useHomePageLogic();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
    const { darkMode, toggleDarkMode } = useTheme();
    const [isImportDialogOpen, setIsImportDialogOpen] = useState<boolean>(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const id = getUserIdFromToken();
                const userData = await fetchUserById(id || "");
                if (userData) {
                    if (userData.twoFactorSecret) {
                        setTwoFASecret(userData.twoFactorSecret);
                    }
                    setUser(userData);
                } else {
                    setError("Failed to load user data.");
                }
            } catch (err) {
                setError("An error occurred while fetching user data.");
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleEnable2FA = async () => {
        const result = await enableTwoFactorAuth();

        if (result) {
            setTwoFASecret(result.otpauthUrl);
            setUser((prevUser) => {
                if (prevUser) {
                    return {
                        ...prevUser,
                        twoFactorEnabled: true,
                    };
                }
                return prevUser;
            });
            setIs2FADialogOpen(true);
        } else {
            setError("Failed to enable 2FA. Please try again later.");
        }
    };

    const handleDisable2FA = async () => {
        const result = await disableTwoFactorAuth();

        if (result) {
            setTwoFASecret(null);
            setUser((prevUser) => {
                if (prevUser) {
                    return {
                        ...prevUser,
                        twoFactorEnabled: false,
                    };
                }
                return prevUser;
            });
            toast.success("2FA disabled successfully.");
        } else {
            setError("Failed to disable 2FA. Please try again later.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!user?.id) {
            setError("User ID is missing. Unable to delete account.");
            return;
        }

        try {
            const result = await deleteUserById(user.id);
            if (result) {
                setUser(null);
                window.location.href = "/logout";
            } else {
                setError("Failed to delete your account. Please try again later.");
            }
        } catch (err) {
            console.error("Error deleting account:", err);
            setError("An error occurred while deleting your account.");
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const handleImportSuccess = () => {
        setLoading(true);
        setError(null);

        fetchPasswords()
            .then((fetchedPasswords) => {
                setPasswords(fetchedPasswords);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    if (loading) {
        return (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
                Loading account settings...
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
        <div className="dark:bg-neutral-900 not-dark:bg-neutral-100 transition-all duration-200">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-neutral-800 mb-8 dark:text-neutral-100">
                    Settings
                </h1>

                <div className="space-y-6">
                    <div className="bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl border border-neutral-300 dark:border-neutral-800/50 p-6">
                        <h2 className="text-lg font-semibold text-neutral-800 mb-4 dark:text-neutral-100">
                            Account
                        </h2>
                        <div className="flex items-center gap-4 mb-6">
                            <UserAvatar username={user?.username || ""} id={user?.id || ""} avatar={user?.avatar} />
                            <div>
                                <div className="font-medium dark:text-neutral-100">
                                    @{user?.username || "Unknown User"}
                                </div>
                                <TimeStamp extended text="joined" timestamp={user?.createdAt || ""} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                content="Delete Account"
                                icon={Trash2}
                                onClick={() => setIsDeleteDialogOpen(true)}
                                variant="danger"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl border border-neutral-300 dark:border-neutral-800/50 p-6">
                        <h2 className="text-lg font-semibold text-neutral-800 mb-4 dark:text-neutral-100">
                            Security
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium dark:text-neutral-100">
                                        Two-Factor Authentication
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Add an extra layer of security
                                    </div>
                                </div>
                                <Button
                                    icon={Shield}
                                    content={user?.twoFactorEnabled ? "Disable" : "Enable"}
                                    onClick={user?.twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium dark:text-neutral-100">
                                        Master Password
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Change your master password
                                    </div>
                                </div>
                                <Button
                                    onClick={() => toast('Changed Master Password')}
                                    icon={Lock}
                                    content="Change"
                                    variant="border"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl border border-neutral-300 dark:border-neutral-800/50 p-6">
                        <h2 className="text-lg font-semibold text-neutral-800 mb-4 dark:text-neutral-100">
                            Data Management
                        </h2>
                        <div className="space-y-4">
                            <Button
                                onClick={() => setIsExportDialogOpen(true)}
                                icon={Download}
                                content="Export Passwords"
                                className="w-full"
                            ></Button>
                            <Button
                                onClick={() => setIsImportDialogOpen(true)}
                                icon={Upload}
                                content="Import Passwords"
                                className="w-full"
                            ></Button>
                        </div>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl border border-neutral-300 dark:border-neutral-800/50 p-6">
                        <h2 className="text-lg font-semibold text-neutral-800 mb-4 dark:text-neutral-100">
                            Preferences
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium dark:text-neutral-100">Theme</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Toggle dark mode
                                    </div>
                                </div>
                                <Button
                                    variant="border"
                                    onClick={toggleDarkMode}
                                    icon={darkMode ? Sun : Moon}
                                    content={darkMode ? "Light Mode" : "Dark Mode"}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium dark:text-neutral-100">
                                        Notifications
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Enable password breach alerts
                                    </div>
                                </div>
                                <Button
                                    variant="border"
                                    icon={Bell}
                                    content={notifications ? "Disable" : "Enable"}
                                    onClick={() => setNotifications(!notifications)}
                                    disabled>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <TwoFactorDialog
                    isOpen={is2FADialogOpen}
                    secret={twoFASecret || ""}
                    onClose={() => setIs2FADialogOpen(false)}
                    onSubmit={async (code) => {
                        const result = await verifyTwoFactorCode(code);
                        if (result) {
                            const enableResult = await enableTwoFactorAuth();
                            if (enableResult) {
                                toast.success("2FA enabled successfully.");
                                setIs2FADialogOpen(false);
                            } else {
                                setError("Failed to enable 2FA. Please try again later.");
                            }
                        } else {
                            setError("Invalid 2FA code.");
                        }
                    }}
                />

                <DeleteAccountDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={handleDeleteAccount}
                    itemType="Account"
                />

                <DataExporter
                    passwords={passwords}
                    isOpen={isExportDialogOpen}
                    onClose={() => setIsExportDialogOpen(false)}
                />

                <DataImporter
                    isOpen={isImportDialogOpen}
                    onClose={() => setIsImportDialogOpen(false)}
                    onImportSuccess={handleImportSuccess}
                />
            </div>
        </div >
    );
};

export default SettingsPage;
