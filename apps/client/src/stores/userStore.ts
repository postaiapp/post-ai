import { UserStore } from '@common/interfaces/userStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import createZustandStorage from './zustandStorage';

const zustandStorage = createZustandStorage<UserStore>();

const userStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			logout: () => set({ user: null }),
		}),
		{
			name: 'user',
			storage: zustandStorage,
		}
	)
);

export default userStore;
