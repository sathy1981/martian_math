// Target mix (Phase 1): 10 tanks total
let totalTanks = 10;
let targetMix = { O2: 2, N2: 7, Other: 1 }; // 2 O2, 7 N2, 1 Other
let currentPhase = 1; // 1 = 10 tanks, 2 = 5 tanks emergency mode

// Game state
let tanks = Array(totalTanks).fill('empty');
let selectedGas = 'empty';
let isGameWon = false;

// DOM elements
const tanksGrid = document.getElementById('tanksGrid');
const chatMessages = document.getElementById('chatMessages');
const playerInput = document.getElementById('playerInput');
const sendBtn = document.getElementById('sendBtn');
const confirmBtn = document.getElementById('confirmBtn');
const resetBtn = document.getElementById('resetBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const safetyBar = document.getElementById('safetyBar');
const nextChallengeBtn = document.getElementById('nextChallengeBtn');

const o2CountEl = document.getElementById('o2Count');
const n2CountEl = document.getElementById('n2Count');
const otherCountEl = document.getElementById('otherCount');
const totalCountEl = document.getElementById('totalCount');

// Generate a unique session ID for this player
const sessionId = 'session_' + Math.random().toString(36).substring(7);

// Initialize tanks
function initTanks() {
    tanksGrid.innerHTML = '';
    for (let i = 0; i < totalTanks; i++) {
        const tank = document.createElement('div');
        tank.className = 'tank empty';
        tank.dataset.index = i;
        tank.innerHTML = `
            <div class="tank-number">${i + 1}</div>
            <div class="tank-content"></div>
        `;
        tank.addEventListener('click', () => fillTank(i));
        tanksGrid.appendChild(tank);
    }
}

// Gas selector buttons
document.querySelectorAll('.gas-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gas-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGas = btn.dataset.gas;
    });
});

// Fill tank with selected gas
function fillTank(index) {
    if (isGameWon) return;
    
    tanks[index] = selectedGas;
    const tankEl = tanksGrid.children[index];
    tankEl.className = `tank ${selectedGas}`;
    
    updateDisplay();
}

// Update counts and percentages
function updateDisplay() {
    const counts = {
        O2: tanks.filter(t => t === 'O2').length,
        N2: tanks.filter(t => t === 'N2').length,
        Other: tanks.filter(t => t === 'Other').length
    };
    
    const filled = counts.O2 + counts.N2 + counts.Other;
    
    const percentPerTank = Math.round(1000 / totalTanks) / 10; // one decimal
    o2CountEl.textContent = `${counts.O2} tanks (${(counts.O2 * percentPerTank).toFixed(0)}%)`;
    n2CountEl.textContent = `${counts.N2} tanks (${(counts.N2 * percentPerTank).toFixed(0)}%)`;
    otherCountEl.textContent = `${counts.Other} tanks (${(counts.Other * percentPerTank).toFixed(0)}%)`;
    totalCountEl.textContent = `${filled} / ${totalTanks} tanks`;
    
    updateSafetyMeter(counts);
}

// Update safety meter
function updateSafetyMeter(counts) {
    const errorScore = 
        Math.abs(counts.O2 - targetMix.O2) +
        Math.abs(counts.N2 - targetMix.N2) +
        Math.abs(counts.Other - targetMix.Other);
    
    const maxError = currentPhase === 1 ? 10 : 5;
    const safetyPercent = Math.max(0, 100 - (errorScore / maxError * 100));
    
    safetyBar.style.width = `${safetyPercent}%`;
    
    if (safetyPercent > 90) {
        safetyBar.style.backgroundColor = '#4CAF50';
    } else if (safetyPercent > 50) {
        safetyBar.style.backgroundColor = '#ffa726';
    } else {
        safetyBar.style.backgroundColor = '#ff6b6b';
    }
}

// Check mix
function isCorrectMixPhase2(counts) {
    // Accept either 1-3-1 or 1-4-0 for 5 tanks
    const opt1 = counts.O2 === 1 && counts.N2 === 3 && counts.Other === 1;
    const opt2 = counts.O2 === 1 && counts.N2 === 4 && counts.Other === 0;
    return opt1 || opt2;
}

