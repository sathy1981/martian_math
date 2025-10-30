# 🪐 Martian Math - Chapter 1: Balance the Air Mix

An educational game teaching percentages to 10-12 year olds through a Mars habitat survival scenario.

## 🎮 Game Overview

Students help R.A.L.F. (Reactive Astronaut Learning Friend) fix the air mixture in a Mars habitat after a dust storm. They must:
- Fill 10 gas tanks with the correct mixture
- Learn that each tank = 10% of the total atmosphere
- Understand ratios and percentages through visual, hands-on interaction

**Target Mix:**
- 2 tanks Oxygen (20%)
- 7 tanks Nitrogen (70%)
- 1 tank Other gases (10%)

## 🏗️ Architecture

**Frontend:** Pure HTML/CSS/JavaScript (no build step required)
- Visual tank interface
- Real-time percentage calculations
- Chat interface with R.A.L.F.
- Works standalone with fallback responses

**Backend:** Node.js + Express + OpenAI API
- Provides AI-powered R.A.L.F. personality
- Contextual hints and encouragement
- Adaptive learning support

## 🚀 Quick Start

### Option 1: Frontend Only (No AI)
1. Open `index.html` in a web browser
2. Game works with pre-written R.A.L.F. responses

### Option 2: Full Experience (With AI)

#### Prerequisites
- Node.js (v14 or higher)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

#### Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
# Copy the template
copy env_template.txt .env

# Edit .env and add your OpenAI API key:
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3000
```

3. **Start the backend:**
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

4. **Open the game:**
- Open `index.html` in your web browser
- The frontend will automatically connect to the backend at `http://localhost:3000`

## 📁 File Structure

```
martian_math/
├── index.html          # Main game interface
├── script.js           # Frontend game logic
├── style.css           # Styling and animations
├── server.js           # Backend API for R.A.L.F.
├── ralf_prompt.md      # R.A.L.F.'s personality & teaching style (EDIT THIS!)
├── package.json        # Node.js dependencies
├── env_template.txt    # Environment variable template
├── .gitignore          # Git ignore file
├── instructions.md     # Original game design doc
└── README.md           # This file
```

## 🎯 How to Play

1. **Select a gas type** using the buttons (Oxygen, Nitrogen, or Other)
2. **Click on tanks** to fill them with the selected gas
3. Watch the **percentage calculations** update in real-time
4. **Ask R.A.L.F. for help** using the chat interface
5. Click **"Check My Mix"** when you think you have the right combination
6. R.A.L.F. will give you feedback and hints
7. Keep adjusting until you achieve the perfect mix!

## 🤖 R.A.L.F.'s Personality

R.A.L.F. is designed to:
- Guide students without giving away answers
- Explain concepts in terms of percentages and ratios
- Stay encouraging and positive
- Make learning feel like problem-solving, not homework
- Use space-themed language to keep it fun
- **Remember the conversation** to build on previous learning

**Customizing R.A.L.F.:**
Edit `ralf_prompt.md` to change R.A.L.F.'s personality, teaching style, or learning objectives. The server will reload it automatically on restart.

## 🔧 Troubleshooting

**Backend not connecting:**
- Make sure the server is running (`npm start`)
- Check that port 3000 is not in use
- The game will work with fallback responses if the backend is unavailable

**OpenAI API errors:**
- Verify your API key in `.env`
- Check your OpenAI account has credits
- Review server console for error messages

## 🎓 Learning Objectives

Students will:
- Understand that percentages represent parts of a whole (100%)
- Practice converting between fractions and percentages
- Apply visual/spatial reasoning to math problems
- Learn practical applications of math (air mixture safety)
- Build confidence through guided problem-solving

## 🚀 Future Chapters

- **Chapter 2:** Water recycling (volume percentages)
- **Chapter 3:** Power control (energy fractions)
- **Chapter 4:** Food ratios (nutrient balance)
- **Chapter 5:** Rocket fuel (rates and algebra)

## 📝 License

MIT License - Feel free to use this for educational purposes!

## 🙏 Credits

Built with love for young explorers learning math through adventure! 🚀

