import { createClient } from '@deepgram/sdk';
import dotenv from 'dotenv';
dotenv.config();

export default class DeepgramClient {
  constructor() {
    this.deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  }

  async listenAndTranscribe(channel) {
    console.log('🎙️ [Deepgram] Starting STT stream...');

    // Open Asterisk audio stream
    const ws = await channel.record({
      format: 'wav',
      beep: false,
      ifExists: 'overwrite',
      name: `stt_input_${Date.now()}`
    });

    // Stream to Deepgram
    const dgStream = await this.deepgram.listen.live({
      model: 'nova',
      smart_format: true,
      vad_events: true
    });

    dgStream.on('transcriptReceived', (data) => {
      const transcript = data.channel.alternatives[0]?.transcript;
      if (transcript) {
        console.log('📜 [Deepgram] Transcript:', transcript);
      }
    });

    dgStream.on('error', (err) => {
      console.error('❌ [Deepgram] Error:', err);
    });

    dgStream.on('close', () => {
      console.log('🛑 [Deepgram] Stream closed');
    });

    // Simulate streaming audio from Asterisk to Deepgram
    ws.on('data', (chunk) => {
      dgStream.send(chunk);
    });

    return new Promise((resolve) => {
      dgStream.on('transcriptReceived', (data) => {
        const transcript = data.channel.alternatives[0]?.transcript;
        if (transcript && data.is_final) {
          resolve(transcript);
          dgStream.finish(); // Close stream after final result
        }
      });
    });
  }
}
