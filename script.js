// CONFIGURATION
const PASSCODE = "love"; // CHANGE THIS
const START_DATE = new Date("2026-02-07T00:00:00"); // Rose Day

// DATA: The Surprises
const levels = [
    { date: "2026-02-07", title: "ROSE DAY", icon: "🌹", msg: "I sent this meow to get flowers for you", anim: "cat" },
    { date: "2026-02-08", title: "PROPOSE DAY", icon: "💍", msg: "Emo Dogo brings you the RING", anim: "dog" },
    { date: "2026-02-09", title: "CHOCOLATE DAY", icon: "🍫", msg: "Coupon: Good for ONE Silk Oreo. Redeemable anytime.", anim: "chocolate" },
    { date: "2026-02-10", title: "TEDDY DAY", icon: "🧸", msg: "Sending you a virtual squeeze. I'm your permanent teddy bear.", anim: "rain" },
    { date: "2026-02-11", title: "PROMISE DAY", icon: "🤝", msg: "Pawwmiz 🐾.", anim: "promise" },
    { date: "2026-02-12", title: "HUG DAY", icon: "🤗", msg: "Extreme tigh hug for my girl.", anim: "hug" },
    { date: "2026-02-13", title: "KISS DAY", icon: "💋", msg: "Muah! Can't wait to see you.", anim: "kiss" },
    { date: "2026-02-14", title: "VALENTINE'S", icon: "💖", msg: "FRICK YOU.", anim: "finale" }
];

// STATE
let currentLevelIndex = 0;
let passwordAttempts = 0;

// --- STEP 1: LOGIN ---
function checkPassword() {
    const input = document.getElementById("password-input").value.toLowerCase();
    const errorMsg = document.getElementById("error-msg");

    if (input === PASSCODE) {
        // Play Music on first interaction
        const music = document.getElementById("bg-music");
        if (music && music.paused) {
            music.volume = 0.5;
            music.play().catch(console.error);
        }

        document.getElementById("login-screen").classList.add("hidden");
        playIntro();
    } else {
        passwordAttempts++;
        if (passwordAttempts === 1) {
            errorMsg.innerText = "Wrong password.";
        } else if (passwordAttempts === 2) {
            errorMsg.innerText = "Are you sure you are Ankita?";
        } else if (passwordAttempts >= 3) {
            errorMsg.innerText = "Okay, I'm locking the gift for 5 minutes.";
            // Optional: You could actually disable the input here
        }
    }
}



// --- STEP 3: INTRO ---
function playIntro() {
    document.getElementById("intro-screen").classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("intro-screen").classList.add("hidden");
        document.getElementById("game-screen").classList.remove("hidden");
        initGame();
    }, 5000); // 5s intro duration
}



// --- STEP 4: GAME LOGIC ---
function initGame() {
    const board = document.getElementById("board");
    const today = new Date();
    // const today = new Date("2026-02-10"); // UNCOMMENT TO TEST DIFFERENT DATES

    // 1. Calculate active level based on date
    let maxLevel = -1;

    // Check Dev Config
    if (typeof CONFIG !== 'undefined' && CONFIG.FORCE_ALL_UNLOCKED) {
        maxLevel = levels.length - 1;
        console.log("DEV MODE: All levels unlocked");
    } else {
        levels.forEach((level, index) => {
            const levelDate = new Date(level.date);
            if (today >= levelDate) maxLevel = index;
        });
    }

    currentLevelIndex = maxLevel;

    // 2. Render Board
    board.innerHTML = '<div id="player-token">👑</div>'; // Reset
    const finaleContainer = document.getElementById("finale-container");
    finaleContainer.innerHTML = "";

    levels.forEach((level, index) => {
        // First 7 go to grid (0-6), Last one (7) goes to finale
        if (index < 7) {
            const step = document.createElement("div");
            step.classList.add("step");
            step.id = `step-${index}`;

            if (index <= maxLevel) {
                step.classList.add("unlocked");
                step.onclick = () => playCinema(index);
                // Check for custom grid image
                const content = level.gridImage ?
                    `<img src="${level.gridImage}" style="width:50px;height:50px;object-fit:cover;border-radius:5px;">` :
                    `<div style="font-size:20px">${level.icon}</div>`;
                step.innerHTML = `${content}<div style="margin-top:5px">${level.date.slice(8)}</div>`;
            } else {
                step.classList.add("locked");
                step.innerHTML = `<div>🔒</div><div>${level.date.slice(8)}</div>`;
            }
            board.appendChild(step);
        } else {
            // FINALE BUTTON
            const btn = document.createElement("button");
            btn.className = "finale-btn blink"; // Added blink class
            btn.id = `step-${index}`; // ID for token targeting
            if (index <= maxLevel) {
                btn.onclick = () => playCinema(index);
                btn.innerHTML = `⚠️ FINALE ⚠️`; // Changed text
            } else {
                btn.classList.remove("blink"); // Don't blink if locked
                btn.style.opacity = "0.5";
                btn.innerHTML = "🔒 LOCKED 🔒";
            }
            finaleContainer.appendChild(btn);
        }
    });

    // 3. Move Token Immediately
    moveToken(maxLevel);
}

