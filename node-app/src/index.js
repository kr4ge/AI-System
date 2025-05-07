import Ari from 'ari-client';
import dotenv from 'dotenv';

dotenv.config();

const { ARI_URL, ARI_USER, ARI_PASS, APP_NAME } = process.env;

Ari.connect(ARI_URL, ARI_USER, ARI_PASS)
  .then((ari) => {
    console.log(`✅ Connected to ARI at ${ARI_URL}`);

    ari.on('StasisStart', async (event, channel) => {
      console.log(`📞 Incoming call from ${channel.name}`);

      try {
        await channel.answer();
        console.log('🔊 Playing hello-world...');

        const playback = ari.Playback();

        // Attach listener before playback starts
        playback.on('PlaybackFinished', async () => {
          console.log('📴 Playback finished. Hanging up...');
          await channel.hangup();
        });

        await channel.play({ media: 'sound:hello-world' }, playback);

      } catch (err) {
        console.error('❌ Error handling call:', err);
      }
    });

    ari.start(APP_NAME);
    console.log(`🚀 ARI app "${APP_NAME}" is now running...`);
  })
  .catch((err) => {
    console.error('❌ Failed to connect to ARI:', err);
  });
