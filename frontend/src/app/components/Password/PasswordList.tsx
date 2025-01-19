import { Password } from "@/app/types";
import { PasswordCard } from "./PasswordCard";

interface PasswordListProps {
    passwords: Password[];
    showPassword: { [key: string]: boolean };
    setShowPassword: (show: { [key: string]: boolean }) => void;
    showUsername: { [key: string]: boolean };
    setshowUsername: (show: { [key: string]: boolean }) => void;
    handleEdit: (password: Password) => void;
    handleDelete: (password: Password) => void;
}

export const PasswordList = ({
    passwords,
    showPassword,
    setShowPassword,
    showUsername,
    setshowUsername,
    handleEdit,
    handleDelete,
}: PasswordListProps) => (
    <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-2">
        {passwords.map((password: Password) => (
            <PasswordCard
                key={password.id}
                password={password}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showUsername={showUsername}
                setshowUsername={setshowUsername}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        ))}
    </div>
);
