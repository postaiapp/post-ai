import { PostFormData } from '@common/interfaces/post';
import { createPost } from '@processes/post';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { errorToast, successToast } from '@/utils/toast';

const errorMessages = {
	INVALID_POST_DATE: 'A data do post não pode ser anterior à data atual.',
};

export function useCreatePost() {
	const router = useRouter();

	return useMutation({
		mutationKey: ['create-post'],
		mutationFn: async (data: PostFormData) => {
			const response = await createPost(data);
			return response.data;
		},
		onSuccess: () => {
			successToast('Post criado com sucesso.');

			router.push('/history');
		},
		onError: (error: Error) => {
			errorToast(
				errorMessages[error.message as keyof typeof errorMessages] ||
					'Algo de errado aconteceu ao criar o post. Tente novamente.'
			);
		},
	});
}
