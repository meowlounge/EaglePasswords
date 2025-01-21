import { Password, User } from "@/types";
import { createClient } from '@supabase/supabase-js';

export const connectDB = async () => {
  const supabaseUrl = "https://szzbigujyuvejetfffio.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_KEY is not defined in the environment variables.');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
};

connectDB();

/**
 * Retrieves the authentication token from cookies.
 * This token is used for authenticating API requests.
 *
 * @returns {string | null} The authentication token or null if not found.
 */
export const getAuthToken = (): string | null => {
  const token =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("eagletoken="))
      ?.split("=")[1] || null;
  return token;
};

/**
 * Extracts the user ID and username from the authentication token.
 * Validates if the provided `userId` or `username` matches the token's payload.
 *
 * @param {Partial<{ id: string; username: string }>} matchCriteria - Criteria to match against the token payload.
 * @returns {boolean} True if the token is valid and matches the criteria, otherwise false.
 */
export const isTokenPayloadValid = (
  matchCriteria: Partial<{ id: string; username: string }>,
): boolean => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error("No token found");
      return false;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const matchesId = matchCriteria.id ? payload.id === matchCriteria.id : true;
    const matchesUsername = matchCriteria.username
      ? payload.username === matchCriteria.username
      : true;

    if (!matchesId || !matchesUsername) {
      console.error(
        "Token validation failed.",
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token payload:", error);
    return false;
  }
};

/**
 * Extracts the user ID from the authentication token after validation.
 *
 * @param {string} userId - The expected user ID to validate against the token.
 * @returns {string | null} The user ID if valid and matching, otherwise null.
 */
export const getValidatedUserIdFromToken = (
  userId: string,
): string | null => {
  return isTokenPayloadValid({ id: userId }) ? userId : null;
};

/**
 * Extracts the user ID from the authentication token.
 * 
 * @param token - Optional token. If not provided, it will fall back to using getAuthToken().
 * @returns {string | null} - The user ID if found, otherwise null.
 */
export const getUserIdFromToken = (token?: string): string | null => {
  try {
    const authToken = token || getAuthToken();
    if (!authToken) {
      console.error("No token found");
      return null;
    }

    const payload = JSON.parse(atob(authToken.split(".")[1]));
    const userId = payload.id;
    if (!userId) {
      console.error("User ID not found in token payload");
      return null;
    }

    return userId;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};

/**
 * Determines the base URL for the API based on the environment (development or production).
 *
 * @returns {string} The base API URL.
 */
export const getBaseApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_DEVELOPMENT === "true"
    ? "http://localhost:3001"
    : "https://eaglepasswords-backend.vercel.app";
};

/**
 * A helper function to handle API requests efficiently.
 *
 * @param {string} url - The API endpoint URL.
 * @param {RequestInit} options - The request options.
 * @returns {Promise<T | null>} The response data if the request is successful, otherwise null.
 */
const apiRequest = async <T>(
  url: string,
  options: RequestInit,
): Promise<T | null> => {
  try {
    const response = await fetch(`${getBaseApiUrl()}${url}`, options);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
};

/**
 * Fetches all passwords from the API with a security check.
 *
 * @returns {Promise<Password[]>} A list of passwords or an empty array if the request fails.
 */
export const fetchPasswords = async (): Promise<Password[]> => {
  const token = getAuthToken();
  if (!token) return [];

  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return [];
  }

  const data = await apiRequest<Password[]>(`/api/passwords/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return data || [];
};

/**
 * Updates the master password for the current user.
 *
 * @param {string} currentPassword - The current master password (for verification).
 * @param {string} newPassword - The new master password to set.
 * @returns {Promise<{ success: boolean; message: string }>} Result of the update process.
 */
export const updateMasterPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const token = getAuthToken();
  const userId = getUserIdFromToken();

  if (!userId || !isTokenPayloadValid({ id: userId })) {
    return { success: false, message: "Invalid or expired token" };
  }

  const response = await apiRequest<{ success: boolean; message: string }>(
    `/api/user/i/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    }
  );

  return response || { success: false, message: "Failed to update master password" };
};


/**
 * Adds a new password to the API.
 *
 * @param {Omit<Password, "id">} password - The password details to add.
 * @returns {Promise<string | null>} The ID of the created password or null if the request fails.
 */
