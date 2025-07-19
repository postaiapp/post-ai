'use client';
import type React from 'react';
import { useState } from 'react';

import type { PostFormData } from '@common/interfaces/post';
import type { UserPlatform } from '@common/interfaces/user-platforms';
import { useCreatePost } from '@hooks/post';
import { generateCaption as generateCaptionProcess } from '@processes/chat';
import InstagramLogo from '@public/instagram-logo.png';
import TiktokLogo from '@public/tiktok-logo.png';
import userStore from '@stores/userStore';
import { warningToast } from '@utils/toast';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { PLATFORMS } from '@/common/constants/platforms';

import PostDetailsUI from './postDetailsUi';

export default function PostDetailsContainer() {
	const [showCalendar, setShowCalendar] = useState(false);
	const [loadingCaption, setLoadingCaption] = useState(false);
	const searchParams = useSearchParams();
	const image = decodeURIComponent(searchParams.get('image') || '');
	const chatId = searchParams.get('chatId') || '';
	const { user } = userStore();
	const [selectedAccount, setSelectedAccount] = useState<UserPlatform | undefined>(undefined);
	const { mutateAsync: createPost, isPending: isLoading } = useCreatePost();
	const { control, handleSubmit, setValue, watch } = useForm<PostFormData>({
		defaultValues: {
			caption: '',
			media_url: image || '',
			scheduled_at: null,
		},
	});

	const TODAY = dayjs().toDate();

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(TODAY);
	const [selectedTime, setSelectedTime] = useState<string>('');

	const caption = watch('caption');

	const generateISODate = (date?: Date, time?: string) => {
		if (!date || !time) return null;

		const [hours, minutes] = time.split(':').map(Number);
		const isoDate = new Date(date);
		isoDate.setHours(hours, minutes, 0, 0);
		return isoDate.toISOString();
	};

	const handleDateChange = (date: Date | undefined) => {
		setSelectedDate(date);
		setValue('scheduled_at', generateISODate(date, selectedTime));
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = e.target.value;
		setSelectedTime(time);
		setValue('scheduled_at', generateISODate(selectedDate, time));
	};

	const handleAccountChange = (account: UserPlatform) => {
		setSelectedAccount(account);
		setValue('user_platform_id', account.id);
	};

	const handleCreatePost = async (data: PostFormData) => {
		if (!data.caption) {
			warningToast('A legenda do post é obrigatória.');
			return;
		}

		const formattedData = {
			...data,
			scheduled_at: data.scheduled_at === '' ? null : data.scheduled_at,
		};

		await createPost(formattedData);
	};

	const toggleCalendar = () => setShowCalendar(!showCalendar);

	const generateCaption = async () => {
		setLoadingCaption(true);

		const data = await generateCaptionProcess({ chatId });

		setValue('caption', data.data.caption);

		setLoadingCaption(false);
	};

	const getPlatformLogo = (platform: UserPlatform) => {
		if (platform.platform_id === PLATFORMS.INSTAGRAM) {
			return InstagramLogo;
		}

		if (platform.platform_id === PLATFORMS.TIKTOK) {
			return TiktokLogo;
		}

		return InstagramLogo;
	};

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
			loadingSubmit={isLoading}
			selectedAccount={selectedAccount}
			handleAccountChange={handleAccountChange}
			user={user}
			caption={caption}
			image={image}
			generateCaption={generateCaption}
			loadingCaption={loadingCaption}
			getPlatformLogo={getPlatformLogo}
		/>
	);
}
