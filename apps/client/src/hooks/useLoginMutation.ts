import { AuthLoginWithPlanType, AuthResponse } from '@common/interfaces/auth';
import { User } from '@common/interfaces/user';
import { login } from '@processes/auth';
import { userStore } from '@stores/index';
import { useMutation } from '@tanstack/react-query';
import { localStorageSet } from '@utils/storage';
import { errorToast, successToast } from '@utils/toast';
import { useRouter } from 'next/navigation';

export function useLoginMutation(router: ReturnType<typeof useRouter>) {
	const setUser = userStore(state => state.setUser);

	return useMutation({
		mutationKey: ['login'],
		mutationFn: async (data: AuthLoginWithPlanType) => {
			console.log(data, 'data');
			const response = await login(data);

			return response.data;
		},
		onSuccess: (data: AuthResponse) => {
			const { user, token, hasActiveSubscription, checkoutUrl } = data;

			setUser(user as unknown as User);

			if (!hasActiveSubscription && checkoutUrl) {
				successToast('Redirecionando para pagamento...');

				setTimeout(() => {
					window.location.href = checkoutUrl;
				}, 1000);
				return;
			}

			if (hasActiveSubscription && token) {
				localStorageSet('token', token);
				setTimeout(() => {
					router.push('/home');
					successToast('Login efetuado com sucesso!');
				}, 1000);
			}
		},
		onError: () => {
			errorToast('Suas credenciais estão inválidas, tente novamente.');
		},
	});
}
