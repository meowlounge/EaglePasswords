/**
 * Represents a user in the application.
 */
export interface User {
	/**
	 * Unique database identifier (e.g., MongoDB ObjectId).
	 * @example "60a4b47d8f1b2f8dbf7f232a"
	 */
	_id?: string;

	/**
	 * Application-specific unique ID. (e.g., Discord UserID).
	 * @example "1234567890"
	 */
	id: string;

	/**
	 * Display name of the user.
	 * @example "john_doe"
	 */
	username: string;

	/**
	 * User's avatar hash.
	 * @example "HWO3E34IUF3HOUWEH1F"
	 */
	avatar: string;

	/**
	 * Account creation timestamp (ISO 8601).
	 * @example "2021-04-12T08:00:00.000Z"
	 */
	createdAt: string;

	/**
	 * Indicates if 2FA is enabled.
	 * @example true
	 */
	twoFactorEnabled?: boolean;

	/**
	 * Secret for generating 2FA OTPs.
	 * @example "JBSWY3DPEHPK3PXP"
	 */
	twoFactorSecret?: string;

	/**
	 * Array of stored passwords.
	 */
	passwords: Password[];

	/**
	 * User's master password.
	 */
	masterPassword: string;
}

/**
 * Represents a password entry.
 */
export interface Password {
	/**
	 * Unique identifier for the entry.
	 * @example "60b2c478ce6f842f9b7a1b4c"
	 */
	id: string;

	/**
	 * Descriptive service name.
	 * @example "Gmail"
	 */
	title: string;

	/**
	 * Username for the service.
	 * @example "john_doe@gmail.com"
	 */
	username: string;

	/**
	 * Encrypted service password.
	 * @example "encrypted_password_string_here"
	 */
	password: string;

	/**
	 * Service URL.
	 * @example "https://mail.google.com"
	 */
	url?: string;

	/**
	 * Additional notes.
	 * @example "Enable two-factor authentication"
	 */
	note?: string;

	/**
	 * Entry creation timestamp (ISO 8601).
	 * @example "2021-04-12T08:00:00.000Z"
	 */
	createdAt: string;

	/**
	 * Entry update timestamp (ISO 8601).
	 * @example "2021-06-15T10:20:30.000Z"
	 */
	updatedAt: string;

	/**
	 * Indicates if entry is marked as favorite.
	 * @default false
	 */
	isFavorite: boolean;
}
