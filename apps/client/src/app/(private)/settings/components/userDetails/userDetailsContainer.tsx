'use client';


import { User } from '@common/interfaces/user';
import ProfileDetailsUi from './page';

export default function UserSettingsContainer({ user }: { user: User | null }) {

	// const { data, isPending } = useQuery({
    //     queryKey: ['user', user?._id],
    //     queryFn: async () => {
    //         const response = await fetch('/api/user');

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         return response.json();
    //     },
    // });


	return (
		<ProfileDetailsUi
		/>
	);
}
