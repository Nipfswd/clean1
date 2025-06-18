let player = {
    name: '',
    money: 1000,
    vip: 1,
    avatar: '🐯'
};

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("resetBtn").addEventListener("click", resetAccount);
document.getElementById("spinBtn").addEventListener("click", spinSlots);
document.querySelectorAll(".gameBtn").forEach(btn => {
    btn.addEventListener("click", e => switchGame(e.target.dataset.game));
});
document.getElementById("buyMoneyBtn").addEventListener("click", buyMoney);
document.getElementById("buyVIPBtn").addEventListener("click", buyVIP);
document.querySelectorAll(".avatarChoice").forEach(choice => {
    choice.addEventListener("click", e => selectAvatar(e.target.textContent));
});

function startGame() {
    const username = document.getElementById("username").value.trim();
    if (username === '') {
        alert("Enter your name.");
        return;
    }
    player.name = username;
    saveData();
    loadInterface();
}

function loadInterface() {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("mainCasino").classList.remove("hidden");
    updateUI();
}

function updateUI() {
    document.getElementById("playerName").textContent = player.name;
    document.getElementById("moneyDisplay").textContent = player.money;
    document.getElementById("vipLevel").textContent = player.vip;
    document.getElementById("avatar").textContent = player.avatar;
}

function switchGame(game) {
    document.querySelectorAll(".game").forEach(g => g.classList.add("hidden"));
    document.getElementById(`${game}Game`).classList.remove("hidden");
}

function spinSlots() {
    if (player.money < 10) {
        alert("Not enough money!");
        return;
    }
    player.money -= 10;
    const symbols = ["🍒", "🍋", "🍉", "⭐", "💎", "🔔", "🍀"];
    const s1 = symbols[Math.floor(Math.random() * symbols.length)];
    const s2 = symbols[Math.floor(Math.random() * symbols.length)];
    const s3 = symbols[Math.floor(Math.random() * symbols.length)];
    document.getElementById("slotsDisplay").textContent = `${s1} ${s2} ${s3}`;

    let result = "No win.";
    if (s1 === s2 && s2 === s3) {
        const prize = 500 + (player.vip * 100);
        player.money += prize;
        result = `🎉 JACKPOT! Won $${prize}`;
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        const prize = 50 + (player.vip * 10);
        player.money += prize;
        result = `Small win: $${prize}`;
    }
    document.getElementById("slotsResult").textContent = result;
    updateUI();
    saveData();
}

function buyMoney() {
    player.money += 1000;
    document.getElementById("shopMessage").textContent = "Fake money purchase successful!";
    updateUI();
    saveData();
}

function buyVIP() {
    if (player.money >= 10000) {
        player.money -= 10000;
        player.vip++;
        document.getElementById("shopMessage").textContent = "VIP Level Up!";
        updateUI();
        saveData();
    } else {
        document.getElementById("shopMessage").textContent = "Not enough money for VIP.";
    }
}

function selectAvatar(avatar) {
    player.avatar = avatar;
    updateUI();
    saveData();
}

function saveData() {
    localStorage.setItem("casinoGOD", JSON.stringify(player));
}

function loadData() {
    const data = localStorage.getItem("casinoGOD");
    if (data) {
        player = JSON.parse(data);
        loadInterface();
    }
}

function resetAccount() {
    if (confirm("Are you sure you want to reset your entire account?")) {
        localStorage.removeItem("casinoGOD");
        location.reload();
    }
}

window.onload = loadData;
