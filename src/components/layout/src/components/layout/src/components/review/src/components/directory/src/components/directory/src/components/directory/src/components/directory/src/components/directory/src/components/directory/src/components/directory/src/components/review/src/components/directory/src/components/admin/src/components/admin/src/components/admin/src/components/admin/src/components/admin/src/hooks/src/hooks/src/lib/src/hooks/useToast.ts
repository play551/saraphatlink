import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (msg: string) => hotToast.success(msg, { className: 'glass' }),
  error: (msg: string) => hotToast.error(msg, { className: 'glass' }),
  warning: (msg: string) => hotToast.error(msg, { className: 'glass' }), // ใช้ error style แต่เปลี่ยนไอคอน
  info: (msg: string) => hotToast(msg, { className: 'glass' }),
};
