import { mappedErrors } from '@common/constants/error';
import { successInstagramAccountMessages } from '@common/constants/mutations';
import { ClientResponse } from '@common/interfaces/api';
import { InstagramAccountType, InstagramLogoutType } from '@common/interfaces/instagramAccount';
import { MutationInstagramAccountType } from '@common/interfaces/mutations';
import { User } from '@common/interfaces/user';
import { instagramCreate, instagramLogin, instagramLogout } from '@processes/instagramAccount';
import userStore from '@stores/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorToast, successToast } from '@utils/toast';

export const useInstagramMutation = (type: MutationInstagramAccountType, setModalOpen?: (value: boolean) => void) => {
	const { user, setUser } = userStore();
	const queryClient = useQueryClient();

	const mutationFn = {
		create: instagramCreate,
		login: instagramLogin,
		logout: instagramLogout,
	}[type];

	return useMutation({
		mutationKey: ['instagram-accounts', user?.email],
		mutationFn: mutationFn as (body: InstagramAccountType | InstagramLogoutType) => Promise<ClientResponse>,
		onSuccess: (data) => {
			const { data: successData } = data;

			if (type === 'login' || type === 'create') {
				setModalOpen?.(false);
			}

			queryClient.invalidateQueries({ queryKey: ['instagram-accounts', user?.email] });
			setUser({
				...user,
				InstagramAccounts: successData?.newUser?.InstagramAccounts ?? [],
			} as User);

			successToast(successInstagramAccountMessages[type]);
		},
		onError: (error: Error) => {
			const errorMessage = error?.message || 'Algo de errado aconteceu, tente novamente.';
			errorToast(mappedErrors[errorMessage] || errorMessage);
		},
	});
};
