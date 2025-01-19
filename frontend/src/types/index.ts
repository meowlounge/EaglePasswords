/**
 * Represents a user in the application.
 *
 * @interface User
 */
export interface User {
  /**
   * The unique identifier for the user, typically a MongoDB ObjectId.
   * @example "60a4b47d8f1b2f8dbf7f232a"
   */
  _id: string;

  /**
   * A custom user ID for the application, often a username or a similar unique identifier.
   * @example "john_doe"
   */
  id: string;

  /**
   * The user's display name or username.
   * @example "john_doe"
   */
  username: string;

  /**
   * The hash to the user's avatar image.
   * @example "HWO3E34IUF3HOUWEH1F"
   */
  avatar: string;

  /**
   * The date and time when the user was created, in ISO 8601 format.
   * @example "2021-04-12T08:00:00.000Z"
   */
  createdAt: string;
}

/**
 * Represents a password entry stored in the password manager.
 *
 * @interface Password
 */
export interface Password {
  /**
   * The unique identifier for the password entry, typically a ULID.
   */
  id: string;

  /**
   * A descriptive title for the password entry (e.g., the service or website name).
   * @example "Gmail"
   */
  title: string;

  /**
   * The username associated with the password for the service.
   * @example "john_doe@gmail.com"
   */
  username: string;

  /**
   * The encrypted password for the service.
   * @example "encrypted_password_string_here"
   */
  password: string;

  /**
   * An optional field for the URL of the associated service or website.
   * @example "https://mail.google.com"
   */
  url?: string;

  /**
   * An optional field for additional notes about the password entry.
   * @example "Enable two-factor authentication"
   */
  note?: string;

  /**
   * The date and time when the password entry was created, in ISO 8601 format.
   * @example "2021-04-12T08:00:00.000Z"
   */
  createdAt: string;

  /**
   * The date and time when the password entry was last updated, in ISO 8601 format.
   * @example "2021-06-15T10:20:30.000Z"
   */
  updatedAt: string;

  /**
   * Strength of the Password (Client Side)
   */
  strength?: string;
}
