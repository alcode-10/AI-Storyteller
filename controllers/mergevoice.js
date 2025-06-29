const path = require('path');
const fs = require('fs');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/users');

ffmpeg.setFfmpegPath(path.join(__dirname, '../ffmpeg-7.1.1-full_build/bin/ffmpeg.exe'));

const downloadAudio = async (url, outputPath) => {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const mergeVoices = async (req, res) => {
  try {
    const { audioUrls } = req.body;
    if (!audioUrls || !Array.isArray(audioUrls) || audioUrls.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid input' });
    }

    const audioDir = path.join(__dirname, '../public/audio');
    const tempFiles = [];

    // Download audio files
    for (const url of audioUrls) {
      const tempFile = path.join(audioDir, `temp_${uuidv4()}.mp3`);
      console.log(`⬇️ Downloading: ${url}`);
      await downloadAudio(url, tempFile);
      tempFiles.push(tempFile);
    }

    const outputFile = `merged_${uuidv4()}.mp3`;
    const outputPath = path.join(audioDir, outputFile);
    console.log('📝 Merging to:', outputPath);

    const ffmpegCommand = ffmpeg();
    tempFiles.forEach(file => ffmpegCommand.input(file));
    ffmpegCommand
      .on('error', err => {
        console.error('❌ FFmpeg error:', err);
        if (!res.headersSent)
          return res.status(500).json({ success: false, error: 'Merging failed' });
      })
      .on('end', () => {
        console.log('✅ Merge complete:', outputFile);
        // Clean up temp files
        tempFiles.forEach(f => fs.unlinkSync(f));
         // ✅ Increment merges if user is logged in
   incrementMergeCount(req.session.user?._id);
        res.json({ success: true, mergedAudio: `/audio/${outputFile}` });
      })
      .mergeToFile(outputPath);
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ success: false, error: 'Internal error' });
  }
};
// Helper to increment merge count without blocking response
async function incrementMergeCount(userId) {
  if (!userId) return;
  try {
    await User.findByIdAndUpdate(userId, { $inc: { merges: 1 } });
    console.log("✅ Merge count updated.");
  } catch (err) {
    console.error("❗ Error updating merges count:", err);
  }
}

module.exports = { mergeVoices };












































// const axios = require('axios');
// const fs = require('fs');
// const path = require('path');
// const ffmpeg = require('fluent-ffmpeg');
// const { v4: uuidv4 } = require('uuid');
// const ffmpegPath = path.join('E:', 'storyteller', 'ffmpeg-7.1.1-full_build', 'bin', 'ffmpeg.exe');
// const ffprobePath = path.join('E:', 'storyteller', 'ffmpeg-7.1.1-full_build', 'bin', 'ffprobe.exe');

// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// const downloadAudio = async (url, filename) => {
//   const response = await axios({ url, method: 'GET', responseType: 'stream' });
//   const filePath = path.join(__dirname, '../temp', filename);
//   const writer = fs.createWriteStream(filePath);
//   response.data.pipe(writer);

//   await new Promise((resolve, reject) => {
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });

//   return filePath;
// };

// const mergeVoices = async (req, res) => {
//   const { audioUrls } = req.body;

//   if (!Array.isArray(audioUrls) || audioUrls.length === 0) {
//     return res.status(400).json({ success: false, error: 'No audio URLs provided' });
//   }

//   try {
//     const tempDir = path.join(__dirname, '../temp');
//     if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

//     const downloadedPaths = [];

//     for (let i = 0; i < audioUrls.length; i++) {
//       const url = audioUrls[i];

//       // ✅ Skip download for local files
//       if (url.startsWith('http://localhost:5000/audio/')) {
//         const filename = url.split('/audio/')[1];
//         const localPath = path.join(__dirname, '../public/audio', filename);
//         console.log('Checking file exists:', localPath, fs.existsSync(localPath));
//         downloadedPaths.push(localPath);
//       } else {
//         // 🔁 Download remote files
//         const filename = `audio_${i}.mp3`;
//         const filePath = await downloadAudio(url, filename);
//         console.log('Checking file exists:', filePath, fs.existsSync(filePath));

//         downloadedPaths.push(filePath);
//       }
//     }

//     // ✅ Merge all audio files
//     const mergedFilename = `merged_${uuidv4()}.mp3`;
//     const mergedPath = path.join(__dirname, '../public/audio', mergedFilename);
//      const command = ffmpeg();

// downloadedPaths.forEach(file => command.input(file));

// command
//   .on('start', cmdLine => console.log('FFmpeg start:', cmdLine))
//   .on('error', err => {
//     console.error('🔴 FFmpeg error:', err.message || err);
//     return res.status(500).json({ success: false, error: 'Merging failed' });
//   })
//   .on('end', () => {
//     console.log('✅ Merge successful:', mergedPath);
//     return res.json({ success: true, url: `/audio/${mergedFilename}` });
//   })
//   .concat() // tells fluent-ffmpeg to concatenate the inputs
//   .save(mergedPath);
//   }
//      catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, error: 'Server error' });
//   }
// };

// module.exports = { mergeVoices };
