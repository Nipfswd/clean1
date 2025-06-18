"use strict";

// Player data & defaults
let player = {
  name: "",
  money: 1000,
  vip: 0,
  stats: {
    spins: 0,
    blackjackPlays: 0,
    roulettePlays: 0,
    totalSpent: 0,
    totalWon: 0,
  },
  achievements: {
    firstSpin: false,
    jackpot: false,
    vipMax: false,
  },
};

// Slot machine symbols
const symbols = ["🍒", "🍋", "🍉", "🍇", "⭐", "🍀", "7️⃣"];

// Cached DOM elements
const loginSection = document.getElementById("login");
const casinoSection = document.getElementById("casino");
const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const playerNameEl = document.getElementById("playerName");
const moneyEl = document.getElementById("money");
const vipLevelEl = document.getElementById("vipLevel");
const navButtons = document.querySelectorAll(".nav-btn");
const games = document.querySelectorAll(".game");

const spinBtn = document.getElementById("spinBtn");
const slotResultEl = document.getElementById("slotResult");

const reelInnerEls = [
  document.getElementById("reel1Inner"),
  document.getElementById("reel2Inner"),
  document.getElementById("reel3Inner"),
];

// Blackjack DOM
const dealBtn = document.getElementById("dealBtn");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
const playerCardsEl = document.getElementById("playerCards");
const dealerCardsEl = document.getElementById("dealerCards");
const playerTotalEl = document.getElementById("playerTotal");
const dealerTotalEl = document.getElementById("dealerTotal");
const bjResultEl = document.getElementById("bjResult");

// Roulette DOM
const rouletteButtons = document.querySelectorAll(".rouletteBet");
const rouletteResultEl = document.getElementById("rouletteResult");

// Shop DOM
const buyMoneyBtn = document.getElementById("buyMoney");
const buyVIPBtn = document.getElementById("buyVIP");
const shopMessageEl = document.getElementById("shopMessage");

// Stats DOM
const statsContentEl = document.getElementById("statsContent");

// Sounds
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");
const bgMusic = document.getElementById("bgMusic");

// Helper for money formatting
function formatMoney(num) {
  return num.toFixed(2);
}

// Save / Load
function saveGame() {
  localStorage.setItem("casinoPlayer", JSON.stringify(player));
  updateLeaderboard();
}

function loadGame() {
  const saved = localStorage.getItem("casinoPlayer");
  if (saved) {
    player = JSON.parse(saved);
  }
}

// Leaderboard update and render
function updateLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  // Check if player already in leaderboard - update or add
  const idx = leaderboard.findIndex((p) => p.name === player.name);
  if (idx >= 0) {
    leaderboard[idx].money = player.money;
  } else {
    leaderboard.push({ name: player.name, money: player.money });
  }
  leaderboard.sort((a, b) => b.money - a.money);
  leaderboard = leaderboard.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function renderLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const html = leaderboard
    .map(
      (entry, idx) =>
        `<p>#${idx + 1} <b>${entry.name}</b>: $${formatMoney(entry.money)}</p>`
    )
    .join("");
  statsContentEl.innerHTML =
    `<h4>🏆 Leaderboard</h4>` + html + `<hr />` + renderPlayerStatsHTML();
}

function renderPlayerStatsHTML() {
  return `<h4>Your Stats:</h4>
  <p>Spins Played: ${player.stats.spins}</p>
  <p>Blackjack Plays: ${player.stats.blackjackPlays}</p>
  <p>Roulette Plays: ${player.stats.roulettePlays}</p>
  <p>Total Money Spent: $${formatMoney(player.stats.totalSpent)}</p>
  <p>Total Money Won: $${formatMoney(player.stats.totalWon)}</p>
  <p>VIP Level: ${player.vip}</p>
  <h4>Achievements:</h4>
  <ul>
    ${Object.entries(player.achievements)
      .map(
        ([ach, unlocked]) =>
          `<li>${unlocked ? "✅" : "❌"} ${ach.replace(/([A-Z])/g, " $1")}</li>`
      )
      .join("")}
  </ul>`;
}

// Achievement trigger
function triggerAchievement(id) {
  if (player.achievements[id]) return; // Already unlocked
  player.achievements[id] = true;
  alert(`🎉 Achievement Unlocked: ${id.replace(/([A-Z])/g, " $1")}`);
  saveGame();
  renderLeaderboard();
}

// UI Updates
function updateUI() {
  playerNameEl.textContent = player.name;
  moneyEl.textContent = formatMoney(player.money);
  vipLevelEl.textContent = player.vip;
  renderLeaderboard();
}

