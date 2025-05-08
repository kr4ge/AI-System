import Ari from 'ari-client';
import dotenv from 'dotenv';
import { handleCall } from './handlers/callHandler.js';

dotenv.config();

const { ARI_URL, ARI_USER, ARI_PASS, APP_NAME } = process.env;

Ari.connect(ARI_URL, ARI_USER, ARI_PASS)
  .then((ari) => {
    console.log(`✅ Connected to ARI at ${ARI_URL}`);

    ari.on('StasisStart', async (event, channel) => {
      console.log(`📞 Incoming call from ${channel.name}`);
      await channel.answer();

      // Play hello-world.ulaw first
      console.log('🔊 Playing hello-world...');
      const playback = ari.Playback();

      channel.play({ media: 'sound:hello-world' }, playback);

      // When done, trigger AI agent
      playback.once('PlaybackFinished', async () => {
        console.log('✅ hello-world finished, starting AI agent...');
        await handleCall(channel, ari);
      });
    });

    ari.start(APP_NAME);
    console.log(`🚀 ARI app "${APP_NAME}" is now running...`);
  })
  .catch((err) => {
    console.error('❌ Failed to connect to ARI:', err);
  });