function checkMix() {
    if (isGameWon) return;
    
    const counts = {
        O2: tanks.filter(t => t === 'O2').length,
        N2: tanks.filter(t => t === 'N2').length,
        Other: tanks.filter(t => t === 'Other').length
    };
    
    const filled = counts.O2 + counts.N2 + counts.Other;
    
    // Build context for AI
    const context = {
        tanks: counts,
        target: targetMix,
        filled: filled,
        percentages: {
            O2: Math.round((counts.O2 / totalTanks) * 100),
            N2: Math.round((counts.N2 / totalTanks) * 100),
            Other: Math.round((counts.Other / totalTanks) * 100)
        },
        phase: currentPhase
    };
    
    // Check if correct for current phase
    const isCorrect = currentPhase === 1
        ? (counts.O2 === targetMix.O2 && counts.N2 === targetMix.N2 && counts.Other === targetMix.Other)
        : isCorrectMixPhase2(counts);

    if (isCorrect) {
        isGameWon = true;
        confirmBtn.textContent = currentPhase === 1 ? "🎉 Mission Complete!" : "🎉 Emergency Solved!";
        confirmBtn.style.backgroundColor = '#4CAF50';
        safetyBar.style.width = '100%';
        safetyBar.style.backgroundColor = '#4CAF50';
        
        sendMessageToRalf({
            type: 'check',
            context: context,
            result: 'perfect'
        });

        // If phase 1 complete, reveal next challenge button
        if (currentPhase === 1) {
            const nextBtn = document.getElementById('nextChallengeBtn');
            if (nextBtn) nextBtn.style.display = 'inline-block';
        }
        return;
    }
    
    // Send to R.A.L.F. for feedback
    sendMessageToRalf({
        type: 'check',
        context: context,
        result: 'incorrect'
    });
}

// Reset tanks
function resetTanks() {
    if (isGameWon) return;
    tanks = Array(totalTanks).fill('empty');
    initTanks();
    updateDisplay();
    addRalfMessage("Tanks reset! Try again, Explorer.");
}

// Add message to chat
function addRalfMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ralf-message';
    messageDiv.textContent = text;
    
    // Remove typing indicator if present
    const typingIndicator = chatMessages.querySelector('.typing');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addPlayerMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message player-message';
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ralf-message typing';
    typingDiv.innerHTML = '<span class="typing-indicator">R.A.L.F. is thinking...</span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message to R.A.L.F. (backend API)
async function sendMessageToRalf(payload) {
    showTypingIndicator();
    
    // Add session ID to payload
    payload.sessionId = sessionId;
    
    // Use relative path for API calls (works in development and production)
    const API_BASE = window.location.origin;
    
    try {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error('Backend not available');
        }
        
        const data = await response.json();
        addRalfMessage(data.message);
        
    } catch (error) {
        console.error('AI backend error:', error);
        // Fallback to static responses
        addRalfMessage(getFallbackResponse(payload));
    }
}

