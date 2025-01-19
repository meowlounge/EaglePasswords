'use client'

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Key, X, Menu, LucideIcon, User, Cog } from 'lucide-react';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
    disabled: boolean;
    path: string;
}

export const Sidebar = () => {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const currentPath = pathname;
        const activeTab = tabs.find(tab => tab.path === currentPath)?.id || '';
        setActiveTab(activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const handleLogout = () => {
        document.cookie = 'eagletoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        setUser(null);
        window.location.href = '/passwords';
    };

    const tabs: Tab[] = [
        { id: 'passwords', label: 'Passwords', icon: Key, disabled: false, path: "/passwords" },
        { id: 'me', label: 'Account', icon: User, disabled: true, path: "/me" },
    ];


    const handleTabClick = (tab: Tab) => {
        if (!tab.disabled) {
            setActiveTab(tab.id);
            router.push(tab.path);
        }
    };

    const settings = () => {
        router.push("/settings")
    }

    return (
        <>
            <Button icon={Menu} content='Open' onClick={() => setIsMobileOpen(true)} className="fixed top-4 left-4 md:hidden z-50" />

            {isMobileOpen && (
                <div className="fixed inset-0 bg-neutral-100/60 dark:bg-neutral-950/60 backdrop-blur-xs md:hidden z-40 transition-opacity" onClick={() => setIsMobileOpen(false)} />
            )}

            <aside className="fixed top-0 bottom-0 left-0 z-50 w-72 hidden md:flex flex-col bg-neutral-100/75 dark:bg-neutral-900 backdrop-blur-xl border-r border-neutral-300 dark:border-neutral-700 transition-all duration-300 ease-out">
                <div className="flex items-center h-16 px-6 border-b border-neutral-300 dark:border-neutral-700">
                    <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">Eagle<Link href={"https://prodbyeagle.vercel.app/"} className="text-neutral-500 hover:text-fuchsia-500 dark:hover:text-purple-600 transition-colors duration-300 dark:text-neutral-400">Passwords</Link></span>
                </div>

                {user && (
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-300 dark:border-neutral-700">
                        <UserAvatar quality={32} size="xs" avatar={user.avatar} username={user.username} id={user.id} />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">@{user.username}</p>
                        </div>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <li key={tab.id}>
                                    <button onClick={() => handleTabClick(tab)} disabled={tab.disabled} className={`w-full flex items-center rounded-lg px-3 py-2.5 gap-3 select-none active:scale-95 active:bg-neutral-500/20 transition-all duration-200 ${isActive ? 'bg-neutral-200/70 dark:bg-neutral-500/10 text-neutral-500 dark:text-neutral-300' : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-300/70 dark:hover:bg-neutral-700/70'} ${tab.disabled ? 'opacity-50 cursor-default' : ''}`}>
                                        <tab.icon size={20} className={isActive ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500'} />
                                        <span className="text-sm font-medium truncate">
                                            {tab.label}
                                            {tab.disabled && (
                                                <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">(Coming Soon)</span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="border-t border-neutral-300 dark:border-neutral-700 p-3">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleLogout}
                            icon={LogOut}
                            variant="danger"
                            content="Logout"
                            className="flex-2/3"
                        />
                        <Button
                            onClick={() => settings()}
                            icon={Cog}
                            className="flex-1/7"
                            variant='border'
                        />
                    </div>
                </div>
            </aside>

            <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] md:hidden bg-neutral-100/75 dark:bg-neutral-900 backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-300 dark:border-neutral-700">
                    <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">Eagle<Link href={"https://prodbyeagle.vercel.app/"} className="text-neutral-500 hover:text-purple-300 transition-colors duration-300 dark:text-neutral-400 dark:hover:text-purple-300">Passwords</Link></span>
                    <Button size='sm' variant='ghost' icon={X} onClick={() => setIsMobileOpen(false)} />
                </div>

                {user && (
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-300 dark:border-neutral-700">
                        <UserAvatar size="xs" avatar={user.avatar} username={user.username} id={user.id} />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">@{user.username}</p>
                        </div>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <li key={tab.id}>
                                    <button onClick={() => handleTabClick(tab)} disabled={tab.disabled} className={`w-full flex items-center rounded-lg px-3 py-2.5 gap-3 select-none active:scale-95 active:bg-neutral-500/20 transition-all duration-200 ${isActive ? 'bg-neutral-200/70 dark:bg-neutral-500/10 text-neutral-500 dark:text-neutral-300' : 'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-300/70 dark:hover:bg-neutral-700/70'} ${tab.disabled ? 'opacity-50 cursor-default' : ''}`}>
                                        <tab.icon size={20} className={isActive ? 'text-neutral-700 dark:text-neutral-200' : 'text-neutral-400 dark:text-neutral-500'} />
                                        <span className="text-sm font-medium truncate">
                                            {tab.label}
                                            {tab.disabled && (
                                                <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">(Coming Soon)</span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="border-t border-color-border p-2">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleLogout}
                            icon={LogOut}
                            variant="danger"
                            content="Logout"
                            className="flex-1"
                        />
                        <Button
                            onClick={() => settings()}
                            icon={Cog}
                            content="Settings"
                            className="flex-1"
                        />
                    </div>
                </div>

            </aside>
        </>
    );
};