function moveToken(index) {
    const token = document.getElementById("player-token");
    const target = document.getElementById(`step-${index}`);

    if (target) {
        // Adjust logic for button vs card
        let offsetTop = target.offsetTop;
        let offsetLeft = target.offsetLeft;

        // precise centering
        let centerX = offsetLeft + (target.offsetWidth / 2) - 15; // 15 is half token width
        let centerY = offsetTop + (target.offsetHeight / 2) - 15;

        // If it's the finale button (index 7), it might be inside a different container offset
        if (index === 7) {
            // For the finale button which is outside #board, we might need global coords or adjust relative to board? 
            // The token is inside #board (relative). The finale button is outside.
            // Move token to common parent or hide token for finale? 
            // SIMPLER: Hide token for Finale, just highlight button.
            token.style.opacity = "0";
        } else {
            token.style.opacity = "1";
            token.style.left = centerX + "px";
            token.style.top = centerY + "px";
        }
    }
}

// --- STEP 5: CINEMA ---
function playCinema(index) {
    const modal = document.getElementById("cinema-modal");
    const stage = document.getElementById("animation-stage");
    const msgBox = document.getElementById("message-box");
    const data = levels[index];

    modal.classList.add("active"); // Trigger scale animation
    modal.classList.remove("hidden");

    msgBox.classList.add("hidden");
    stage.innerHTML = ""; // Clear

    // Animation Switch
    if (data.anim === "cat") {
        // Play local video
        stage.innerHTML = `<video src="Flower day cat.mp4" autoplay playsinline id="cat-video"></video>`;
        document.getElementById("cat-video").onended = () => {
            createRain(modal, "🌹");
            createRain(modal, "🌷");
            createRain(modal, "🌻");
            createRain(modal, "🌼"); // Rain flowers on the full modal
        };
    } else if (data.anim === "dog") {
        // Play dog propose video
        stage.innerHTML = `<video src="Dog_Proposes_with_Ring_Video.mp4" autoplay playsinline id="dog-video"></video>`;
        document.getElementById("dog-video").onended = () => {
            createRain(modal, "💍");
            createRain(modal, "💖");
            createRain(modal, "✨");
        };
    } else if (data.anim === "chocolate") {
        playChocolateAnimation(stage, msgBox, data);
        return; // Early return, message shown in animation
    } else if (data.anim === "promise") {
        playPromiseAnimation(stage, msgBox, data);
        return; // Early return, message shown in animation
    } else if (data.anim === "hug") {
        playHugAnimation(stage, msgBox, data);
        return; // Early return, message shown in animation
    } else if (data.anim === "kiss") {
        playKissAnimation(stage, msgBox, data);
        return; // Early return, message shown in animation
    } else if (data.anim === "rain") {
        createRain(stage, data.icon); // Keep existing rain inside stage for others
    } else {
        stage.innerHTML = `<h1 style="margin-top:0; font-size:60px; animation:bounce 1s infinite">${data.icon}</h1>`;
    }

    // Show Message after delay
    setTimeout(() => {
        msgBox.classList.remove("hidden");
        document.getElementById("modal-title").innerText = data.title;
        document.getElementById("modal-body").innerText = data.msg;
    }, 1500); // Slightly faster text reveal
}

function createRain(container, emoji) {
    const isFullScreen = container.id === "cinema-modal";
    const amount = isFullScreen ? 50 : 15; // More drops for full screen

    // Clear previous rain if any (optional, keeps it clean)
    // container.querySelectorAll('.rain-drop').forEach(e => e.remove());

    for (let i = 0; i < amount; i++) {
        const drop = document.createElement("div");
        drop.innerText = emoji;
        drop.classList.add("rain-drop");
        drop.style.position = "absolute";
        drop.style.left = Math.random() * 100 + "%";
        drop.style.top = isFullScreen ? "-50px" : "-20px"; // Start above
        drop.style.animation = `fall ${Math.random() * 2 + 2}s linear infinite`; // Slower fall (2-4s)
        drop.style.fontSize = Math.random() * 20 + 20 + "px"; // Random size 20-40px
        drop.style.opacity = Math.random() * 0.5 + 0.5;
        drop.style.zIndex = "10"; // Behind message box which is usually z-index 100 but modal is 100.
        container.appendChild(drop);
    }

    // Ensure style exists
    if (!document.getElementById("rain-style")) {
        const style = document.createElement('style');
        style.id = "rain-style";
        style.innerHTML = `@keyframes fall { to { transform: translateY(110vh); } }`;
        document.head.appendChild(style);
    }
}

