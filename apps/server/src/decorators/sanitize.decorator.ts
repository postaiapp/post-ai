import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';
import { escape } from 'validator';

export function Sanitize() {
	return Transform(({ value }) => {
		if (typeof value !== 'string') return value;

		const sanitized = sanitizeHtml(value, {
			allowedTags: [],
			allowedAttributes: {},
		});

		return escape(sanitized);
	});
}
