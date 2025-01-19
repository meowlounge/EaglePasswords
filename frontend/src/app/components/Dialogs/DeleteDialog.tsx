import { Dialog } from "@/app/components/ui/Dialog";
import { Button } from "@/app/components/ui/Button";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    itemType?: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType = "item",
}) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={`Delete ${itemType}: ${itemName}?`}>
            <div className="space-y-6">
                <p>
                    Are you sure you want to delete{" "}
                    <strong>{itemName}</strong>? This
                    action <span className="text-red-400 italic font-semibold">cannot be undone</span>.
                </p>
                <Button
                    onClick={onConfirm}
                    icon={Trash2}
                    content="Delete"
                    variant="danger"
                    className="w-full"
                >
                </Button>
            </div>
        </Dialog>
    );
};
