import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const chatModel = new ChatOpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 0.7,
});

export const QueryType = {
  SHOW_EMPLOYER_CHANGES: 'SHOW_EMPLOYER_CHANGES',
  SHOW_LOCATION_CHANGES: 'SHOW_LOCATION_CHANGES',
  SHOW_DRAFT_ACCOMPLISHMENTS: 'SHOW_DRAFT_ACCOMPLISHMENTS',
  UNKNOWN: 'UNKNOWN'
};

export async function processQuery(query) {
  try {
    const prompt = PromptTemplate.fromTemplate(`
      You are an AI assistant helping with alumni information. Based on the user's query, 
      determine which type of information they are requesting.
      
      User query: {query}
      
      If the query is about accomplishments, achievements, or student performance, respond with exactly: SHOW_DRAFT_ACCOMPLISHMENTS
      If the query is about employer changes, job changes, or career updates, respond with exactly: SHOW_EMPLOYER_CHANGES
      If the query is about location changes, moving to new cities, or relocations, respond with exactly: SHOW_LOCATION_CHANGES
      For any other type of query, respond with exactly: UNKNOWN
      
      Respond with only one of these values, nothing else.
    `);

    const chain = RunnableSequence.from([
      prompt,
      chatModel,
      new StringOutputParser()
    ]);

    const response = await chain.invoke({
      query: query
    });

    return response.trim();
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
}