// --- DAY 3: CHOCOLATE ANIMATION ---
function playChocolateAnimation(stage, msgBox, data) {
    // Play chocolate video
    stage.innerHTML = `<video src="chocolate day video.mp4" autoplay playsinline id="chocolate-video" style="width:100%; height:100%; object-fit:contain; max-height:80vh;"></video>`;
    document.getElementById("chocolate-video").onended = () => {
        unleashChocolateBlast(stage);
        setTimeout(() => {
            msgBox.classList.remove("hidden");
            document.getElementById("modal-title").innerText = data.title;
            document.getElementById("modal-body").innerText = data.msg;
        }, 2000);
    };
}

function unleashChocolateBlast(container) {
    const treats = ["🍫", "🍬", "🍭", "🍩", "🍪", "🧁", "🎂", "🍰", "🍦", "🍨"];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const treat = document.createElement("div");
            treat.innerText = treats[Math.floor(Math.random() * treats.length)];
            treat.style.position = "absolute";
            treat.style.left = "50%";
            treat.style.top = "50%";
            treat.style.fontSize = Math.random() * 30 + 30 + "px";
            treat.style.transform = "translate(-50%, -50%)";
            treat.style.zIndex = "1000";
            treat.style.pointerEvents = "none";

            const angle = Math.random() * 360;
            const distance = Math.random() * 300 + 100;
            const endX = Math.cos(angle * Math.PI / 180) * distance;
            const endY = Math.sin(angle * Math.PI / 180) * distance;

            treat.style.transition = `all ${Math.random() * 0.5 + 0.8}s ease-out`;
            container.appendChild(treat);

            setTimeout(() => {
                treat.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${Math.random() * 720 - 360}deg)`;
                treat.style.opacity = "0";
            }, 10);

            setTimeout(() => treat.remove(), 1500);
        }, i * 50);
    }
}

// --- DAY 5: PROMISE ANIMATION ---
function playPromiseAnimation(stage, msgBox, data) {
    stage.innerHTML = `
        <div style="position:relative; width:100%; height:400px;">
            <div id="left-hand" style="position:absolute; left:-100px; top:50%; transform:translateY(-50%); font-size:80px; transition:left 2s ease-out;">🤙</div>
            <div id="right-hand" style="position:absolute; right:-100px; top:50%; transform:translateY(-50%) scaleX(-1); font-size:80px; transition:right 2s ease-out;">🤙</div>
            <div id="promise-scroll" style="position:absolute; top:55%; left:50%; transform:translate(-50%, -50%) scale(0); width:80%; max-width:400px; background:linear-gradient(to bottom, #f4e4c1, #e8d4a8); border:3px solid #8b7355; border-radius:10px; padding:20px; opacity:0; transition:all 0.5s ease-out; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                <h3 style="color:#5d4037; text-align:center; margin-bottom:15px; font-family:'Courier Prime', monospace;">📜 Promise Contract 📜</h3>
                <div style="color:#3e2723; font-family:'Courier Prime', monospace; font-size:14px; line-height:1.8;">
                    <p>✓ I promise to always make you smile</p>
                    <p>✓ I promise to be your Player 2 forever</p>
                    <p>✓ I promise to debug your life (with AI ovio)</p>
                    <p>✓ I promise to love you more each day</p>
                </div>
                <div style="text-align:center; margin-top:15px; color:#8b7355; font-style:italic;">~ Sealed with love ~</div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById("left-hand").style.left = "calc(50% - 60px)";
        document.getElementById("right-hand").style.right = "calc(50% - 60px)";
    }, 300);

    setTimeout(() => {
        const scroll = document.getElementById("promise-scroll");
        scroll.style.transform = "translate(-50%, -50%) scale(1)";
        scroll.style.opacity = "1";
    }, 2500);

    setTimeout(() => {
        msgBox.classList.remove("hidden");
        document.getElementById("modal-title").innerText = data.title;
        document.getElementById("modal-body").innerText = data.msg;
    }, 4000);
}

