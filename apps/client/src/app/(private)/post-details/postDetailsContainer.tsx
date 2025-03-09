'use client';
import { useEffect, useState } from 'react';
import type React from 'react';

import type { InstagramAccountStore } from '@common/interfaces/instagramAccount';
import type { PostFormData } from '@common/interfaces/post';
import { useCreatePost } from '@hooks/post';
import userStore from '@stores/userStore';
import { successToast, errorToast } from '@utils/toast';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import PostDetailsUI from './postDetailsUi';

export default function PostDetailsContainer() {
	const [showCalendar, setShowCalendar] = useState(false);
	const [loading, setLoading] = useState(true);
	const searchParams = useSearchParams();
	const image = decodeURIComponent(searchParams.get('image') || '');
	const user = userStore((state) => state.user);
	const [selectedAccount, setSelectedAccount] = useState(user?.InstagramAccounts[0]);
	const { createPost, isLoading, isError } = useCreatePost();

	const { control, handleSubmit, setValue, watch } = useForm<PostFormData>({
		defaultValues: {
			username: user?.InstagramAccounts[0]?.username || '',
			caption: '',
			img: image || '',
			post_date: null,
		},
	});

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string>('');

	const caption = watch('caption');

	useEffect(() => {
		if (user?.InstagramAccounts?.length && !selectedAccount) {
			const firstAccount = user.InstagramAccounts[0];
			setSelectedAccount(firstAccount);
			setValue('username', firstAccount.username);
			setLoading(false);
		}
	}, [user, selectedAccount, setValue]);

	const generateISODate = (date?: Date, time?: string) => {
		if (!date || !time) return null;

		const [hours, minutes] = time.split(':').map(Number);
		const isoDate = new Date(date);
		isoDate.setHours(hours, minutes, 0, 0);
		return isoDate.toISOString();
	};

	const handleDateChange = (date: Date | undefined) => {
		setSelectedDate(date);
		setValue('post_date', generateISODate(date, selectedTime));
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = e.target.value;
		setSelectedTime(time);
		setValue('post_date', generateISODate(selectedDate, time));
	};

	const handleAccountChange = (account: InstagramAccountStore) => {
		setSelectedAccount(account);
		setValue('username', account.username);
	};

	const handleCreatePost = async (data: PostFormData) => {
		const formattedData = {
			...data,
			post_date: data.post_date === '' ? null : data.post_date,
		};

		await createPost(formattedData);

		if (isError) {
			errorToast('Algo de errado aconteceu ao criar o post. Tente novamente.');
			return;
		}

		successToast('Post criado com sucesso.');
	};

	const toggleCalendar = () => setShowCalendar(!showCalendar);

	return (
		<PostDetailsUI
			control={control}
			handleSubmit={handleSubmit}
			onSubmit={handleCreatePost}
			showCalendar={showCalendar}
			toggleCalendar={toggleCalendar}
			selectedDate={selectedDate}
			handleDateChange={handleDateChange}
			selectedTime={selectedTime}
			handleTimeChange={handleTimeChange}
			loading={loading}
			loadingSubmit={isLoading}
			selectedAccount={selectedAccount}
			handleAccountChange={handleAccountChange}
			user={user}
			caption={caption}
			image={image}
		/>
	);
}
