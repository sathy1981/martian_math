# 🪐 Martian Math – Chapter 1: Balance the Air Mix

**Age group:** 10–12  
**Theme:** The astronaut must fix the air mixture in the Mars habitat after a storm.  
**Focus skill:** Percentages (adding to 100%, understanding ratios)

---

## 🎯 Learning Goals

- Understand that percentages represent parts of a whole.  
- Apply simple addition and subtraction to make a total of 100%.  
- Experiment with changing one percentage and observing how it affects others.  
- Practice estimation (“20% oxygen, 78% nitrogen, 2% other gases”).

---

## 🌍 Story Context

After a dust storm, the astronaut’s air tanks are scrambled.  
Their robot companion **R.A.L.F.** (Reactive Astronaut Learning Friend) helps them rebalance the gases.  
The player must adjust the mix to safe breathing levels.

**Safe target mix**
| Gas | Target % |
|-----|-----------|
| Oxygen (O₂) | 20% |
| Nitrogen (N₂) | 78% |
| Other gases (CO₂, etc.) | 2% |

---

## 🧩 Core Gameplay Loop

1. Player adjusts three **sliders** representing O₂, N₂, and Other gases.  
2. Player clicks **“Confirm Mix.”**  
3. Game logic checks totals and differences against target mix.  
4. R.A.L.F. responds in friendly, encouraging dialogue:
   - Too high / low feedback  
   - Encouraging hints  
   - Fun reactions when correct

When the mix is correct → the habitat stabilizes → chapter complete!

---

## 🖥️ Frontend Layout (MVP)

+----------------------------------------------------------+

R.A.L.F. Chat Window
R.A.L.F.: "Hi Explorer! The storm messed up our air..."
You: [text input or button options]
[Slider: Oxygen %] [Slider: Nitrogen %] [Slider: Other %]
[ Confirm Mix ]
Total: 103%
+----------------------------------------------------------+

kotlin
Copy code

---

## ⚙️ Simple Logic (in JS)

```js
const targetMix = { O2: 20, N2: 78, Other: 2 };

function checkMix(playerMix) {
  const total = playerMix.O2 + playerMix.N2 + playerMix.Other;
  if (total !== 100)
    return `Your gases add up to ${total}%. Aim for 100%.`;
  
  const diffO2 = Math.abs(playerMix.O2 - targetMix.O2);
  const diffN2 = Math.abs(playerMix.N2 - targetMix.N2);
  const diffOther = Math.abs(playerMix.Other - targetMix.Other);

  if (diffO2 < 3 && diffN2 < 3 && diffOther < 3)
    return "✅ Perfect mix! The air is safe and breathable.";

  if (playerMix.O2 > targetMix.O2)
    return "Too much oxygen — the fire risk is high!";
  if (playerMix.O2 < targetMix.O2)
    return "Not enough oxygen — you’ll get dizzy!";
  if (playerMix.N2 < targetMix.N2)
    return "We’re missing nitrogen — pressure is too low!";
  return "Keep adjusting the tanks!";
}
🤖 R.A.L.F. Personality Prompt
Use a small LLM (e.g., OpenAI GPT, local Ollama model, or Bedrock Claude) to give voice and personality to the robot.

System Prompt
pgsql
Copy code
You are R.A.L.F., a friendly robot assistant helping a 12-year-old astronaut fix their Mars habitat. 
Speak simply, positively, and stay in character as a humorous, slightly clumsy robot. 
Always tie responses back to the game’s learning goal (percentages that add to 100). 
If the player struggles, offer step-by-step hints but never just give the correct numbers.
Example Dialogues
R.A.L.F.: “Our O₂ tanks are overflowing! Let’s lower oxygen a little — try closer to 20%.”
Player: “Okay, I set oxygen to 25.”
R.A.L.F.: “Nice try! That’s still too high. What could we do to bring it down while keeping the total 100%?”
Player (corrects): “Now 20 O₂, 78 N₂, 2 Other.”
R.A.L.F.: “Beep boop! You did it, Explorer. The air feels perfect — if I could breathe!”

🔧 Tech Setup Options
Option A: Fully Client-Side (simplest)
HTML + JavaScript + CSS

All math logic runs in browser

LLM replies simulated with prewritten messages or local JSON

Option B: With AI Dialogue
Frontend: React or SvelteKit

Backend: FastAPI or Node

Endpoint /chat → sends short JSON context to an LLM

Example payload:

json
Copy code
{
  "role": "student",
  "mix": {"O2": 45, "N2": 45, "Other": 10},
  "feedback": "Too much oxygen — the fire risk is high!"
}
🧱 MVP Architecture Diagram
scss
Copy code
[Player UI]
   ├─ Sliders (O₂, N₂, Other)
   ├─ Chat Window (R.A.L.F.)
   └─ Confirm Button
         ↓
   [Game Logic: checkMix()]
         ↓
   [Feedback → Chat + Visuals]
         ↓
   (Optional) LLM API → adds dialogue flavor
🧑‍🏫 Extension Ideas (Future Chapters)
Chapter	Theme	Math Concept
2	Water recycling	Volume % and measurement
3	Power control	Fractions of energy sources
4	Food ratios	Nutrient balance (ratio and proportion)
5	Rocket fuel	Rates and basic algebra

🚀 Development Checklist
 Basic HTML/JS page with sliders and chat box

 Simple feedback logic (adds to 100 %, too high/low messages)

 Optional: integrate AI dialogue for personality

 Add visuals (colored tanks, safety meter)

 Playtest with kids — check understanding of % and ratios

 Prepare Chapter 2: Water Mix Challenge

📁 Suggested File Names
pgsql
Copy code
martian_math/
│
├── index.html
├── script.js
├── style.css
├── ai_prompt_ralf.txt
└── MARTIAN_MATH_CH1.md
✅ Summary
Goal: Make math feel like survival on Mars.
Keep it simple: sliders, totals, feedback, personality.
AI’s job: conversation + encouragement, not computation.
Next step: Build index.html with slider inputs and a small chat pane,
then plug in checkMix() and a few prewritten R.A.L.F. responses.