// Navigation
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    navButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    games.forEach((game) => {
      game.classList.add("hidden");
      game.classList.remove("active");
    });
    const gameId = btn.dataset.game;
    document.getElementById(gameId).classList.remove("hidden");
    document.getElementById(gameId).classList.add("active");
  });
});

// ------------------ SLOT MACHINE ------------------

// Animate reels spinning
function spinReels() {
  return new Promise((resolve) => {
    const spinCount = 20;
    const reelHeight = 80;
    const results = [];

    reelInnerEls.forEach((reelInner, i) => {
      let sequenceHTML = "";
      for (let j = 0; j < spinCount; j++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        sequenceHTML += `<div style="height:${reelHeight}px; line-height:${reelHeight}px;">${symbol}</div>`;
      }
      const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      results.push(finalSymbol);
      sequenceHTML += `<div style="height:${reelHeight}px; line-height:${reelHeight}px;">${finalSymbol}</div>`;
      reelInner.innerHTML = sequenceHTML;
      reelInner.style.transition = "transform 2.5s cubic-bezier(0.22, 1, 0.36, 1)";
      reelInner.style.transform = `translateY(-${spinCount * reelHeight}px)`;
    });

    // Wait for animation to finish
    setTimeout(() => {
      reelInnerEls.forEach((reelInner) => {
        reelInner.style.transition = "";
        reelInner.style.transform = "translateY(0)";
        // Keep final symbol only:
        reelInner.innerHTML = `<div style="height:${reelHeight}px; line-height:${reelHeight}px; font-size: 3.5rem;">${reelInner.innerText.slice(-2)}</div>`;
      });
      resolve(results);
    }, 2600);
  });
}

spinBtn.addEventListener("click", async () => {
  if (player.money < 10) {
    alert("Not enough money to spin!");
    return;
  }
  player.money -= 10;
  player.stats.spins++;
  player.stats.totalSpent += 10;
  updateUI();
  spinSound.play();

  const results = await spinReels();

  let winAmount = 0;
  let message = "You lost! Try again!";

  if (results[0] === results[1] && results[1] === results[2]) {
    winAmount = 500 + player.vip * 50; // VIP bonus
    message = `🎉 JACKPOT! You won $${winAmount}!`;
    triggerAchievement("jackpot");
  } else if (new Set(results).size === 2) {
    winAmount = 50 + player.vip * 5;
    message = `Nice! Small win: $${winAmount}`;
  }

  player.money += winAmount;
  player.stats.totalWon += winAmount;

  if (winAmount > 0) winSound.play();

  slotResultEl.textContent = message;
  updateUI();
  saveGame();

  if (player.stats.spins === 1) {
    triggerAchievement("firstSpin");
  }
});

// ------------------ BLACKJACK ------------------

const deckSuits = ["♠", "♥", "♦", "♣"];
const deckRanks = [
  { rank: "A", value: 11 },
  { rank: "2", value: 2 },
  { rank: "3", value: 3 },
  { rank: "4", value: 4 },
  { rank: "5", value: 5 },
  { rank: "6", value: 6 },
  { rank: "7", value: 7 },
  { rank: "8", value: 8 },
  { rank: "9", value: 9 },
  { rank: "10", value: 10 },
  { rank: "J", value: 10 },
  { rank: "Q", value: 10 },
  { rank: "K", value: 10 },
];

let blackjackDeck = [];
let playerHand = [];
let dealerHand = [];
let blackjackInProgress = false;

function createDeck() {
  blackjackDeck = [];
  deckSuits.forEach((suit) => {
    deckRanks.forEach(({ rank, value }) => {
      blackjackDeck.push({ suit, rank, value });
    });
  });
}

function shuffleDeck() {
  for (let i = blackjackDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blackjackDeck[i], blackjackDeck[j]] = [blackjackDeck[j], blackjackDeck[i]];
  }
}

