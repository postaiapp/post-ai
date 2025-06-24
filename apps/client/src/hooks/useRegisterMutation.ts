import { AuthRegisterType } from '@common/interfaces/auth';
import { register as registerUser } from '@processes/auth';
import { useMutation } from '@tanstack/react-query';
import { errorToast, successToast } from '@utils/toast';

export function useRegisterMutation(onSuccess?: () => void) {
    return useMutation({
        mutationKey: ['register'],
        mutationFn: async (data: AuthRegisterType) => {
            const response = await registerUser(data);

            return response.data;
        },
        onSuccess: () => {
            successToast('Cadastro efetuado com sucesso! Por favor, faça login.');
            onSuccess?.();
        },
        onError: (error: Error) => {
            console.log(error, 'error')
            errorToast('Algo de errado aconteceu, tente novamente.');
        }
    });
}
