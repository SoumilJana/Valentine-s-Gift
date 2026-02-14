// ========================================
// VALENTINE'S DAY FINALE - TRAP EXPERIENCE
// ========================================

/**
 * Main orchestrator for the 4-phase finale experience:
 * Phase 1: Trap Button (Yes -> NO on hover)
 * Phase 2: Gaslight Alerts
 * Phase 3: Matrix Crash Screen
 * Phase 4: Redemption Video
 */
function playFinaleExperience(stage, msgBox, data) {
    let trapCount = 0;
    let isTrapped = false;

    // Start with Phase 1
    createTrapButton();

    // === PHASE 1: THE TRAP BUTTON ===
    function createTrapButton() {
        stage.innerHTML = `
            <div class="trap-button-container">
                <h1 style="color: var(--baby-pink); text-align: center; margin-bottom: 40px; font-size: 24px; line-height: 1.4; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    DO YOU WANT TO BE MY<br>FOREVER VALENTINE????
                </h1>
                <button id="trap-btn" class="trap-button">YES</button>
            </div>
        `;

        const btn = document.getElementById("trap-btn");

        // Desktop: Hover handlers
        btn.addEventListener("mouseenter", () => {
            isTrapped = true;
            btn.textContent = "NO";
            btn.classList.add("trapped");
        });

        btn.addEventListener("mouseleave", () => {
            isTrapped = false;
            btn.textContent = "YES";
            btn.classList.remove("trapped");
        });

        // Mobile: Touch handler (swap on first touch, click on second)
        let touchSwapped = false;
        btn.addEventListener("touchstart", (e) => {
            if (!touchSwapped) {
                e.preventDefault(); // Prevent immediate click
                isTrapped = true;
                btn.textContent = "NO";
                btn.classList.add("trapped");
                touchSwapped = true;
            }
        });

        // Click handler (works for both desktop and mobile)
        btn.addEventListener("click", () => {
            if (isTrapped || touchSwapped) {
                trapCount++;

                if (trapCount === 1) {
                    showGaslightAlerts();
                } else if (trapCount >= 2) {
                    triggerCrashScreen();
                }
            }
        });
    }

    // === PHASE 2: THE GASLIGHT ===
    function showGaslightAlerts() {
        // First message
        showRetroMessage("You said no!?", () => {
            // Second message
            showRetroMessage("One more chance.", () => {
                // Reset button state and recreate for second attempt
                createTrapButton();
            });
        });
    }

    // Show styled on-screen message box
    function showRetroMessage(message, onClose) {
        stage.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px;">
                <div class="retro-box" style="max-width: 500px; animation: fadeIn 0.3s;">
                    <h2 style="color: var(--baby-pink); margin-bottom: 30px; font-size: 20px; line-height: 1.5;">
                        ${message}
                    </h2>
                    <button id="continue-btn" style="background: var(--baby-blue); border: 3px solid var(--gold); color: #2E1A47; padding: 15px 40px; font-size: 16px; cursor: pointer; font-family: inherit; width: auto;">
                        CONTINUE
                    </button>
                </div>
            </div>
        `;

        document.getElementById("continue-btn").addEventListener("click", onClose);
    }

    // === PHASE 3: THE CRASH ===
    function triggerCrashScreen() {
        // Show "Ok bye" message first
        showRetroMessage("Ok bye", () => {
            // Create crash overlay
            setTimeout(() => {
                const crashDiv = document.createElement("div");
                crashDiv.className = "crash-overlay matrix";
                crashDiv.innerHTML = `
                    <div class="matrix-rain" id="matrix-container"></div>
                    <div class="matrix-glitch-text">
                        <div style="margin-bottom: 30px; font-size: 72px;">⚠️</div>
                        <div>SYSTEM ERROR</div>
                        <div style="margin-top: 20px; font-size: 24px;">ROMANCE.EXE HAS STOPPED WORKING</div>
                        <div style="margin-top: 40px; font-size: 16px; opacity: 0.7;">REDIRECTING TO RECOVERY MODE...</div>
                    </div>
                `;
                document.body.appendChild(crashDiv);

                // Create Matrix rain effect
                createMatrixRain();

                // Fade out after 4 seconds
                setTimeout(() => {
                    crashDiv.classList.add("fade-out");

                    // Remove and start Phase 4
                    setTimeout(() => {
                        crashDiv.remove();
                        playRedemptionVideo();
                    }, 1000); // Wait for fade-out animation
                }, 4000);
            }, 300);
        });
    }

    // Create falling Matrix characters
    function createMatrixRain() {
        const container = document.getElementById("matrix-container");
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
        const columnCount = 25;

        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement("div");
            column.className = "matrix-column";
            column.style.left = (i * (100 / columnCount)) + "%";
            column.style.animationDuration = (Math.random() * 3 + 2) + "s";
            column.style.animationDelay = (Math.random() * 2) + "s";

            // Random characters
            let text = "";
            for (let j = 0; j < 20; j++) {
                text += characters.charAt(Math.floor(Math.random() * characters.length)) + "<br>";
            }
            column.innerHTML = text;

            container.appendChild(column);
        }
    }

    // === PHASE 4: THE REDEMPTION ===
    function playRedemptionVideo() {
        stage.innerHTML = `
            <video 
                src="Just Kidding.mp4" 
                autoplay 
                playsinline 
                controls
                id="redemption-video"
                style="width:100%; height:100%; object-fit:contain; max-height:80vh;"
            >
                Your browser doesn't support video playback.
            </video>
        `;

        // Fallback message if video fails to load
        const video = document.getElementById("redemption-video");
        video.onerror = () => {
            stage.innerHTML = `
                <div style="text-align:center; padding:40px;">
                    <h1 style="color:var(--baby-pink); font-size:48px; margin-bottom:30px;">Just Kidding! 😄</h1>
                    <p style="color:var(--baby-blue); font-size:24px; line-height:1.6;">
                        Happy Valentine's Day! 💖<br><br>
                        I love you so much! ❤️
                    </p>
                </div>
            `;
        };

        // Show Phase 5 after video ends
        video.onended = () => {
            setTimeout(() => {
                showRealQuestion();
            }, 500);
        };
    }

    // === PHASE 5: THE REAL QUESTION ===
    function showRealQuestion() {
        stage.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 500px; width: 100%;">
                <h1 style="color: var(--baby-pink); text-align: center; margin-bottom: 50px; font-size: 24px; line-height: 1.6; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); animation: fadeIn 0.5s; max-width: 90%;">
                    Will you be my<br>
                    Valentine?<br>
                    <span style="font-size: 18px; color: var(--baby-blue);">(For real this time 💖)</span>
                </h1>
                <button id="real-yes-btn" class="trap-button" style="animation: pulse 2s infinite; display: block; margin: 0 auto; text-align: center;">
                    YES
                </button>
            </div>
        `;

        document.getElementById("real-yes-btn").addEventListener("click", () => {
            triggerConfettiExplosion();
        });
    }

    // === CONFETTI EXPLOSION ===
    function triggerConfettiExplosion() {
        // Hide the button immediately
        stage.innerHTML = '<div style="height: 400px;"></div>';

        // Create confetti container
        const confettiContainer = document.createElement("div");
        confettiContainer.id = "confetti-container";
        confettiContainer.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9998;";
        document.body.appendChild(confettiContainer);

        // Generate confetti pieces
        const colors = ['#FFB7B2', '#AEC6CF', '#FFD700', '#FF69B4', '#00CED1', '#FF1493', '#7B68EE'];
        const confettiCount = 150;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement("div");
                confetti.className = "confetti-piece";

                // Random starting position (from all sides)
                const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
                let startX, startY;

                if (side === 0) { // top
                    startX = Math.random() * 100;
                    startY = -10;
                } else if (side === 1) { // right
                    startX = 110;
                    startY = Math.random() * 100;
                } else if (side === 2) { // bottom
                    startX = Math.random() * 100;
                    startY = 110;
                } else { // left
                    startX = -10;
                    startY = Math.random() * 100;
                }

                confetti.style.left = startX + "vw";
                confetti.style.top = startY + "vh";
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = (Math.random() * 0.5) + "s";
                confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";

                confettiContainer.appendChild(confetti);
            }, i * 10);
        }

        // Show final screen after confetti starts
        setTimeout(() => {
            showFinalScreen();
        }, 2000);

        // Clean up confetti after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    // === FINAL SCREEN ===
    function showFinalScreen() {
        // Override stage constraints so content is fully visible
        stage.style.height = "auto";
        stage.style.maxHeight = "none";
        stage.style.overflow = "visible";

        stage.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%; animation: fadeIn 1s; padding: 20px 20px 40px; font-family: 'Courier Prime', monospace;">
                <div style="margin-bottom: 30px; text-align: center;">
                    <img src="LOVE.png" alt="Love" style="max-width: 350px; width: 80%; height: auto; border-radius: 10px; border: 4px solid var(--baby-pink); box-shadow: 0 0 25px var(--baby-pink); display: block; margin: 0 auto;">
                </div>
                <div style="text-align: center; max-width: 600px; padding: 0 10px;">
                    <p style="color: var(--baby-pink); font-size: 22px; font-family: 'Courier Prime', monospace !important; margin: 0 0 15px 0; line-height: 1.4;">
                        Happy Valentine's Day my sweetheart 💘
                    </p>
                    <p style="color: #fff; font-size: 16px; font-family: 'Courier Prime', monospace !important; margin: 0; line-height: 1.6;">
                        I LOVE YOU BEYOND COMPARE<br>
                        but now you are stuck with me FOREVER ahahahaha
                    </p>
                </div>
            </div>
        `;
    }
}
