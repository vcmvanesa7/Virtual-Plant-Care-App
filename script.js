
// 🌱 Virtual Plant Care App - JavaScript Logic
// Author: Vanesa Carrillo
// Description: This script manages a gamified virtual plant, 
// handling user data, plant growth, interactivity, badges, session tracking and care feedback.


// -----  SCREEN ELEMENTS (HTML sections of the app)
const welcomeScreen = document.getElementById("welcome-screen");
const loadingScreen = document.getElementById("loading-screen");
const mainScreen = document.getElementById("main-screen");

// -----  FORM ELEMENTS (User inputs to personalize the plant)
const form = document.getElementById("user-form");
const ownerNameInput = document.getElementById("ownerName");
const ownerAgeInput = document.getElementById("ownerAge");
const plantNameInput = document.getElementById("plantName");

// -----  DISPLAY ELEMENTS (Dynamic content shown on screen)
const userNameDisplay = document.getElementById("user-name");
const userAgeDisplay = document.getElementById("user-age");
const plantNameDisplay = document.getElementById("plant-name");
const interactionCountDisplay = document.getElementById("interaction-count");
const currentStageDisplay = document.getElementById("current-stage");
const plantImage = document.getElementById("plant-image");
const careMessage = document.getElementById("care-message");
const scoreDisplay = document.getElementById("score-display");

// -----  INTERACTION BUTTONS (Triggers for plant care actions)
const waterBtn = document.getElementById("btn-water");
const sunBtn = document.getElementById("btn-sun");
const fertilizerBtn = document.getElementById("btn-fertilizer");
const talkBtn = document.getElementById("btn-talk");
const resetBtn = document.getElementById("btn-reset");

// -----  GROWTH STAGES (Each stage updates image and name)
const stages = [
    { name: "Seed 🌰", image: "assets/img/0.png" },
    { name: "Sprout 🌿", image: "assets/img/1.png" },
    { name: "Tiny Plant 🌱", image: "assets/img/2.png" },
    { name: "Young Plant 🌼", image: "assets/img/3.png" },
    { name: "Growing Tree 🌳", image: "assets/img/4.png" },
    { name: "Big Tree 🌲", image: "assets/img/5.png" },
    { name: "Mature Tree 🌳✨", image: "assets/img/6.png" }
];

// -----  CARE MESSAGES (Shown randomly when a care action is done)
const messages = {
    water: [
        "💧 Water helps carry nutrients and gives strength.",
        "💦 Too much water can be harmful. Watch its little leaves.",
        "🌱 Some plants need water only when the soil is dry."
    ],
    sun: [
        "☀️ Sunlight activates photosynthesis.",
        "🌞 Some plants prefer indirect sun.",
        "🔆 Sunrays bring life to its leaves."
    ],
    fertilizer: [
        "🌿 Fertilizer provides nutrients for growth.",
        "🪴 Use only when needed.",
        "🌼 A good fertilizer helps roots and leaves."
    ],
    talk: [
        "🗣️ You spoke kindly!",
        "🎵 Your voice is energy.",
        "💚 Attention and care help plants thrive!"
    ]
};

// -----  BADGES SYSTEM (Milestones that reward user care)
const badges = [
    { count: 5, icon: "🥉", text: "Novice Gardener – First steps caring!" },
    { count: 10, icon: "💚", text: "Passionate Gardener – Your plant loves you!" },
    { count: 15, icon: "🥇", text: "Expert Gardener – You're growing a forest!" },
    { count: 20, icon: "🌟", text: "Master of Growth – Plant master level unlocked!" }
];

// -----  SCORE SYSTEM (Points that increase or decrease based on care quality)
let lastAction = "";
let actionsSinceFertilizer = 0;

function updateScore(change) {
    let score = parseInt(localStorage.getItem("score")) || 0;
    score += change;
    localStorage.setItem("score", score);

    // Actualiza visualmente el puntaje
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }

    console.log(`⭐ Score: ${score}`);
}


