import { Request } from 'express';
import { Meta } from './meta';

export type ServiceBaseParamsType<T = Record<string, unknown>> = {
	meta?: Meta;
	data?: T;
	req?: Request;
};

export type ServiceBaseParamsWithFilterType<
	T = Record<string, unknown>,
	F = Record<string, unknown>,
> = ServiceBaseParamsType<T> & {
	filter: F;
};
