import { mappedErrors } from '@common/constants/error';
import { successInstagramAccountMessages } from '@common/constants/mutations';
import { ClientResponse } from '@common/interfaces/api';
import { InstagramAccountType, InstagramLogoutType } from '@common/interfaces/instagramAccount';
import { MutationInstagramAccountType } from '@common/interfaces/mutations';
import { instagramCreate, instagramLogin, instagramLogout } from '@processes/instagramAccount';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorToast, successToast } from '@utils/toast';

export const useInstagramMutation = (type: MutationInstagramAccountType, setModalOpen?: (value: boolean) => void) => {
	const queryClient = useQueryClient();

	const mutationFn = {
		create: instagramCreate,
		login: instagramLogin,
		logout: instagramLogout,
	}[type];

	return useMutation({
		mutationKey: ['instagram-accounts'],
		mutationFn: mutationFn as (body: InstagramAccountType | InstagramLogoutType) => Promise<ClientResponse>,
		onSuccess: () => {
			successToast(successInstagramAccountMessages[type]);

			if (type === 'login' || type === 'create') {
				setModalOpen?.(false);
			}

			queryClient.invalidateQueries({ queryKey: ['instagram-accounts'] });
		},
		onError: (error: Error) => {
			const errorMessage = error?.message || 'Algo de errado aconteceu, tente novamente.';
			errorToast(mappedErrors[errorMessage] || errorMessage);
		},
	});
};
