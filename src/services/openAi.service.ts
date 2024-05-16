import OpenAI from 'openai';

import { OPENAI_API_KEY, OPENAI_MODEL } from '@/constants';
import { checkRequiredEnvVars } from '@/utils';

let instance: OpenAiService | null = null;

export const getOpenAiService = () => {
  if (!instance) {
    instance = new OpenAiService();
  }
  return instance;
};

interface OpenAIParams {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
}

export class OpenAiService {
  public getElementFromQuestion = async (openAiParams: OpenAIParams) => {
    checkRequiredEnvVars(['OPENAI_API_KEY']);
    const { systemPrompt, userPrompt, temperature } = openAiParams;
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      max_tokens: 1024,
      temperature,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });
    const content = completion.choices[0].message.content;
    let result;
    if (content && content.includes('{') && content.includes('}')) {
      if (content.startsWith('[')) {
        result = JSON.parse(content);
      } else {
        result = [JSON.parse(content)];
      }
    } else {
      return content;
    }

    return result;
  };
}
