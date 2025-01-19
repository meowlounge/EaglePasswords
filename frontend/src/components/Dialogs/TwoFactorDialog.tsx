'use client';

import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Book, Key } from "lucide-react";

interface TwoFactorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    code: { title: string; secret: string };
    setCode: (value: Partial<{ title: string; secret: string }>) => void;
    isEditing: boolean;
}

export const TwoFactorDialog: React.FC<TwoFactorDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    code,
    setCode,
    isEditing,
}) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit 2FA Code" : "Add 2FA Code"}
        >
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div>
                    <label htmlFor="title" className="block text-sm text-neutral-400 mb-1">
                        Title
                    </label>
                    <Input
                        id="title"
                        type="text"
                        className="w-full"
                        value={code.title || ""}
                        onChange={(e) => setCode({ title: e.target.value })}
                        icon={Book}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="secret" className="block text-sm text-neutral-400 mb-1">
                        Secret
                    </label>
                    <Input
                        id="secret"
                        type="text"
                        className="w-full"
                        value={code.secret || ""}
                        onChange={(e) => setCode({ secret: e.target.value })}
                        icon={Key}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="submit"
                        disabled={!code.secret?.trim()}
                    >
                        {isEditing ? "Save Changes" : "Add Code"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};
