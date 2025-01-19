// components/entry/UserAvatar.tsx
"use client";
import Image from "next/image";

/**
 * Props for the UserAvatar component.
 */
interface UserAvatarProps {
    /**
     * The avatar hash string retrieved from Discord.
     * If provided, the avatar will be displayed as an image.
     */
    avatar?: string;

    /**
     * The username associated with the avatar.
     * If no avatar is provided, the first letter of the username is displayed.
     */
    username: string;

    /**
     * The Discord user ID, used for constructing the avatar URL.
     */
    id: string;

    /**
     * The size of the avatar. Options include:
     * - `'xs'`: Extra Small (24x24 pixels)
     * - `'sm'`: Small (32x32 pixels)
     * - `'md'`: Medium (40x40 pixels) (default)
     * - `'lg'`: Large (48x48 pixels)
     * - `'username'`: Extra large (160x160 pixels)
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';

    /**
     * Additional custom CSS classes for the avatar container.
     */
    className?: string;

    /**
     * The quality of the avatar image, which controls the resolution.
     * Accepts a number between 16 and 512 (default: 512).
     */
    quality?: number;
}

/**
 * A component for displaying a Discord user's avatar.
 * If an avatar hash is provided, the corresponding image will be displayed.
 * Otherwise, the first letter of the username will be shown.
 *
 * @param avatar The avatar hash string retrieved from Discord.
 * @param id The Discord user ID, used to construct the avatar URL.
 * @param username The username associated with the avatar.
 * @param size The size of the avatar ('sm', 'md', 'lg', or 'username').
 * @param className Additional custom CSS classes for the avatar container.
 * @param quality The quality of the avatar image, ranging from 16 to 512 (default: 512).
 * @returns A styled avatar image or fallback text representation of the username.
 */
export const UserAvatar = ({ avatar, id, username, size = 'md', className = '', quality = 64 }: UserAvatarProps) => {
    const sizeClasses = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const sizeDimensions = {
        xs: { width: 24, height: 24 },
        sm: { width: 32, height: 32 },
        md: { width: 40, height: 40 },
        lg: { width: 48, height: 48 }
    };

    const avatarClassName = `${sizeClasses[size]} rounded-full overflow-hidden ${className}`;
    const clampedQuality = Math.max(16, Math.min(quality, 512));

    if (avatar) {
        return (
            <div className={avatarClassName}>
                <Image
                    src={`https://cdn.discordapp.com/avatars/${id}/${avatar}?size=${clampedQuality}`}
                    alt={`${username}'s avatar`}
                    className="w-full h-full object-fit"
                    width={sizeDimensions[size].width}
                    height={sizeDimensions[size].height}
                    priority
                    unoptimized
                />
            </div>
        );
    }

    return (
        <div className={avatarClassName + ' flex items-center justify-center'}>
            <span className="text-neutral-400">
                {username.charAt(0).toUpperCase()}
            </span>
        </div>
    );
};
