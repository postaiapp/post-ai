import { mappedErrors } from '@common/constants/error';
import { AuthRegisterType } from '@common/interfaces/auth';
import { register as registerUser } from '@processes/auth';
import { useMutation } from '@tanstack/react-query';
import { errorToast, successToast } from '@utils/toast';

export function useRegisterMutation(onSuccess?: () => void) {
    return useMutation({
        mutationKey: ['register'],
        mutationFn: async (data: AuthRegisterType) => {
            const response = await registerUser(data);

            if (response.error) {
                throw new Error(response.error.message);
            }

            return response.data;
        },
        onSuccess: () => {
            successToast('Cadastro efetuado com sucesso! Por favor, faça login.');
            onSuccess?.();
        },
        onError: (error: Error) => {
            errorToast('Algo de errado aconteceu, tente novamente.');
        }
    });
}
