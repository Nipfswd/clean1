// Simple Casino Logic

let money = 1000;
const symbols = ["🍒", "🍋", "🍉", "⭐", "💎", "🔔"];

document.getElementById("startBtn").addEventListener("click", saveUser);
document.getElementById("spinBtn").addEventListener("click", spin);

function saveUser() {
    const username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter your name!");
        return;
    }
    document.getElementById("welcomeMessage").textContent = `Welcome, ${username}!`;
    document.getElementById("casino").classList.remove("hidden");
}

function spin() {
    if (money < 10) {
        alert("You're out of money! Reload the page to start over.");
        return;
    }

    money -= 10;
    updateMoney();

    let slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    let slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    let slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    document.getElementById("slots").textContent = `${slot1} ${slot2} ${slot3}`;

    let resultText = "";

    if (slot1 === slot2 && slot2 === slot3) {
        let winnings = 300;
        if (slot1 === "💎") winnings = 1000; // jackpot for diamonds
        money += winnings;
        resultText = `🎉 JACKPOT! You won $${winnings}! 🎉`;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        money += 50;
        resultText = "😊 Small win! You won $50.";
    } else {
        resultText = "😞 No luck. Try again!";
    }

    updateMoney();
    document.getElementById("result").textContent = resultText;
}

function updateMoney() {
    document.getElementById("moneyDisplay").textContent = `💰 Money: $${money}`;
}