// -----  SADNESS STATE TIMER (Triggers sadness if ignored)
const TIME_TO_SADNESS = 10000; // 10 seconds of inactivity
let sadnessTimeout;

function startSadnessTimer() {
    clearTimeout(sadnessTimeout);
    sadnessTimeout = setTimeout(makePlantSad, TIME_TO_SADNESS);
}

function makePlantSad() {
    const count = parseInt(localStorage.getItem("interactions")) || 0;
    const maxStage = stages.length - 1;
    const currentStageIndex = Math.floor(count / 3);

    if (currentStageIndex >= maxStage) {
        plantImage.src = "assets/img/flowerSik.png";
        careMessage.textContent = "🌸😭 Your fully grown plant is feeling down...";
    } else {
        plantImage.src = getSadImage();
        careMessage.textContent = "😭 Your plant feels a bit lonely...";
    }
}

function getSadImage() {
    const count = parseInt(localStorage.getItem("interactions")) || 0;
    if (count < 3) return "assets/img/babySik.png";
    else if (count < 9) return "assets/img/midSik.png";
    else return "assets/img/oldSik.png";
}

// -----  LOAD USER DATA (Loads name, age, plant, interactions)
function loadUserData() {
    const name = localStorage.getItem("ownerName");
    const age = localStorage.getItem("ownerAge");
    const plant = localStorage.getItem("plantName");
    const count = parseInt(localStorage.getItem("interactions")) || 0;
    const score = parseInt(localStorage.getItem("score")) || 0; // 👈 nuevo

    userNameDisplay.textContent = name;
    userAgeDisplay.textContent = age;
    plantNameDisplay.textContent = plant;
    interactionCountDisplay.textContent = count;

    // 👇 muestra el score también
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }

    updateStage(count);
    updateProgressBar(count);
    renderBadges();
    startSadnessTimer();
}


// -----  RANDOM CARE MESSAGE (Feedback when user interacts)
function showCareMessage(type) {
    const options = messages[type];
    const random = options[Math.floor(Math.random() * options.length)];
    careMessage.textContent = random;
}

// -----  SOUND EFFECT (Each interaction plays a sound)
function playSound() {
    const audio = new Audio("assets/sounds/click.mp3");
    audio.play();
}

// -----  GROWTH STAGE UPDATER (Based on interaction count)
function updateStage(count) {
    let stageIndex = Math.floor(count / 3);
    if (stageIndex >= stages.length) stageIndex = stages.length - 1;

    const stage = stages[stageIndex];
    currentStageDisplay.textContent = stage.name;
    plantImage.src = stage.image;
}

// -----  PROGRESS BAR FUNCTION (Visual stage progress)
function updateProgressBar(count) {
    const maxPerStage = 3;
    const progressBar = document.getElementById("progress-bar");
    if (!progressBar) return;

    const clicksInCurrentStage = count % maxPerStage;
    const percent = (clicksInCurrentStage / maxPerStage) * 100;
    progressBar.style.width = percent + "%";
}

// -----  BADGE CHECKER (Checks if new badge is unlocked)
function checkBadge(count) {
    const unlocked = JSON.parse(localStorage.getItem("unlockedBadges")) || [];
    const newBadge = badges.find(b => b.count === count && !unlocked.includes(b.count));

    if (newBadge) {
        showBadgePopup(newBadge);
        unlocked.push(newBadge.count);
        localStorage.setItem("unlockedBadges", JSON.stringify(unlocked));
        renderBadges();
    }
}

