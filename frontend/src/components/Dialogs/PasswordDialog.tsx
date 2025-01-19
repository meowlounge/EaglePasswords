import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Book,
  UserCircle2Icon,
  LockKeyhole,
  Link2,
  Notebook,
} from "lucide-react";
import type { Password } from "@/types";

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newPassword: Partial<Omit<Password, "id" | "createdAt" | "updatedAt">>;
  setNewPassword: (
    newPassword: Partial<Omit<Password, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  selectedPassword?: Password | null;
}

export const PasswordDialog: React.FC<PasswordDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newPassword,
  setNewPassword,
  selectedPassword,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={selectedPassword ? "Edit Password" : "Add New Password"}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm text-neutral-400 mb-1"
          >
            Title
          </label>
          <Input
            id="title"
            type="text"
            className="w-full"
            placeholder="Google..."
            value={newPassword.title || ""}
            onChange={(e) =>
              setNewPassword({ ...newPassword, title: e.target.value })
            }
            icon={Book}
            required
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm text-neutral-400 mb-1"
          >
            Username
          </label>
          <Input
            id="username"
            type="text"
            className="w-full"
            placeholder="elonmusk..."
            value={newPassword.username || ""}
            onChange={(e) =>
              setNewPassword({ ...newPassword, username: e.target.value })
            }
            icon={UserCircle2Icon}
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-neutral-400 mb-1"
          >
            Password
          </label>
          <Input
            id="password"
            type="text"
            className="w-full"
            placeholder="secr3tP4ssw0rd..."
            value={newPassword.password || ""}
            onChange={(e) =>
              setNewPassword({ ...newPassword, password: e.target.value })
            }
            icon={LockKeyhole}
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm text-neutral-400 mb-1">
            URL (Optional)
          </label>
          <Input
            id="url"
            type="text"
            className="w-full"
            placeholder="youtube.com..."
            value={newPassword.url || ""}
            onChange={(e) =>
              setNewPassword({ ...newPassword, url: e.target.value })
            }
            icon={Link2}
          />
        </div>
        <div>
          <label htmlFor="note" className="block text-sm text-neutral-400 mb-1">
            Note (Optional)
          </label>
          <Input
            id="note"
            type="text"
            className="w-full"
            placeholder="Secret Message..."
            value={newPassword.note || ""}
            onChange={(e) =>
              setNewPassword({ ...newPassword, note: e.target.value })
            }
            icon={Notebook}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={!newPassword.password?.trim()}>
            {selectedPassword ? "Save Changes" : "Save Password"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
