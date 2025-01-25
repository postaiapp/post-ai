import { InstagramAccountStore } from '@common/interfaces/instagramAccount';
import { create } from 'zustand';

export type InstagramAccount = {
    isLoading: boolean;
    instagramAccounts: InstagramAccountStore[];
    setLoading: (bool?: boolean) => void;
    setInstagramAccount: (account: InstagramAccountStore) => void;
    reset: () => void;
};

const init: Omit<InstagramAccount, 'setLoading' | 'reset' | 'setInstagramAccount'> = {
    isLoading: false,
    instagramAccounts: [],
};

const useInstagramAccountStore = create<InstagramAccount>()((set) => ({
    ...init,
    setLoading(bool) {
        set((prev) => ({ ...prev, isLoading: bool ?? !prev.isLoading }));
    },
    setInstagramAccount: (account: InstagramAccountStore) => {
        set((prev) => ({ ...prev, instagramAccounts: [...prev.instagramAccounts, account] }));
    },
    reset() {
        set(() => init);
    },
}));

export { useInstagramAccountStore };
