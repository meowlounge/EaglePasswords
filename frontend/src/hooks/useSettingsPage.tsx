import { useEffect, useState } from 'react';
import {
     deleteUserById,
     disableTwoFactorAuth,
     enableTwoFactorAuth,
     fetchPasswords,
     fetchUserById,
     getUserIdFromToken,
} from '@/lib/api';
import { User } from '@/types';
import { toast } from 'sonner';
import { useHomePageLogic } from './useHomePage';

export const useSettingsPage = () => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [twoFASecret, setTwoFASecret] = useState<string | null>(null);
     const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
          useState(false);
     const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
     const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
     const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
     const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
          useState(false);
     const { setPasswords } = useHomePageLogic();

     useEffect(() => {
          const loadUserData = async () => {
               try {
                    setLoading(true);
                    const id = getUserIdFromToken();
                    const userData = await fetchUserById(id || '');
                    if (userData) {
                         if (userData.twoFactorSecret) {
                              setTwoFASecret(userData.twoFactorSecret);
                         }
                         setUser(userData);
                    } else {
                         setError('Failed to load user data.');
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
               } catch (err) {
                    setError('An error occurred while fetching user data.');
               } finally {
                    setLoading(false);
               }
          };

          loadUserData();
     }, []);

     const handleEnable2FA = async () => {
          const result = await enableTwoFactorAuth();

          if (result) {
               setTwoFASecret(result.otpauthUrl);
               setUser((prevUser) => {
                    if (prevUser) {
                         return {
                              ...prevUser,
                              twoFactorEnabled: true,
                         };
                    }
                    return prevUser;
               });
               setIs2FADialogOpen(true);
          } else {
               setError('Failed to enable 2FA. Please try again later.');
          }
     };

     const handleDisable2FA = async () => {
          const result = await disableTwoFactorAuth();

          if (result) {
               setTwoFASecret(null);
               setUser((prevUser) => {
                    if (prevUser) {
                         return {
                              ...prevUser,
                              twoFactorEnabled: false,
                         };
                    }
                    return prevUser;
               });
               toast.success('2FA disabled successfully.');
          } else {
               setError('Failed to disable 2FA. Please try again later.');
          }
     };

     const handleDeleteAccount = async () => {
          if (!user?.id) {
               setError('User ID is missing. Unable to delete account.');
               return;
          }

          try {
               const result = await deleteUserById(user.id);
               if (result) {
                    setUser(null);
                    window.location.href = '/logout';
               } else {
                    setError(
                         'Failed to delete your account. Please try again later.'
                    );
               }
          } catch (err) {
               console.error('Error deleting account:', err);
               setError('An error occurred while deleting your account.');
          } finally {
               setIsDeleteAccountDialogOpen(false);
          }
     };

     const handleImportSuccess = () => {
          setLoading(true);
          setError(null);

          fetchPasswords()
               .then((fetchedPasswords) => {
                    setPasswords(fetchedPasswords);
               })
               .finally(() => {
                    setLoading(false);
               });
     };

     return {
          user,
          loading,
          error,
          setError,
          twoFASecret,
          isDeleteAccountDialogOpen,
          is2FADialogOpen,
          isImportDialogOpen,
          isExportDialogOpen,
          isChangePasswordDialogOpen,
          setIsDeleteAccountDialogOpen,
          setIs2FADialogOpen,
          setIsImportDialogOpen,
          setIsExportDialogOpen,
          setIsChangePasswordDialogOpen,
          handleEnable2FA,
          handleDisable2FA,
          handleDeleteAccount,
          handleImportSuccess,
     };
};