// --- DAY 6: HUG ANIMATION ---
function playHugAnimation(stage, msgBox, data) {
    stage.innerHTML = `
        <div style="text-align:center;">
            <h1 style="color:var(--baby-pink); margin-bottom:30px;">🤗 Sending Virtual Hug...</h1>
            <div id="progress-container" style="width:80%; max-width:400px; margin:0 auto; background:#333; border:2px solid var(--baby-blue); border-radius:10px; overflow:hidden; height:40px; position:relative;">
                <div id="progress-bar" style="height:100%; background:linear-gradient(90deg, var(--baby-pink), var(--baby-blue)); width:0%; display:flex; align-items:center; justify-content:center;">
                    <span id="progress-text" style="position:absolute; left:50%; transform:translateX(-50%); color:#fff; font-weight:bold; z-index:10;">0%</span>
                </div>
            </div>
        </div>
    `;

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    let progress = 0;

    const updateProgress = (target, speed) => {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (progress < target) {
                    progress++;
                    progressBar.style.width = progress + "%";
                    progressText.innerText = progress + "%";
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    };

    // 0% to 50%
    updateProgress(50, 30)
        .then(() => new Promise(resolve => setTimeout(resolve, 1500))) // Pause at 50%
        .then(() => updateProgress(99, 20)) // 50% to 99%
        .then(() => new Promise(resolve => setTimeout(resolve, 1000))) // Pause at 99%
        .then(() => updateProgress(100, 50)) // 99% to 100%
        .then(() => {
            progressText.innerText = "100% - HUG DELIVERED! 🤗";
            setTimeout(() => {
                shakeScreen();
                vibrateDevice();
                msgBox.classList.remove("hidden");
                document.getElementById("modal-title").innerText = data.title;
                document.getElementById("modal-body").innerText = data.msg;
            }, 500);
        });
}

function shakeScreen() {
    const modal = document.getElementById("cinema-modal");
    modal.style.animation = "shake 0.5s";
    setTimeout(() => {
        modal.style.animation = "";
    }, 500);

    // Add shake keyframes if not exists
    if (!document.getElementById("shake-style")) {
        const style = document.createElement('style');
        style.id = "shake-style";
        style.innerHTML = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function vibrateDevice() {
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
}

// --- DAY 7: KISS ANIMATION ---
function playKissAnimation(stage, msgBox, data) {
    stage.innerHTML = `
        <div style="text-align:center;">
            <h1 style="color:var(--baby-pink); margin-bottom:20px;">💋 Incoming Kiss Attack! 💋</h1>
            <div id="kiss-message" style="color:var(--baby-blue); font-size:16px;">Get ready...</div>
        </div>
    `;

    const modal = document.getElementById("cinema-modal");
    let kissCount = 0;
    const maxKisses = 50;

    const kissInterval = setInterval(() => {
        if (kissCount >= maxKisses) {
            clearInterval(kissInterval);
            setTimeout(() => {
                msgBox.classList.remove("hidden");
                document.getElementById("modal-title").innerText = data.title;
                document.getElementById("modal-body").innerText = data.msg;
            }, 1000);
            return;
        }

        const kiss = document.createElement("div");
        kiss.innerText = "💋";
        kiss.style.position = "absolute";
        kiss.style.left = Math.random() * 90 + 5 + "%";
        kiss.style.top = Math.random() * 90 + 5 + "%";
        kiss.style.fontSize = Math.random() * 40 + 40 + "px";
        kiss.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
        kiss.style.zIndex = "50";
        kiss.style.pointerEvents = "none";
        kiss.style.transition = "transform 0.3s ease-out";

        modal.appendChild(kiss);

        setTimeout(() => {
            kiss.style.transform = `rotate(${Math.random() * 360}deg) scale(1)`;
        }, 10);

        kissCount++;

        const kissMessage = document.getElementById("kiss-message");
        if (kissMessage) {
            kissMessage.innerText = `Kisses sent: ${kissCount}/${maxKisses}`;
        }
    }, 500); // Every 0.5 seconds
}

function closeCinema() {
    const modal = document.getElementById("cinema-modal");
    modal.classList.remove("active");

    // Clear any kiss marks
    modal.querySelectorAll('div').forEach(el => {
        if (el.innerText === "💋") el.remove();
    });

    setTimeout(() => {
        modal.classList.add("hidden");

        // Stop video if playing
        const video = modal.querySelector("video");
        if (video) video.pause();
    }, 300); // wait for scale down anim
}
