import { useCallback } from 'react';

import { mappedErrors } from '@common/constants/error';
import { InstagramAccountType } from '@common/interfaces/instagramAccount';
import { InstagramAccountSchema } from '@common/schemas/instagramAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstagramAccountStore } from '@stores/instagramAccount';
import { errorToast } from '@utils/toast';
import { SubmitHandler, useForm } from 'react-hook-form';

import Header from './header';

const HeaderContainer = () => {
    const { setLoading, setInstagramAccount } = useInstagramAccountStore((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InstagramAccountType>({
        resolver: zodResolver(InstagramAccountSchema),
    });

    const onSubmit = useCallback<SubmitHandler<InstagramAccountType>>(
        async (body: InstagramAccountType) => {
            setLoading(true);

            const { data, error } = await login(body);
            console.log('data', data);

            if (error) {
                setLoading(false);
                errorToast(mappedErrors[error.message] || 'Algo de errado aconteceu, tente novamente.');
                return;
            }

            setInstagramAccount(data.user);
            setLoading(false);
        },
        [setInstagramAccount, setLoading]
    );

    return <Header onSubmit={onSubmit} handleSubmit={handleSubmit} />;
};

export default HeaderContainer;
