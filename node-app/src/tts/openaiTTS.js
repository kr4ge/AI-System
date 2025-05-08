import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VOICE = 'nova'; // other options: 'shimmer', 'echo', 'alloy', etc.

export default class OpenAITTS {
  static async synthesizeToWav(text, outputFilename = 'response.wav') {
    const outputPath = path.resolve('/tmp', outputFilename);

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/audio/speech',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
        data: {
          model: 'tts-1',
          input: text,
          voice: VOICE,
          response_format: 'wav',
        },
      });

      const writer = fs.createWriteStream(outputPath);
      await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      return outputPath;
    } catch (err) {
      console.error('❌ TTS synthesis failed:', err.response?.data || err.message);
      throw err;
    }
  }

  static async streamTTS(text) {
    const audioPath = await this.synthesizeToWav(text);
    const audioData = fs.readFileSync(audioPath);
    return Readable.from(audioData);
  }
}
