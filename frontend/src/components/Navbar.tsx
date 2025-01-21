"use client";

import React, { useEffect, useState, useRef } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Cog, Key, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

/**
 * Navbar component that displays navigation links, user account details, and mobile menu toggle.
 * It supports user login/logout, displaying the user's avatar and username, and handles mobile-responsive design.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const menuItems = [
    { icon: <Key className="w-5 h-5" />, label: "Passwords", path: "/passwords" },
    { icon: <Cog className="w-5 h-5" />, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 dark:bg-neutral-900 bg-neutral-100/50 backdrop-blur-xl border-b dark:border-neutral-800 border-neutral-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="p-2 rounded-lg dark:text-neutral-100 text-neutral-800 text-lg font-semibold">
              EaglePasswords (WIP)
            </span>
          </div>

          <div className="flex items-center space-x-4">

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-neutral-800 dark:text-neutral-100" />
            </button>

            {user && (
              <div className="hidden md:block">
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200"
                  >
                    <UserAvatar
                      size="sm"
                      avatar={user.avatar}
                      username={user.username}
                      id={user.id}
                    />
                    <span className="text-neutral-800 dark:text-neutral-100 font-medium">
                      {user.username}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-lg border dark:border-neutral-700 border-neutral-200 overflow-hidden">
                      <div className="py-2">
                        {menuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              router.push(item.path);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                          >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                          </button>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/20 transition-colors duration-200"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t dark:border-neutral-800 border-neutral-200">
            {user && (
              <div className="py-4 px-4 space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      router.push(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700/50 rounded-lg transition-colors duration-200"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/20 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;