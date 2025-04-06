import { readFile } from "fs/promises";
import Handlebars from "handlebars";
import { join } from "path";

const getHtmlPath = async (file: string, data?: Record<string, unknown>) => {
	const htmlPath = join(
		process.cwd(),
		'src',
		'common',
		'templates',
		file
	);

	const templateSource = await readFile(htmlPath, 'utf8');

	if (!data) {
		return templateSource;
	}

	const template = Handlebars.compile(templateSource);

	return template(data);
};

export { getHtmlPath };

