"use client";

import React from "react";
import { Trash2, Shield, Lock, Download, Upload, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DeleteAccountDialog } from "@/components/Dialogs/DeleteAccountDialog";
import { DataImporter } from "@/components/Dialogs/ImportDataDialog";
import { DataExporter } from "@/components/Dialogs/ExportDataDialog";
import { useHomePageLogic } from "@/hooks/useHomePage";
import { TimeStamp } from "@/components/ui/Timestamp";
import { TwoFactorDialog } from "@/components/Dialogs/TwoFactorDialog";
import { ChangeMasterPasswordDialog } from "@/components/Dialogs/ChangeMasterPasswordDialog";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsPage } from "@/hooks/useSettingsPage";
import { enableTwoFactorAuth, verifyTwoFactorCode } from "@/lib/api";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";

const SettingsPage = () => {
    const { passwords } = useHomePageLogic();
    const {
        user,
        loading,
        twoFASecret,
        is2FADialogOpen,
        isImportDialogOpen,
        isExportDialogOpen,
        isChangePasswordDialogOpen,
        isDeleteAccountDialogOpen,
        setIsDeleteAccountDialogOpen,
        setIs2FADialogOpen,
        setIsImportDialogOpen,
        setIsExportDialogOpen,
        setIsChangePasswordDialogOpen,
        // handleEnable2FA,
        // handleDisable2FA,
        handleDeleteAccount,
        setError,
        handleImportSuccess
    } = useSettingsPage();

    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <div className="dark:bg-neutral-900 not-dark:bg-neutral-100 flex items-center justify-center min-h-screen">
            <div className="max-w-4xl mx-auto p-6 w-full mt-13">
                <div className="space-y-6">

                    {/* Account Settings Section */}
                    <div className="bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl border border-neutral-300 dark:border-neutral-800/50 p-6">
                        <h2 className="text-lg font-semibold text-neutral-800 mb-4 dark:text-neutral-100">
                            Account Settings
                        </h2>
                        {loading ? (
                            <div className="flex items-center justify-center space-x-4">
                                <Spinner size="w-12 h-12" color="text-green-600" strokeWidth={5} speed="2s" />
                                <div className="text-xl font-semibold text-neutral-600 dark:text-neutral-400">
                                    Loading account settings...
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 mb-6">
                                <UserAvatar username={user?.username || ""} id={user?.id || ""} avatar={user?.avatar} />
                                <div>
                                    <div className="font-medium dark:text-neutral-100">
                                        @{user?.username || "Unknown User"}
                                    </div>
                                    <TimeStamp extended text="joined" timestamp={user?.createdAt || ""} />
                                </div>
                            </div>
                        )}
                        <div>
                            <Button
                                content="Delete Account"
                                icon={Trash2}
                                onClick={() => setIsDeleteAccountDialogOpen(true)}
                                variant="danger"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Security Section */}
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
                                    // onClick={user?.twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                                    disabled
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
                                    onClick={() => setIsChangePasswordDialogOpen(true)}
                                    icon={Lock}
                                    content="Change"
                                    variant="border"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Management Section */}
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

                    {/* Preferences Section */}
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
                        </div>
                    </div>

                </div>

                {/* Modals */}
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
                    isOpen={isDeleteAccountDialogOpen}
                    onClose={() => setIsDeleteAccountDialogOpen(false)}
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

                <ChangeMasterPasswordDialog
                    isOpen={isChangePasswordDialogOpen}
                    onClose={() => setIsChangePasswordDialogOpen(false)}
                />
            </div>
        </div>
    );
};

export default SettingsPage;