// Fallback responses when backend is unavailable
function getFallbackResponse(payload) {
    if (payload.type === 'init') {
        return "Hi Explorer! A dust storm scrambled our air tanks. We need to fill them with the right mix of gases. Click on each tank and choose which gas it should contain. Remember: we need oxygen to breathe!";
    }
    
    if (payload.type === 'player' && payload.message) {
        return "I'm here to help! Try filling the tanks and click 'Check My Mix' to see how you're doing.";
    }
    
    if (payload.type === 'check') {
        const { context, result } = payload;
        
        if (result === 'perfect') {
            return "🎉 Beep boop! YOU DID IT, Explorer! The air mix is perfect. The habitat is safe and breathable!";
        }
        
        const { tanks, target, filled } = context;
        
        if (filled < TOTAL_TANKS) {
            return `You've only filled ${filled} out of ${TOTAL_TANKS} tanks. All tanks need to be filled!`;
        }
        
        // Find biggest difference
        const diffs = {
            O2: Math.abs(tanks.O2 - target.O2),
            N2: Math.abs(tanks.N2 - target.N2),
            Other: Math.abs(tanks.Other - target.Other)
        };
        
        if (diffs.O2 >= diffs.N2 && diffs.O2 >= diffs.Other) {
            if (tanks.O2 > target.O2) {
                return `Too much oxygen! You have ${tanks.O2} tanks (${tanks.O2 * 10}%), but we need exactly ${target.O2} tanks (${target.O2 * 10}%). Fire risk is high!`;
            } else {
                return `Not enough oxygen! You have ${tanks.O2} tanks (${tanks.O2 * 10}%), but we need ${target.O2} tanks (${target.O2 * 10}%). You'll get dizzy!`;
            }
        } else if (diffs.N2 >= diffs.Other) {
            if (tanks.N2 > target.N2) {
                return `Too much nitrogen! You have ${tanks.N2} tanks (${tanks.N2 * 10}%), but we need ${target.N2} tanks (${target.N2 * 10}%).`;
            } else {
                return `Not enough nitrogen! You have ${tanks.N2} tanks (${tanks.N2 * 10}%), but we need ${target.N2} tanks (${target.N2 * 10}%). Pressure will be too low!`;
            }
        } else {
            if (tanks.Other > target.Other) {
                return `Too many other gases! You have ${tanks.Other} tanks (${tanks.Other * 10}%), but we only need ${target.Other} tank (${target.Other * 10}%).`;
            } else {
                return `Not enough other gases! You have ${tanks.Other} tanks (${tanks.Other * 10}%), but we need ${target.Other} tank (${target.Other * 10}%).`;
            }
        }
    }
    
    return "Keep trying, Explorer! You're learning!";
}

// Player sends message
function sendPlayerMessage() {
    const message = playerInput.value.trim();
    if (!message) return;
    
    addPlayerMessage(message);
    playerInput.value = '';
    
    sendMessageToRalf({
        type: 'player',
        message: message,
        context: {
            tanks: {
                O2: tanks.filter(t => t === 'O2').length,
                N2: tanks.filter(t => t === 'N2').length,
                Other: tanks.filter(t => t === 'Other').length
            }
        }
    });
}

// Clear conversation history
async function clearConversation() {
    const API_BASE = window.location.origin;
    
    try {
        await fetch(`${API_BASE}/clear-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId })
        });
        
        // Clear chat UI
        chatMessages.innerHTML = '';
        
        // Restart with scenario intro
        sendMessageToRalf({ type: 'init' });
        
    } catch (error) {
        console.error('Error clearing history:', error);
        addRalfMessage("Beep boop... having trouble clearing my memory. But let's keep going!");
    }
}

// Event listeners
confirmBtn.addEventListener('click', checkMix);
resetBtn.addEventListener('click', resetTanks);
sendBtn.addEventListener('click', sendPlayerMessage);
clearChatBtn.addEventListener('click', clearConversation);
playerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendPlayerMessage();
    }
});

// Transition to Phase 2: Emergency Mode (5 tanks)
function startPhaseTwo() {
    currentPhase = 2;
    totalTanks = 5;
    // Primary target for UI/safety; validation accepts 1-3-1 or 1-4-0
    targetMix = { O2: 1, N2: 3, Other: 1 };
    isGameWon = false;
    confirmBtn.textContent = 'Check My Mix';
    confirmBtn.style.backgroundColor = '';
    tanks = Array(totalTanks).fill('empty');
    initTanks();
    updateDisplay();
    if (nextChallengeBtn) nextChallengeBtn.style.display = 'none';
    // Notify R.A.L.F.
    sendMessageToRalf({ type: 'event', event: 'phase2_start' });
}

if (nextChallengeBtn) {
    nextChallengeBtn.addEventListener('click', startPhaseTwo);
}

// Initialize
initTanks();
updateDisplay();

// Initial R.A.L.F. message
setTimeout(() => {
    sendMessageToRalf({ type: 'init' });
}, 500);
