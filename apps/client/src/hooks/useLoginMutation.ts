import { mappedErrors } from '@common/constants/error';
import { AuthLoginType } from '@common/interfaces/auth';
import { login } from '@processes/auth';
import { useMutation } from '@tanstack/react-query';
import { userStore } from '@stores/index';
import { errorToast, successToast } from '@utils/toast';

export function useLoginMutation() {
    const setUser = userStore((state) => state.setUser);

    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (data: AuthLoginType) => {
            const response = await login(data);

            if (response.error) {
                throw new Error(response.error.message);
            }

            return response.data;
        },
        onSuccess: (data) => {
            setUser(data.user);

            setTimeout(() => {
                successToast('Login efetuado com sucesso!');
            }, 1000);
        },
        onError: (error: Error) => {
            errorToast('Suas credenciais estão inválidas, tente novamente.');
        }
    });
}
