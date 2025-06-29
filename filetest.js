const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'client/audio');
console.log('Files in audioDir:', fs.readdirSync(audioDir));
