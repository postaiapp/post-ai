import { ClientResponse } from '@common/interfaces/api';
import { InstagramAccountType, InstagramLogoutType } from '@common/interfaces/instagramAccount';

import client from './api';

export const instagramLogin = async (body: InstagramAccountType) => {
    const { data, error }: ClientResponse = await client.post(`/instagram/login`, body);

    console.log('data', data);
    console.log('error', error);

    return {
        data,
        error,
    };
};

export const instagramLogout = async (filter: InstagramLogoutType) => {
    const { data, error }: ClientResponse = await client.delete(`/instagram/logout/${filter.userName}`);

    return {
        data,
        error,
    };
};
