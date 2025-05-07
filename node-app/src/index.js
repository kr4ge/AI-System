import express from 'express';
import Ari from 'ari-client';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Create a basic HTTP server for Docker healthcheck
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(3001, () => {
  console.log('✅ Healthcheck endpoint running on http://localhost:3001');
});

const { ARI_URL, ARI_USER, ARI_PASS, APP_NAME } = process.env;

Ari.connect(ARI_URL, ARI_USER, ARI_PASS)
  .then((ari) => {
    console.log(`✅ Connected to ARI at ${ARI_URL}`);

    // Handle incoming channel into Stasis
    ari.on('StasisStart', async (event, channel) => {
      console.log(`📞 Incoming call from ${channel.name}`);
      try {
        await channel.answer();
        console.log('🔊 Playing hello-world...');
        const playback = await channel.play({ media: 'sound:hello-world' });

        // Hang up when playback finishes
        channel.on('PlaybackFinished', async () => {
          console.log('📴 Playback finished. Hanging up...');
          await channel.hangup();
        });
      } catch (err) {
        console.error('❌ Error handling call:', err);
      }
    });

    // Register app with Asterisk
    ari.start(APP_NAME);
    console.log(`🚀 ARI app "${APP_NAME}" is now running...`);
  })
  .catch((err) => {
    console.error('❌ Failed to connect to ARI:', err);
  });
