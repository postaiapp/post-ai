import { useMutation } from '@tanstack/react-query';

import { connect, disconnect } from '@/processes/platforms';
import { userStore } from '@/stores';
import { errorToast, successToast } from '@/utils/toast';

interface ConnectPlatformParams {
	code: string;
	platformId: number;
}

const mappedErrors = {
	PLATFORM_ALREADY_CONNECTED: 'Você já possui uma conta conectada com essa plataforma.',
	PLATFORM_NOT_FOUND: 'Plataforma não encontrada.',
};

export function useCreatePlatformMutation(onSuccess?: () => void) {
	const { user, setUser } = userStore();

	return useMutation({
		mutationKey: ['platform-connect'],
		mutationFn: async ({ code, platformId }: ConnectPlatformParams) => {
			const response = await connect(code, platformId);

			return response.data;
		},
		retry: false,
		onSuccess: data => {
			if (user) {
				setUser({
					...user,
					user_platforms: [...(user?.user_platforms || []), data.data],
				});
			}

			successToast('Plataforma conectada com sucesso!');
			onSuccess?.();
		},
		onError: (error: { message: keyof typeof mappedErrors }) => {
			errorToast(mappedErrors[error.message] || 'Erro ao conectar plataforma. Tente novamente.');
		},
	});
}

export function useDisconnectPlatformMutation(onSuccess?: () => void) {
	const { user, setUser } = userStore();

	return useMutation({
		mutationKey: ['platform-disconnect'],
		mutationFn: async (userPlatformId: number) => {
			await disconnect(userPlatformId);

			return userPlatformId;
		},
		onSuccess: userPlatformId => {
			successToast('Plataforma desconectada com sucesso!');

			if (user) {
				setUser({
					...user,
					user_platforms: user.user_platforms?.filter(platform => platform.id !== userPlatformId),
				});
			}

			onSuccess?.();
		},
		onError: () => {
			errorToast('Erro ao desconectar plataforma. Tente novamente.');
		},
	});
}
