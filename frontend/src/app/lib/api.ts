import { Password, User, TwoFactor } from "../types";

/**
 * Retrieves the authentication token from cookies.
 * This token is used for authenticating API requests.
 * 
 * @returns {string | null} The authentication token or null if not found.
 */
export const getAuthToken = (): string | null => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("eagletoken="))?.split("=")[1] || null;
    return token;
};

/**
 * Extracts the user ID from the authentication token.
 * 
 * @returns {string | null} - The user ID if found, otherwise null.
 */
const getUserIdFromToken = (): string | null => {
    try {
        const token = getAuthToken();
        if (!token) {
            console.error("No token found");
            return null;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
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
const apiRequest = async <T>(url: string, options: RequestInit): Promise<T | null> => {
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
 * Fetches all passwords from the API.
 * 
 * @returns {Promise<Password[]>} A list of passwords or an empty array if the request fails.
 */
export const fetchPasswords = async (): Promise<Password[]> => {
    const token = getAuthToken();
    if (!token) return [];
    const userId = getUserIdFromToken();
    const data = await apiRequest<Password[]>(`/api/passwords/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return data || [];
};

/**
 * Adds a new password to the API.
 * 
 * @param {Omit<Password, "id">} password - The password details to add.
 * @returns {Promise<string | null>} The ID of the created password or null if the request fails.
 */
export const addPassword = async (password: Omit<Password, "id">): Promise<string | null> => {
    const token = getAuthToken();
    if (!token) return null;
    const userId = getUserIdFromToken();
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
export const updatePassword = async (id: string, updates: Partial<Password>): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;
    const userId = getUserIdFromToken();
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
    if (!token) return false;
    const userId = getUserIdFromToken();
    const response = await apiRequest(`/api/passwords/${userId}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    return response !== null;
};

/**
 * Fetches all two-factor authentication entries for the current user.
 * 
 * @returns {Promise<TwoFactor[]>} A list of 2FA entries or an empty array if the request fails.
 */
export const fetchTwoFactorAuthData = async (): Promise<TwoFactor[]> => {
    const token = getAuthToken();
    if (!token) return [];
    const username = getUserIdFromToken();
    const data = await apiRequest<TwoFactor[]>(`/api/two-factor/${username}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return data || [];
};

/**
 * Adds a new two-factor authentication entry for the current user.
 * 
 * @param {Omit<TwoFactor, "id" | "createdAt" | "updatedAt">} twoFactorData - The 2FA details to add.
 * @returns {Promise<string | null>} The ID of the created 2FA entry or null if the request fails.
 */
export const addTwoFactorAuthData = async (
    twoFactorData: Omit<TwoFactor, "id" | "createdAt" | "updatedAt">
): Promise<string | null> => {
    const token = getAuthToken();
    if (!token) return null;
    const username = getUserIdFromToken();
    const data = await apiRequest<{ id: string }>(`/api/two-factor/${username}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(twoFactorData),
    });
    return data?.id || null;
};

/**
 * Updates an existing two-factor authentication entry for the current user.
 * 
 * @param {string} id - The ID of the 2FA entry to update.
 * @param {Partial<Omit<TwoFactor, "id" | "createdAt">>} updates - The updated 2FA details.
 * @returns {Promise<boolean>} True if the update was successful, otherwise false.
 */
export const updateTwoFactorAuthData = async (
    id: string,
    updates: Partial<Omit<TwoFactor, "id" | "createdAt">>
): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;
    const username = getUserIdFromToken();
    const response = await apiRequest(`/api/two-factor/${username}/${id}`, {
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
 * Deletes a two-factor authentication entry for the current user.
 * 
 * @param {string} id - The ID of the 2FA entry to delete.
 * @returns {Promise<boolean>} True if the deletion was successful, otherwise false.
 */
export const deleteTwoFactorAuthData = async (id: string): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) return false;
    const username = getUserIdFromToken();
    const response = await apiRequest(`/api/two-factor/${username}/${id}`, {
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
export const fetchUserById = async (id: string): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    const data = await apiRequest<User>(`/api/user/i/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return data || null;
};

/**
 * Fetches a user by their username from the API.
 * 
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<User | null>} The user object or null if the request fails.
 */
export const fetchUserByUsername = async (username: string): Promise<User | null> => {
    const token = getAuthToken();
    if (!token) return null;
    const data = await apiRequest<User>(`/api/user/u/${username}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });
    return data || null;
};

/**
 * Logs in with Discord via the API.
 * Redirects to the Discord authentication page.
 */
export const loginWithDiscord = (): void => {
    window.location.href = `${getBaseApiUrl()}/api/auth`;
};