// ----- BADGE RENDERER -----
// This function is responsible for displaying the badges the user has earned,
// as well as showing the progress toward locked badges.
//
// 1. Retrieves the user's interaction count from localStorage.
// 2. Gets the list of already unlocked badges.
// 3. Clears the current badge list display to prepare for re-rendering.
// 4. Iterates through all the predefined badges in the 'badges' array.
// 5. For each badge:
//    - Checks if the badge is already unlocked.
//    - Calculates how close the user is to unlocking it (as a percentage).
//    - Creates the visual structure for the badge, including title and progress bar.
//    - If unlocked, it shows the badge icon and description.
//    - If locked, it shows a lock icon and the badge description as "locked".
// 6. Appends the created badge element to the badge list in the DOM.

function renderBadges() {
    const badgeList = document.getElementById("badge-list");
    if (!badgeList) return;

    const count = parseInt(localStorage.getItem("interactions")) || 0;
    const unlocked = JSON.parse(localStorage.getItem("unlockedBadges")) || [];
    badgeList.innerHTML = "";

    badges.forEach(badge => {
        const isUnlocked = unlocked.includes(badge.count);
        const progress = Math.min((count / badge.count) * 100, 100);

        const li = document.createElement("li");
        li.className = "badge-container";

        const info = document.createElement("div");
        info.className = "badge-info";
        info.innerText = isUnlocked ? `${badge.icon} ${badge.text}` : `🔒 ${badge.text}`;

        const bar = document.createElement("div");
        bar.className = "progress-bar small";

        const fill = document.createElement("div");
        fill.className = "progress-fill";
        fill.style.width = `${progress}%`;

        bar.appendChild(fill);
        li.appendChild(info);
        li.appendChild(bar);

        badgeList.appendChild(li);
    });
}

// -----  BADGE POPUP (Appears when a badge is unlocked)
function showBadgePopup(badge) {
    const popup = document.getElementById("badge-popup");
    const icon = document.getElementById("badge-icon");
    const title = document.getElementById("badge-title");
    const description = document.getElementById("badge-description");

    if (popup && icon && title && description) {
        icon.textContent = badge.icon;
        title.textContent = "🎉 New Badge!";
        description.textContent = badge.text;

        popup.classList.remove("hidden");
        setTimeout(() => {
            popup.classList.add("hidden");
        }, 3000);
    }
}

// -----  SESSION STORAGE INTERACTION COUNTER
function updateSessionInteractionCount() {
    let sessionCount = parseInt(sessionStorage.getItem("sessionInteractionCount")) || 0;
    sessionCount++;
    sessionStorage.setItem("sessionInteractionCount", sessionCount);
    console.log(`🔍 Session Interactions: ${sessionCount}`);
}


// ----- HANDLE USER INTERACTION (Main care handler)
// This function processes each user interaction with the plant (watering, sunlight, fertilizer, talking).
// It enforces care rules:
// - Prevents repeating the same care action consecutively (except for "talk").
// - Restricts fertilizer use to once every 4 other actions to avoid overfeeding.
// Upon a valid interaction:
// - It updates the interaction count and growth stage.
// - Plays a sound and shows a random care message.
// - Updates the session count, progress bar, and awards badges if milestones are met.
// - Adds score points for good actions and deducts for incorrect ones.
// - Applies a gentle animation to the plant image as feedback.
// This function is central to the gamified plant experience, encouraging balanced and consistent care.

function handleInteraction(type) {
    let count = parseInt(localStorage.getItem("interactions")) || 0;

    // Rule: no watering twice in a row
    if (lastAction === type && type !== "talk") {
        updateScore(-1);
        careMessage.textContent = "⚠️ You can't repeat the same care action twice!";
        return;
    }

    // Rule: fertilizer only every 4 actions
    if (type === "fertilizer" && actionsSinceFertilizer < 4) {
        updateScore(-5);
        careMessage.textContent = "⚠️ You must care for the plant more before fertilizing!";
        return;
    }

    // Valid action
    count++;
    localStorage.setItem("interactions", count);
    interactionCountDisplay.textContent = count;
    updateStage(count);
    updateProgressBar(count);
    showCareMessage(type);
    checkBadge(count);
    playSound();
    startSadnessTimer();
    updateSessionInteractionCount();

    // Update score and logic rules
    updateScore(2);
    if (type === "fertilizer") actionsSinceFertilizer = 0;
    else actionsSinceFertilizer++;
    lastAction = type;

    plantImage.style.transform = "scale(1.05)";
    setTimeout(() => {
        plantImage.style.transform = "scale(1)";
    }, 150);
}

