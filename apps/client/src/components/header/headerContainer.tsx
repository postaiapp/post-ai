'use client';

import { useInstagramAccountStore } from '@stores/instagramAccount';

import Header from './header';

const HeaderContainer = () => {
    const { setLoading, setInstagramAccount } = useInstagramAccountStore((state) => state);
    console.log('setLoading', setLoading);
    console.log('setInstagramAccount', setInstagramAccount);
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm<InstagramAccountType>({
    //     resolver: zodResolver(InstagramAccountSchema),
    // });

    // const onSubmit = useCallback<SubmitHandler<InstagramAccountType>>(
    //     async (body: InstagramAccountType) => {
    //         setLoading(true);

    //         const { data, error } = await login(body);
    //         console.log('data', data);

    //         if (error) {
    //             setLoading(false);
    //             errorToast(mappedErrors[error.message] || 'Algo de errado aconteceu, tente novamente.');
    //             return;
    //         }

    //         setInstagramAccount(data.user);
    //         setLoading(false);
    //     },
    //     [setInstagramAccount, setLoading]
    // );
    // onSubmit={onSubmit} handleSubmit={handleSubmit}

    return <Header />;
};

export default HeaderContainer;
