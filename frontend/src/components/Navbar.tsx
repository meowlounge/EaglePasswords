"use client";

import React, { useEffect, useState, useRef } from "react";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";

/**
 * Navbar component that displays navigation links, user account details, and mobile menu toggle.
 * It supports user login/logout, displaying the user's avatar and username, and handles mobile-responsive design.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = () => {
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
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
    document.cookie =
      "eagletoken; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/30 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="p-2 rounded-lg text-neutral-100 text-lg">
              EaglePasswords
            </span>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-800 transition-all"
            >
              <Menu className="w-6 h-6 text-neutral-100" />
            </button>

            {user && (
              <div className="hidden md:block">
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-all"
                  >
                    <UserAvatar
                      size="sm"
                      avatar={user.avatar}
                      username={user.username}
                      id={user.id}
                    />
                    <span className="text-neutral-100 font-medium">
                      {user.username}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 overflow-hidden opacity-0 transition-opacity duration-300 ease-out"
                      style={{ opacity: isMenuOpen ? 1 : 0 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-400/20 transition-colors"
                      >
                        <LogOut size={20} className="mr-3" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-700">
            {user && (
              <div className="pb-4 px-4">
                <div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-400 mt-4 hover:bg-red-400/20 rounded-lg transition-colors"
                  >
                    <LogOut size={20} className="mr-3" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