// -----  RESET APP (Clears everything and reloads)
function resetApp() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "index.html";
}

// -----  FORM SUBMISSION HANDLER -----
// This function listens for the submission of the plant setup form.
// It validates that the user's name only contains letters and spaces,
// that the age is a valid number, and that the plant name is not empty.
// Depending on the age range, it shows an inspirational message.
// Upon successful validation, it stores the data in localStorage,
// displays a loading screen, and then transitions to the main plant care screen.

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const ownerName = ownerNameInput.value.trim();
        const ownerAge = ownerAgeInput.value.trim();
        const plantName = plantNameInput.value.trim();

        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const ageRegex = /^[0-9]+$/;

        if (!nameRegex.test(ownerName)) {
            alert("Please enter a valid name. Only letters and spaces are allowed.");
            return;
        }

        if (!ageRegex.test(ownerAge)) {
            alert("Please enter a valid age. Only numbers are allowed.");
            return;
        }

        if (plantName.length === 0) {
            alert("Please give your little plant a name.");
            return;
        }

        const age = parseInt(ownerAge);
        let ageMessage = "";

        if (age <= 10) {
            ageMessage = "🌟 You’re a kind-hearted child! This plant will grow with you.";
        } else if (age <= 17) {
            ageMessage = "🌱 You’re a responsible and creative teenager! Your plant will witness your journey.";
        } else if (age >= 18) {
            ageMessage = "🌳 You’re a capable adult! This plant will be your companion in peace and achievements.";
        } else {
            ageMessage = "🌸 Age not recognized, but we know you have a beautiful soul.";
        }

        alert(ageMessage);

        localStorage.setItem("ownerName", ownerName);
        localStorage.setItem("ownerAge", ownerAge);
        localStorage.setItem("plantName", plantName);
        localStorage.setItem("interactions", 0);
        localStorage.setItem("unlockedBadges", JSON.stringify([]));
        localStorage.setItem("score", 0);

        console.log("👤 Owner Name:", ownerName);
        console.log("🎂 Owner Age:", ownerAge);
        console.log("🪴 Plant Name:", plantName);

        welcomeScreen.style.display = "none";
        loadingScreen.style.display = "block";

        setTimeout(() => {
            loadingScreen.style.display = "none";
            mainScreen.style.display = "block";
            document.querySelector(".container-care-plant").classList.remove("hidden");
            loadUserData();
        }, 2000);
    });
}

// -----  INITIALIZE APP ON LOAD -----
// This function runs when the page loads. It checks if there is saved data
// in localStorage. If so, it skips the welcome screen and shows the main interface.
window.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("ownerName");
    const popup = document.getElementById("badge-popup");
    if (popup) popup.classList.add("hidden");
    sessionStorage.setItem("sessionInteractionCount", 0);

    if (name) {
        welcomeScreen.style.display = "none";
        loadingScreen.style.display = "none";
        mainScreen.style.display = "block";
        document.querySelector(".container-care-plant").classList.remove("hidden");
        loadUserData();
    }
});

// -----  EVENT LISTENERS FOR CARE BUTTONS -----
if (waterBtn) waterBtn.addEventListener("click", () => handleInteraction("water"));
if (sunBtn) sunBtn.addEventListener("click", () => handleInteraction("sun"));
if (fertilizerBtn) fertilizerBtn.addEventListener("click", () => handleInteraction("fertilizer"));
if (talkBtn) talkBtn.addEventListener("click", () => handleInteraction("talk"));
if (resetBtn) resetBtn.addEventListener("click", resetApp);
