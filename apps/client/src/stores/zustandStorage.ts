import { PersistStorage } from "zustand/middleware";

const createZustandStorage = <T>(): PersistStorage<T> => ({
	getItem: (name) => {
		const storedValue = localStorage.getItem(name);
		return storedValue ? JSON.parse(storedValue) : null;
	},
	setItem: (name, value) => {
		localStorage.setItem(name, JSON.stringify(value));
	},
	removeItem: (name) => {
		localStorage.removeItem(name);
	}
});

export default createZustandStorage;
