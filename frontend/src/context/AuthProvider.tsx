'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserById, getAuthToken } from '@/lib/api';
import { User } from '@/types';

/**
 * The context props for the AuthContext.
 *
 * @interface AuthContextProps
 * @property {User | null} user - The current authenticated user or null if no user is logged in.
 * @property {Function} setUser - Function to update the authenticated user.
 */
interface AuthContextProps {
     user: User | null;
     setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * A provider component that manages the authentication state and makes it available to child components.
 *
 * @component AuthProvider
 * @param {React.ReactNode} children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The AuthProvider component that wraps the children and provides authentication state.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
     children,
}) => {
     const [user, setUser] = useState<User | null>(null);

     useEffect(() => {
          const fetchData = async () => {
               const token = getAuthToken();
               if (token) {
                    const decoded = JSON.parse(
                         atob(token.split('.')[1])
                    ) as User;
                    const userData = await fetchUserById(decoded.id);
                    setUser(userData);
               }
          };
          fetchData();
     }, []);

     return (
          <AuthContext.Provider value={{ user, setUser }}>
               {children}
          </AuthContext.Provider>
     );
};

/**
 * Custom hook to access the authentication context.
 *
 * @returns {AuthContextProps} The current authentication context, including the user and setUser function.
 * @throws {Error} Throws an error if the hook is used outside of the AuthProvider context.
 */
export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
};
