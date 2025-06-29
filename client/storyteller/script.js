const storyInput = document.getElementById('storyInput');
const voiceSelectorDiv = document.getElementById('voiceSelectors');
const audioContainer = document.getElementById('audioResults');


//slideshow for background
const slides = document.querySelectorAll('.slide-img');
let current = 0;
let order = [];

// Shuffle function using Fisher-Yates
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate random order of slide indices
function generateRandomOrder() {
  order = Array.from(slides.keys());
  shuffleArray(order);
}

// Show slide by shuffled index
function showSlideByOrder(index) {
  slides.forEach((img, i) => {
    img.classList.remove('active');
  });
  slides[order[index]].classList.add('active');
}

// Initialize
generateRandomOrder();
showSlideByOrder(current);

// Change slide every 6 seconds randomly
setInterval(() => {
  current++;
  if (current >= order.length) {
    generateRandomOrder(); // reshuffle when done
    current = 0;
  }
  showSlideByOrder(current);
}, 5000);




const murfVoices = {
  'en-US-maverick': 'Maverick (US Male)',
  'en-US-miles': 'Miles (US Male)',
  'en-US-natalie': 'Natalie (US Female)',
  'en-IN-isha': 'Isha (IN Female)',
  'en-IN-rohan': 'Rohan (IN Male)',
  'hi-IN-ayushi': 'Ayushi (Indian Female)',
  'hi-IN-kabir': 'Kabir (Indian Male)',
  'de-DE-matthias': 'Matthias (German Male)',
  'de-DE-lia': 'Lia (German Female)',
  'zh-CN-tao': 'Tao (Chinese Male)',
  'zh-CN-wei': 'Wei (Chinese Female)'
};

// ---------------- Fetch stories into dropdown ---------------- //
let allStories = [];

async function fetchStories() {
  const select = document.getElementById('storySelect');
  const res = await fetch('http://localhost:5000/api/stories');
  const data = await res.json();
  allStories = data.stories;

  data.stories.forEach(story => {
    const option = document.createElement('option');
    option.value = story.id;
    option.textContent = story.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const selectedId = parseInt(select.value);
    const selectedStory = allStories.find(s => s.id === selectedId);
    if (selectedStory) {
      storyInput.value = selectedStory.script;
    }
  });
}

fetchStories();

//ai generate stories
const generateAIStory = async () => {
  const prompt = document.getElementById('prompt').value.trim();
  if (!prompt) 
    alert("Please enter a prompt in text box");

  try {
    const res = await fetch('http://localhost:5000/api/generatestoryapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.success) {
      storyInput.value = data.script;//placing in text area
      alert("Story generated! You can now assign voices and generate audio.");
    } else {
      alert("Failed to generate story: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while generating story.");
  }
};


// ---------------- Voice dropdown generation ---------------- //
let characters = [];
let voiceMap = {};

document.getElementById('generateBtn').addEventListener('click', () => {
  const story = storyInput.value.trim();
  if (!story) return alert('Please enter a story.');

  const selectLang = document.getElementById('translatelang').value;
  voiceSelectorDiv.innerHTML = '';
  audioContainer.innerHTML = '';
  characters = [];

  const lines = story.split('\n').filter(line => line.includes(':'));
  characters = [...new Set(lines.map(line => line.split(':')[0].trim()))];

  characters.forEach(character => {
    const label = document.createElement('label');
    label.innerHTML = `<strong>${character}</strong>: <select id="voice-${character}"></select>`;
    const select = label.querySelector('select');

    for (let [id, name] of Object.entries(murfVoices)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      select.appendChild(option);
    }

    voiceSelectorDiv.appendChild(label);
    voiceSelectorDiv.appendChild(document.createElement('br'));
  });

  const startBtn = document.createElement('button');
  startBtn.id = 'startBtn';
  startBtn.textContent = 'Start Playback';
  startBtn.setAttribute('data-lang', selectLang);
  voiceSelectorDiv.appendChild(startBtn);
});

// ---------------- Voice generation and merged playback ---------------- //
document.addEventListener('click', async (e) => {
  if (e.target.id !== 'startBtn') return;

  const story = storyInput.value.trim();
  if (!story) return alert('Please enter a story.');

  const translateTo = e.target.getAttribute('data-lang') || 'none';

  voiceMap = {};
  characters.forEach(character => {
    const selectedVoice = document.getElementById(`voice-${character}`).value;
    voiceMap[character] = selectedVoice;
  });

  try {
    const response = await fetch('http://localhost:5000/api/generate-voices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        script: story,
        voiceMap,
        translateto: translateTo
      })
    });

    const data = await response.json();
    audioContainer.innerHTML = '';

    if (data.success) {
      const audioList = [];
      const audioUrls = [];

      // 🔒 Hidden section for individual clips
      const individualSection = document.createElement('div');
      individualSection.id = 'individualClips';
      individualSection.style.display = 'none';

      data.data.forEach(line => {
        const div = document.createElement('div');
        div.innerHTML = `
          <p><strong>${line.character}:</strong> ${line.dialogue}</p>
          <audio controls src="${line.audiourl}"></audio>
        `;
        individualSection.appendChild(div);
        audioList.push(div.querySelector('audio'));
        audioUrls.push(line.audiourl);
      });

      audioContainer.appendChild(individualSection);

      // 🔁 Merge Request
      const mergeRes = await fetch('http://localhost:5000/api/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrls })
      });

      const mergeData = await mergeRes.json();

      if (mergeData.success) {
        const mergedAudio = document.createElement('div');
       mergedAudio.innerHTML = `
  <h3 style="color:darkgreen;">🎧 Merged Audio:</h3>
  <audio controls src="${mergeData.mergedAudio}"></audio>
  <br>
  <button onclick="handleDownload('${mergeData.mergedAudio}')">⬇️ Download Audio</button>

  <button id="showClipsBtn">🔎 Show Individual Clips</button>
`;
        audioContainer.appendChild(mergedAudio);

        // 🎬 Autoplay merged only (optional)
        const mergedPlayer = mergedAudio.querySelector('audio');
        if (document.getElementById('autoplayToggle')?.checked) {
          mergedPlayer.play();
        }

        // 👇 Reveal individual clips if asked
        setTimeout(() => {
          const toggleBtn = document.getElementById('showClipsBtn');
          if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
              const clipSection = document.getElementById('individualClips');
              if (clipSection) {
                clipSection.style.display = 'block';
                toggleBtn.style.display = 'none';
              }
            });
          }
        }, 0);

      } else {
        audioContainer.innerHTML += `<p style="color:red;">Failed to merge audio: ${mergeData.error}</p>`;
      }

    } else {
      audioContainer.innerHTML = `<p style="color:red;">Failed: ${data.error}</p>`;
    }

  } catch (err) {
    console.error('Error fetching voices:', err);
    audioContainer.innerHTML = `<p style="color:red;">Error generating voices.</p>`;
  }
});
function handleDownload(audioUrl) {
  // Trigger download
  const link = document.createElement('a');
  link.href = audioUrl;
  link.download = 'story_audio.mp3';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // ✅ Update download count
  fetch('/api/user/download', { method: 'POST' })
    .then(res => res.ok ? console.log('Download tracked!') : console.warn('Not logged in'))
    .catch(err => console.error('Error updating downloads:', err));
}
