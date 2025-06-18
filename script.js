let money = 1000;
const symbols = ["🍒", "🍋", "🍉", "⭐", "💎", "🔔", "🍀"];
let username = '';

const winSound = document.getElementById("winSound");
const jackpotSound = document.getElementById("jackpotSound");
const spinSound = document.getElementById("spinSound");
const bgMusic = document.getElementById("bgMusic");

document.getElementById("startBtn").addEventListener("click", saveUser);
document.getElementById("spinBtn").addEventListener("click", spin);

function saveUser() {
    username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter your name!");
        return;
    }
    document.getElementById("welcomeMessage").textContent = `Welcome, ${username}!`;
    document.getElementById("casino").classList.remove("hidden");
    bgMusic.volume = 0.2;
    bgMusic.play();
    updateMoney();
}

function spin() {
    if (money < 10) {
        alert("You're out of money! Reload the page to start over.");
        return;
    }

    money -= 10;
    updateMoney();

    spinSound.play();

    let slot1 = randomSymbol();
    let slot2 = randomSymbol();
    let slot3 = randomSymbol();

    document.getElementById("slots").textContent = `${slot1} ${slot2} ${slot3}`;

    let resultText = "";

    if (slot1 === slot2 && slot2 === slot3) {
        let winnings = slot1 === "💎" ? 2000 : 500;
        money += winnings;
        resultText = `🎉 JACKPOT! You won $${winnings}! 🎉`;
        jackpotSound.play();
        launchConfetti();
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        money += 100;
        resultText = "😊 Nice! You won $100.";
        winSound.play();
    } else {
        resultText = "😞 No luck. Try again!";
    }

    updateMoney();
    document.getElementById("result").textContent = resultText;
    addHistory(slot1, slot2, slot3, resultText);
}

function updateMoney() {
    document.getElementById("moneyDisplay").textContent = `💰 Money: $${money}`;
}

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function addHistory(s1, s2, s3, result) {
    const li = document.createElement("li");
    li.textContent = `${s1} ${s2} ${s3} - ${result}`;
    const historyList = document.getElementById("historyList");
    historyList.prepend(li);
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function launchConfetti() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}
