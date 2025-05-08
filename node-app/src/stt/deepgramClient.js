import WebSocket from 'ws';
import { Deepgram } from '@deepgram/sdk';
import EventEmitter from 'events';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

class DeepgramClient extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
  }

  async startStreaming() {
    const options = {
      punctuate: true,
      language: 'en',
      interim_results: false,
      vad_events: true,
      encoding: 'linear16',
      sample_rate: 8000,
    };

    this.socket = deepgram.transcription.live(options);

    this.socket.on('open', () => this.emit('open'));

    this.socket.on('transcriptReceived', (data) => {
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (transcript) {
        this.emit('transcript', transcript);
      }
    });

    this.socket.on('vadDetected', (data) => {
      this.emit('vad', data);
    });

    this.socket.on('error', (err) => {
      console.error('Deepgram error:', err);
      this.emit('error', err);
    });

    this.socket.on('close', () => this.emit('close'));
  }

  send(audioBuffer) {
    if (this.socket && this.socket.send) {
      this.socket.send(audioBuffer);
    }
  }

  finish() {
    if (this.socket) {
      this.socket.finish();
    }
  }
}

export default DeepgramClient;
