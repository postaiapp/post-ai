import { useEffect, useReducer } from 'react';

interface ChatState {
	prompt: string;
}

type ChatAction = { type: 'SET_PROMPT'; payload: string } | { type: 'LOAD_PROMPT'; payload: string };

const initialState: ChatState = { prompt: '' };

const createReducer = (key: string) => {
	const reducer = (state: ChatState, action: ChatAction): ChatState => {
		switch (action.type) {
			case 'SET_PROMPT':
				localStorage.setItem(key, action.payload);
				return { ...state, prompt: action.payload };
			case 'LOAD_PROMPT':
				return { ...state, prompt: action.payload };
			default:
				return state;
		}
	};

	return reducer;
};

const useChatReducer = (key: string) => {
	const reducer = createReducer(key);
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const storedPrompt = localStorage.getItem(key) || '';
		dispatch({ type: 'LOAD_PROMPT', payload: storedPrompt });
	}, [key]);

	return {
		prompt: state.prompt,
		setPrompt: (newPrompt: string) => dispatch({ type: 'SET_PROMPT', payload: newPrompt }),
	};
};

export default useChatReducer;
