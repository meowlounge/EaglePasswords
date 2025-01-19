/**
 * Represents a user in the application.
 * 
 * This interface contains the essential details about a user, such as their unique ID, 
 * username, avatar, authentication information, and stored passwords.
 */
export interface User {
    /**
     * The unique identifier for the user, typically represented as a MongoDB ObjectId.
     * 
     * This is an optional field since it may not be required in some systems or during 
     * user creation. It's commonly used as the internal identifier for database records.
     * 
     * @example "60a4b47d8f1b2f8dbf7f232a"
     */
    _id?: string;

    /**
     * A custom user ID specific to the application, such as a username or another unique identifier.
     * 
     * This is the primary way to identify the user within the application.
     * 
     * @example "john_doe"
     */
    id: string;

    /**
     * The user's display name or username.
     * 
     * This is typically shown on the user interface and may be the same as the `id` but can 
     * also be a different name that the user prefers.
     * 
     * @example "john_doe"
     */
    username: string;

    /**
     * The hash representing the user's avatar image, often used in the form of a URL or an ID 
     * pointing to the image source.
     * 
     * @example "HWO3E34IUF3HOUWEH1F"
     */
    avatar: string;

    /**
     * The timestamp indicating when the user was created, formatted in ISO 8601.
     * 
     * This timestamp is typically used for tracking user account creation.
     * 
     * @example "2021-04-12T08:00:00.000Z"
     */
    createdAt: string;

    /**
     * Indicates whether the user has enabled Two-Factor Authentication (2FA).
     * 
     * This field is optional and is only set if 2FA is enabled for the user.
     * 
     * @example true
     */
    twoFactorEnabled?: boolean;

    /**
     * A unique secret used for generating One-Time Passwords (OTPs) as part of Two-Factor Authentication.
     * 
     * This field is optional and only populated if the user has enabled 2FA.
     * 
     * @example "JBSWY3DPEHPK3PXP"
     */
    twoFactorSecret?: string;

    /**
     * An array containing the user's stored passwords.
     * 
     * All password entries are encrypted to ensure security. This array holds password records, 
     * each containing information such as service title, username, and associated metadata. 
     * Only the user with the correct credentials can decrypt and access the data.
     * 
     * @type {Password[]}
     */
    passwords: Password[];

    /**
     * The user's master password used for securely authenticating and managing their password records.
     * 
     * This password should be kept secret and is required to access the stored passwords.
     * 
     * @type {string}
     */
    masterPassword: string;
}

/**
 * Represents a password entry stored in the password manager.
 * 
 * This interface defines the structure of a password record, including details such as 
 * the title (service name), associated username, encrypted password, and optional metadata 
 * such as the associated URL or additional notes.
 * 
 * @interface Password
 */
export interface Password {
    /**
     * The unique identifier for the password entry, typically a ULID.
     * 
     * This ID is used to uniquely identify each password entry within the system.
     * 
     * @example "60b2c478ce6f842f9b7a1b4c"
     */
    id: string;

    /**
     * A descriptive title for the password entry, such as the name of the service or website.
     * 
     * This helps the user recognize which password entry corresponds to which service.
     * 
     * @example "Gmail"
     */
    title: string;

    /**
     * The username associated with the password for the service.
     * 
     * This is the login or user identifier for the service, which the user enters alongside 
     * the password.
     * 
     * @example "john_doe@gmail.com"
     */
    username: string;

    /**
     * The encrypted password associated with the service or website.
     * 
     * This password is encrypted to maintain security and is only accessible after proper 
     * authentication and decryption.
     * 
     * @example "encrypted_password_string_here"
     */
    password: string;

    /**
     * An optional field for the URL of the associated service or website.
     * 
     * This can be used to store the service's website or a direct link to the login page.
     * 
     * @example "https://mail.google.com"
     */
    url?: string;

    /**
     * An optional field for additional notes regarding the password entry.
     * 
     * Notes can include helpful information about the service or instructions for the user.
     * 
     * @example "Enable two-factor authentication"
     */
    note?: string;

    /**
     * The timestamp when the password entry was created, formatted in ISO 8601.
     * 
     * This timestamp can be used to track the creation of the password entry.
     * 
     * @example "2021-04-12T08:00:00.000Z"
     */
    createdAt: string;

    /**
     * The timestamp when the password entry was last updated, formatted in ISO 8601.
     * 
     * This timestamp can be used to track when a password entry was modified.
     * 
     * @example "2021-06-15T10:20:30.000Z"
     */
    updatedAt: string;
}
