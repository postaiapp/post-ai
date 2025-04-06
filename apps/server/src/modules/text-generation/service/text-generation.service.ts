import { GenerateTextOptions, GeneratedText } from '@type/text-generation';

export abstract class TextGenerationService {
	abstract generateText(options: GenerateTextOptions): Promise<GeneratedText>;
}
