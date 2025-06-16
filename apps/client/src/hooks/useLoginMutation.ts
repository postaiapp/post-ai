import { AuthLoginType } from '@common/interfaces/auth';
import { login } from '@processes/auth';
import { userStore } from '@stores/index';
import { useMutation } from '@tanstack/react-query';
import { localStorageSet } from '@utils/storage';
import { errorToast, successToast } from '@utils/toast';
import { useRouter } from 'next/navigation';

export function useLoginMutation(router: ReturnType<typeof useRouter>) {
	const setUser = userStore((state) => state.setUser);

	return useMutation({
		mutationKey: ['login'],
		mutationFn: async (data: AuthLoginType) => {
			const response = await login(data);

			return response.data;
		},
		onSuccess: (data) => {
			const { user, token } = data.data;

			setUser(user);

			localStorageSet('token', token);

			setTimeout(() => {
				router.push('/chat');
				successToast('Login efetuado com sucesso!');
			}, 1000);
		},
		onError: () => {
			errorToast('Suas credenciais estão inválidas, tente novamente.');
		},
	});
}