function calculateHandValue(hand) {
  let value = hand.reduce((sum, card) => sum + card.value, 0);
  let aceCount = hand.filter((c) => c.rank === "A").length;
  // Adjust for Aces
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

function displayCards(hand) {
  return hand.map((c) => `${c.rank}${c.suit}`).join(" ");
}

function resetBlackjack() {
  playerHand = [];
  dealerHand = [];
  blackjackInProgress = false;
  playerCardsEl.textContent = "";
  dealerCardsEl.textContent = "";
  playerTotalEl.textContent = "0";
  dealerTotalEl.textContent = "??";
  bjResultEl.textContent = "";
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealBtn.disabled = false;
}

function endBlackjack(resultMessage, won) {
  bjResultEl.textContent = resultMessage;
  blackjackInProgress = false;
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealBtn.disabled = false;

  if (won) {
    player.money += 100 + player.vip * 20;
    player.stats.totalWon += 100 + player.vip * 20;
    winSound.play();
  }

  updateUI();
  saveGame();
}

dealBtn.addEventListener("click", () => {
  if (player.money < 50) {
    alert("Not enough money to play Blackjack!");
    return;
  }
  player.money -= 50;
  player.stats.blackjackPlays++;
  player.stats.totalSpent += 50;
  updateUI();

  createDeck();
  shuffleDeck();
  resetBlackjack();

  // Initial cards
  playerHand.push(blackjackDeck.pop());
  dealerHand.push(blackjackDeck.pop());
  playerHand.push(blackjackDeck.pop());
  dealerHand.push(blackjackDeck.pop());

  playerCardsEl.textContent = displayCards(playerHand);
  dealerCardsEl.textContent = dealerHand[0].rank + dealerHand[0].suit + " ??";
  playerTotalEl.textContent = calculateHandValue(playerHand);
  dealerTotalEl.textContent = "??";

  blackjackInProgress = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
  dealBtn.disabled = true;
  bjResultEl.textContent = "";
});

hitBtn.addEventListener("click", () => {
  if (!blackjackInProgress) return;
  playerHand.push(blackjackDeck.pop());
  playerCardsEl.textContent = displayCards(playerHand);
  const total = calculateHandValue(playerHand);
  playerTotalEl.textContent = total;

  if (total > 21) {
    endBlackjack("Bust! You lose.", false);
  }
});

standBtn.addEventListener("click", () => {
  if (!blackjackInProgress) return;

  // Reveal dealer cards
  dealerCardsEl.textContent = displayCards(dealerHand);
  dealerTotalEl.textContent = calculateHandValue(dealerHand);

  // Dealer hits until 17+
  let dealerTotal = calculateHandValue(dealerHand);
  while (dealerTotal < 17) {
    dealerHand.push(blackjackDeck.pop());
    dealerTotal = calculateHandValue(dealerHand);
    dealerCardsEl.textContent = displayCards(dealerHand);
    dealerTotalEl.textContent = dealerTotal;
  }

  const playerTotal = calculateHandValue(playerHand);

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    endBlackjack("You win! 🎉", true);
  } else if (dealerTotal === playerTotal) {
    endBlackjack("Push (Tie).", false);
    player.money += 50; // Return bet
    updateUI();
    saveGame();
  } else {
    endBlackjack("Dealer wins. 😞", false);
  }
});

// ------------------ ROULETTE ------------------

rouletteButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (player.money < 100) {
      alert("Not enough money to bet!");
      return;
    }
    player.money -= 100;
    player.stats.roulettePlays++;
    player.stats.totalSpent += 100;
    updateUI();

    const bet = btn.dataset.bet; // "red" or "black"

    // Simulate roulette spin
    const spinResult = Math.random() < 0.5 ? "red" : "black";

    if (bet === spinResult) {
      const winAmount = 200 + player.vip * 20;
      player.money += winAmount;
      player.stats.totalWon += winAmount;
      rouletteResultEl.textContent = `You won $${winAmount}! The ball landed on ${spinResult.toUpperCase()}. 🎉`;
      winSound.play();
    } else {
      rouletteResultEl.textContent = `You lost. The ball landed on ${spinResult.toUpperCase()}. Try again!`;
    }

    updateUI();
    saveGame();
  });
});

// ------------------ SHOP ------------------

buyMoneyBtn.addEventListener("click", () => {
  player.money += 1000;
  shopMessageEl.textContent = "You've been gifted $1000! 💵";
  updateUI();
  saveGame();
});

buyVIPBtn.addEventListener("click", () => {
  if (player.money < 10000) {
    shopMessageEl.textContent = "You need $10,000 to upgrade VIP.";
    return;
  }
  if (player.vip >= 10) {
    shopMessageEl.textContent = "VIP Max Level reached! ✨";
    triggerAchievement("vipMax");
    return;
  }
  player.money -= 10000;
  player.vip++;
  shopMessageEl.textContent = `Congratulations! VIP Level upgraded to ${player.vip}!`;
  updateUI();
  saveGame();
});

// ------------------ LOGIN & RESET ------------------

startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("Please enter your name to start.");
    return;
  }
  player.name = name;
  loadGame();
  loginSection.classList.add("hidden");
  casinoSection.classList.remove("hidden");
  updateUI();
  bgMusic.volume = 0.2;
  bgMusic.play();
  renderLeaderboard();
});

resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your profile?")) {
    localStorage.removeItem("casinoPlayer");
    localStorage.removeItem("leaderboard");
    location.reload();
  }
});

// On page load
window.addEventListener("load", () => {
  updateUI();
  renderLeaderboard();
});
