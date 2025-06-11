import { openai } from '../config/openai';

export async function simplifyContent(content, level) {
  try {
    let prompt;
    if (level === 'simplified') {
      prompt = `Rephrase the following achievement in a simplified, professional manner (3-5 lines): "${content}"`;
    } else if (level === 'minimal') {
      prompt = `Condense the following achievement into a single, impactful sentence: "${content}"`;
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to simplify content');
  }
}