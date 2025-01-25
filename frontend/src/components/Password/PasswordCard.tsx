  import React from "react";
  import {
    Eye,
    EyeOff,
    Pencil,
    Trash2,
    ExternalLink,
    Copy,
    CheckCircle,
    Edit,
  } from "lucide-react";
  import { Password } from "@/types";
  import { PasswordStrengthBar, gradientVariants } from "./PasswordStrengthBar";
  import { TimeStamp } from "@/components/ui/Timestamp";

  export const getPasswordStrength = (
    password: string,
  ): {
    label: string;
    variant: "danger" | "warning" | "success" | "info";
    percentage: number;
  } => {
    let score = 0;
    if (password.length >= 12) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score >= 100)
      return { label: "Strong", variant: "success", percentage: 100 };
    if (score >= 75) return { label: "Good", variant: "info", percentage: 75 };
    if (score >= 50) return { label: "Fair", variant: "warning", percentage: 50 };
    return { label: "Weak", variant: "danger", percentage: 25 };
  };

  interface PasswordCardProps {
    password: Password;
    showPassword: Record<string, boolean>;
    setShowPassword: (show: Record<string, boolean>) => void;
    showUsername: Record<string, boolean>;
    setshowUsername: (show: Record<string, boolean>) => void;
    handleEdit: (password: Password) => void;
    handleDelete: (password: Password) => void;
  }

  export const PasswordCard = ({
    password,
    showPassword,
    setShowPassword,
    showUsername,
    setshowUsername,
    handleEdit,
    handleDelete,
  }: PasswordCardProps) => {
    const [copied, setCopied] = React.useState<string | null>(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const strengthInfo = getPasswordStrength(password.password);

    const copyToClipboard = async (field: "username" | "password") => {
      await navigator.clipboard.writeText(password[field]);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    };

    return (
      <div
        className="relative bg-neutral-100 dark:bg-neutral-950/50 backdrop-blur-xl rounded-xl hover:rounded-2xl border border-neutral-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:border-neutral-800/50 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <PasswordStrengthBar
          percentage={strengthInfo.percentage}
          variant={strengthInfo.variant}
        />

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="font-semibold text-neutral-800 truncate dark:text-neutral-100">
                {password.title}
              </h2>
              {password.note && (
                <div className="text-sm text-neutral-600 pr-1 italic truncate dark:text-neutral-400">
                  {password.note}
                </div>
              )}
              {password.url && (
                <a
                  href={`https://${password.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-neutral-500 hover:text-blue-500 transition-colors dark:text-neutral-500 dark:hover:text-blue-400"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>

            <div
              className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <button
                onClick={() => handleEdit(password)}
                className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-md transition-all dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(password)}
                className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all dark:text-neutral-400 dark:hover:text-red-400 dark:hover:bg-red-400/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 bg-neutral-200 rounded-md group dark:bg-neutral-800/70">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-neutral-600 mb-1 dark:text-neutral-400">
                  Username
                </div>
                <div className="font-mono text-sm text-neutral-700 truncate dark:text-neutral-100">
                  {showUsername[password.id] ? password.username : "•".repeat(8)}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() =>
                    setshowUsername({
                      ...showUsername,
                      [password.id]: !showUsername[password.id],
                    })
                  }
                  className="p-1.5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 rounded-xs transition-all dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/50"
                >
                  {showUsername[password.id] ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard("username")}
                  className="p-1.5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 rounded-xs transition-all dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/50"
                >
                  {copied === "username" ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 px-3 bg-neutral-200 rounded-md group dark:bg-neutral-800/70">
              <div className="min-w-0 flex-1">
                <div className="text-xs text-neutral-600 mb-1 dark:text-neutral-400">
                  Password
                </div>
                <div className="font-mono text-sm text-neutral-700 truncate dark:text-neutral-100">
                  {showPassword[password.id] ? password.password : "•".repeat(12)}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      [password.id]: !showPassword[password.id],
                    })
                  }
                  className="p-1.5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 rounded-xs transition-all dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/50"
                >
                  {showPassword[password.id] ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard("password")}
                  className="p-1.5 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-300 rounded-xs transition-all dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/50"
                >
                  {copied === "password" ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-lg text-neutral-100 ${gradientVariants[strengthInfo.variant]}`}
              >
                {strengthInfo.label}
              </span>
              •
              <TimeStamp
                timestamp={password.createdAt || ""}
                live
                showIcon={false}
                icon={Edit}
                extended
                text="created"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
