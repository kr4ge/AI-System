import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class ConversationalAgent {
  constructor() {
    this.history = [
      { role: 'system', content: 'You are a helpful voice assistant.' }
    ];
  }

  async replyToUser(transcript) {
    this.history.push({ role: 'user', content: transcript });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: this.history,
      temperature: 0.7,
    });

    const assistantReply = response.choices[0].message.content;
    this.history.push({ role: 'assistant', content: assistantReply });

    return assistantReply;
  }

  resetConversation() {
    this.history = [
      { role: 'system', content: 'You are a helpful voice assistant.' }
    ];
  }
}

export default ConversationalAgent;