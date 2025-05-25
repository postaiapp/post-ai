import { PostFormData } from '@common/interfaces/post';
import { createPost } from '@processes/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePost() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['createPost'],
		mutationFn: async (data: PostFormData) => {
			const response = await createPost(data);
			return response.data;
		},
		onSuccess: (newPost) => {
			queryClient.setQueryData(['post', newPost.id], newPost);
			queryClient.invalidateQueries({ queryKey: ['history'] });
		},
	});

	return {
		createPost: mutation.mutateAsync,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
	};
}
