import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export function convertWavToUlaw(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec('pcm_mulaw')
      .format('ulaw')
      .on('end', () => {
        console.log('✅ WAV to ULAW conversion done.');
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ Error converting to ULAW:', err.message);
        reject(err);
      })
      .save(outputPath);
  });
}
