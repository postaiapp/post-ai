import { toast } from 'react-toastify';

const errorToast = (message: string) => {
    toast.error(message, { type: 'error' });
};

const successToast = (message: string) => {
    toast.success(message, { type: 'success' });
};

const warningToast = (message: string) => {
    toast.warning(message, { type: 'warning' });
};

export { errorToast, successToast, warningToast };