export const addPassword = async (
  password: Omit<Password, "id">,
): Promise<string | null> => {
  const token = getAuthToken();
  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return null;
  }

  const data = await apiRequest<{ id: string }>(`/api/passwords/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password),
  });
  return data?.id || null;
};

/**
 * Updates an existing password in the API.
 *
 * @param {string} id - The ID of the password to update.
 * @param {Partial<Password>} updates - The updated password details.
 * @returns {Promise<boolean>} True if the update was successful, otherwise false.
 */
export const updatePassword = async (
  id: string,
  updates: Partial<Password>,
): Promise<boolean> => {
  const token = getAuthToken();
  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return false;
  }
  const response = await apiRequest(`/api/passwords/${userId}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return response !== null;
};

/**
 * Deletes a password from the API.
 *
 * @param {string} id - The ID of the password to delete.
 * @returns {Promise<boolean>} True if the deletion was successful, otherwise false.
 */
export const deletePassword = async (id: string): Promise<boolean> => {
  const token = getAuthToken();
  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return false;
  }
  const response = await apiRequest(`/api/passwords/${userId}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response !== null;
};

/**
 * Fetches a user by their ID from the API.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<User | null>} The user object or null if the request fails.
 */
export const deleteUserById = async (id: string): Promise<User | null> => {
  const token = getAuthToken();
  if (!token || !isTokenPayloadValid({ id })) {
    console.error("Invalid token");
    return null;
  }
  const data = await apiRequest<User>(`/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(data)
  return data || null;
};


/**
 * Fetches a user by their ID from the API with validation.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<User | null>} The user object or null if the request fails.
 */
export const fetchUserById = async (id: string): Promise<User | null> => {
  const token = getAuthToken();
  if (!token || !isTokenPayloadValid({ id })) {
    console.error("Invalid token");
    return null;
  }

  const data = await apiRequest<User>(`/api/users/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return data || null;
};

/**
 * Fetches a user by their username from the API with validation.
 *
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<User | null>} The user object or null if the request fails.
 */
export const fetchUserByUsername = async (
  username: string,
): Promise<User | null> => {
  const token = getAuthToken();
  if (!token || !isTokenPayloadValid({ username })) {
    console.error("Invalid token");
    return null;
  }

  const data = await apiRequest<User>(`/api/users/u/${username}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return data || null;
};

/**
 * Enables 2FA for the current user.
 *
 * @returns {Promise<{ otpauthUrl: string } | null>} The OTP Auth URL to generate the QR code, or null if the request fails.
 */
export const enableTwoFactorAuth = async (): Promise<{ otpauthUrl: string } | null> => {
  const token = getAuthToken();
  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return null;
  }

  const data = await apiRequest<{ otpauthUrl: string }>(`/api/twofactor/enable/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data || null;
};

/**
 * Verifies the 2FA code entered by the user.
 *
 * @param {string} code - The 2FA code entered by the user.
 * @returns {Promise<boolean>} True if the code is valid, otherwise false.
 */
export const verifyTwoFactorCode = async (code: string, token?: string): Promise<boolean> => {
  const authToken = token || getAuthToken();
  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return false;
  }

  const data = await apiRequest<{ message: string }>(`/api/twofactor/verify/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return data !== null && data.message === "2FA code verified successfully";
};

/**
 * Disables 2FA for the current user.
 *
 * @returns {Promise<boolean>} True if 2FA was disabled successfully, otherwise false.
 */
export const disableTwoFactorAuth = async (): Promise<boolean> => {
  const token = getAuthToken();
  const userId = getUserIdFromToken();
  if (!userId || !isTokenPayloadValid({ id: userId })) {
    console.error("Invalid token");
    return false;
  }

  const data = await apiRequest<{ message: string }>(`/api/twofactor/disable/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return data !== null && data.message === "2FA disabled successfully";
};


/**
 * Logs in with Discord via the API.
 * Redirects to the Discord authentication page.
 */
export async function signInWithDiscord() {
  const supabase = await connectDB();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
  });

  if (error) {
    console.error('Error during Discord sign-in:', error.message);
    return null;
  }

  return data;
}