import CallHandler from './handlers/callHandler.js';

const callHandler = new CallHandler();

Ari.connect(ARI_URL, ARI_USER, ARI_PASS)
  .then((ari) => {
    console.log(`✅ Connected to ARI at ${ARI_URL}`);

    ari.on('StasisStart', async (event, channel) => {
      console.log(`📞 Incoming call from ${channel.name}`);
      await channel.answer();

      console.log('🔊 Playing hello-world...');
      const playback = ari.Playback();

      channel.play({ media: 'sound:hello-world' }, playback);

      playback.once('PlaybackFinished', async () => {
        console.log('✅ hello-world finished, starting AI agent...');
        await callHandler.handleCall(channel);
      });
    });

    ari.start(APP_NAME);
    console.log(`🚀 ARI app "${APP_NAME}" is now running...`);
  })
  .catch((err) => {
    console.error('❌ Failed to connect to ARI:', err);
  });
