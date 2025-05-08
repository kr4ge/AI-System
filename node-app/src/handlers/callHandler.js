import DeepgramClient from '../stt/deepgramClient.js';
import ConversationalAgent from '../agents/conversationalAgent.js';
import OpenAITTS from '../tts/openaiTTS.js';
import { convertWavToUlaw } from '../utils/audioUtils.js';
import fs from 'fs';
import path from 'path';

const TMP_DIR = '/app/tmp';
const ULAW_PATH = path.join(TMP_DIR, 'tts_output.ulaw');
const WAV_PATH = path.join(TMP_DIR, 'tts_output.wav');

class CallHandler {
  constructor(ari) {
    this.ari = ari;
    this.deepgram = new DeepgramClient();
    this.agent = new ConversationalAgent();
    this.tts = new OpenAITTS();
  }

  async handleCall(channel, ari) {
    try {
      console.log('🧠 Starting AI session...');
      await this.runConversationLoop(channel);
    } catch (err) {
      console.error('❌ Call handling failed:', err);
    }
  }

  async runConversationLoop(channel) {
    while (true) {
      console.log('🎙️ Listening for speech...');
      const transcript = await this.deepgram.listenAndTranscribe(channel);

      if (!transcript) {
        console.log('🤷 No speech detected.');
        continue;
      }

      console.log(`📜 User said: "${transcript}"`);
      const response = await this.agent.replyToUser(transcript);
      console.log(`🤖 AI replies: "${response}"`);

      const wavBuffer = await this.tts.synthesizeToWav(response);
      fs.writeFileSync(WAV_PATH, wavBuffer);
      await convertWavToUlaw(WAV_PATH, ULAW_PATH);

      console.log('🔊 Playing AI response...');
      await channel.play({ media: 'sound:ai/tts_output' });
    }
  }
}

export default CallHandler;
