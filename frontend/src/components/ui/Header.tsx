import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export interface HeaderProps {
  setIsDialogOpen: (value: boolean) => void;
}

export const Header = ({
  setIsDialogOpen,
}: HeaderProps) => (
  <div className="flex items-center justify-between h-16 pl-6 pr-2 border-b border-neutral-300 dark:border-neutral-700">
    <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
      Eagle
      <span className="text-neutral-500 dark:text-neutral-100 hover:text-red-300 transition-all duration-300">
        PasswordVault
      </span>
    </span>
    <div className="flex gap-2">
      <Button
        onClick={() => setIsDialogOpen(true)}
        icon={Plus}
        content="Create"
      />
    </div>
  </div>
);
