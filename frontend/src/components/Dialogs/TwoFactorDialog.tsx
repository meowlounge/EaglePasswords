'use client';

import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Key } from 'lucide-react';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface TwoFactorDialogProps {
     isOpen: boolean;
     onClose: () => void;
     onSubmit: (otp: string) => void;
     secret: string;
}

export const TwoFactorDialog: React.FC<TwoFactorDialogProps> = ({
     isOpen,
     onClose,
     onSubmit,
     secret,
}) => {
     const [otp, setOtp] = useState<string>('');

     useEffect(() => {
          if (!isOpen) {
               setOtp('');
          }
     }, [isOpen]);

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          onSubmit(otp);
          onClose();
     };

     return (
          <Dialog isOpen={isOpen} onClose={onClose} title={'Enable 2FA'}>
               <div className='flex flex-col items-center space-y-6'>
                    <p className='text-neutral-600 text-center'>
                         Scan the QR code below with your 2FA app or enter the
                         OTP after scanning.
                    </p>
                    <QRCodeSVG
                         bgColor={'transparent'}
                         value={secret}
                         size={128}
                    />
                    <form className='space-y-4 w-full' onSubmit={handleSubmit}>
                         <div>
                              <label
                                   htmlFor='otp'
                                   className='block text-sm text-neutral-400 mb-1'
                              >
                                   Enter the OTP from your 2FA app
                              </label>
                              <Input
                                   id='otp'
                                   type='text'
                                   className='w-full'
                                   value={otp}
                                   onChange={(e) => setOtp(e.target.value)}
                                   icon={Key}
                                   required
                                   maxLength={6}
                                   placeholder='Enter OTP (6 digits)'
                              />
                         </div>
                         <div className='flex justify-end space-x-2 pt-4'>
                              <Button onClick={onClose}>Cancel</Button>
                              <Button
                                   type='submit'
                                   disabled={!otp.trim() || otp.length !== 6}
                              >
                                   Enable 2FA
                              </Button>
                         </div>
                    </form>
               </div>
          </Dialog>
     );
};
