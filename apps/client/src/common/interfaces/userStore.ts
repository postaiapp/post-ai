import { User } from './user';

type UserStore = {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
};
export type { UserStore };
