type ExceptionResponse = {
	logger: string;
	exceptionMessage: string;
	status: number;
	Exception: new (...args: any[]) => Error;
};

export type { ExceptionResponse };
