import { PostFormData } from '@common/interfaces/post';
import { createPost } from '@processes/post';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { errorToast, successToast } from '@/utils/toast';

export function useCreatePost() {
	const router = useRouter();

	return useMutation({
		mutationKey: ['create-post'],
		mutationFn: async (data: PostFormData) => {
			console.log(data, 'data')
			const response = await createPost(data);
			return response.data;
		},
		onSuccess: () => {
			successToast('Post criado com sucesso.');

			router.push('/history');
		},
		onError: () => {
			errorToast('Algo de errado aconteceu ao criar o post. Tente novamente.');
		},
	});
}
