import { Transform } from 'class-transformer';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from 'class-validator';

  export function ValidateCPF(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
	  registerDecorator({
		name: 'validateCPF',
		target: object.constructor,
		propertyName: propertyName,
		options: validationOptions,
		validator: {
		  validate(value: any, args: ValidationArguments) {
			if (typeof value !== 'string') return false;

			const cleanedCPF = value.replace(/\D/g, '');
			if (cleanedCPF.length !== 11) return false;

			if (/^(\d)\1+$/.test(cleanedCPF)) return false;

			let sum = 0,
			  remainder;

			for (let i = 1; i <= 9; i++)
			  sum += parseInt(cleanedCPF.charAt(i - 1)) * (11 - i);

			remainder = (sum * 10) % 11;
			if (remainder === 10 || remainder === 11) remainder = 0;
			if (remainder !== parseInt(cleanedCPF.charAt(9))) return false;

			sum = 0;
			for (let i = 1; i <= 10; i++)
			  sum += parseInt(cleanedCPF.charAt(i - 1)) * (12 - i);

			remainder = (sum * 10) % 11;
			if (remainder === 10 || remainder === 11) remainder = 0;
			if (remainder !== parseInt(cleanedCPF.charAt(10))) return false;

			return true;
		  },
		  defaultMessage(args: ValidationArguments) {
			return `${args.property} must be a valid CPF`;
		  },
		},
	  });
	};
  }

  export function TransformCPF() {
	return Transform(({ value }) => {
	  if (typeof value !== 'string') return value;
	  const cleanedCPF = value.replace(/\D/g, '');
	  if (cleanedCPF.length !== 11) return value;
	  return cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	});
  }
