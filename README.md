# 🎙️ AI-Powered Storyteller Web App

An interactive full-stack web application that brings stories to life through AI-generated dialogue, character voices, translation, and audio playback. Built using the **MERN Stack** (MongoDB, Express.js, Node.js) with **HTML/CSS/JS frontend** and integrated with **Murf API** for TTS & translation, and **CohereAI** for AI-powered storytelling.

---

## 🌟 Features

- 📝 **Prompt-Based Story Generation**: Enter creative prompts and generate dialogue-formatted stories using **CohereAI**.
- 🗣️ **Text-to-Speech with Murf API**: Each character can have a custom voice in multiple languages.
- 🌐 **Multilingual Translation**: Convert stories into supported languages like Hindi, German, and Chinese.
- 🎧 **Individual & Merged Audio Clips**: Get audio for each line or listen to the entire story with seamless merged narration.
- ⬇️ **Audio Download Support**: Save merged stories as MP3s for offline listening.
- 🔐 **User Authentication**: Sign up, log in, and get a **personal profile dashboard**.
- 📊 **User Stats Tracking**: Monitor your prompt submissions, downloads, and audio merges in real-time.
- 📚 **Built-in Story Library**: Pick and personalize preloaded stories or write your own from scratch.
- 🎨 **Beautiful UI**: Soft pink, glowing visuals with accessibility and simplicity in mind.

---

## 🚀 Tech Stack

| Technology     | Purpose                                  |
|----------------|------------------------------------------|
| MongoDB        | Database for storing user info and stats |
| Express.js     | Backend server and API routing           |
| Node.js        | Runtime for backend logic                |
| HTML/CSS/JS    | Frontend design and interactivity        |
| Murf API       | Text-to-Speech & translation             |
| CohereAI       | AI-based story script generation         |
| FFmpeg         | Audio merging tool for narration         |
| Axios, UUID    | Utility libraries                        |

---

## 🧠 How It Works

1. User enters a creative story prompt or selects from preloaded stories.
2. Characters are auto-detected from the dialogue.
3. User selects unique voices for each character and optionally selects a language.
4. The story is translated (if selected) and converted to speech using Murf API.
5. Audio is returned in clips and a merged narration.
6. Final audio can be played or downloaded.
7. User’s activities are tracked on a personal profile page.

---

## 🔗 Demo Video

📽️ **Watch the full walkthrough/demo here:**  
> [![Watch Demo](https://img.shields.io/badge/🎬-Click%20to%20Watch%20Demo-red)](https://www.loom.com/share/194904f37dc74fbdb9e7a5a8730bd892?sid=550e0cc9-aae6-4b55-a9fa-431e5512487b)

> Replace the link with your hosted demo video (YouTube, Google Drive, etc.).

---

---

## 🛡️ .gitignore Sample

```gitignore
node_modules/
.env
temp/
public/audio/
````

---
## 🧑‍💻 Getting Started Locally

```bash
git clone https://github.com/your-username/AI-Storyteller.git
cd AI-Storyteller
npm install
# Create .env file with your API keys and MongoDB URI
npm start

```
## 💡 Inspiration


This project was built for the Murf AI Hackathon Challenge 2, blending creativity, accessibility, and AI into an immersive storytelling tool. Designed for everyone — including children, rural users, and the visually impaired — it showcases the power of voice and multilingual technology to bring stories to life

---

## 📬 Contact
**Developer:** Manasvi Bansal
---

> ⭐ Don’t forget to star this repo if you like the project!

```

