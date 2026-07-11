/* ==========================================
   LOGIKA INTERAKTIF JS - WEBSITE ULANG TAHUN
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------
    // 1. CONFIGURATION & STATE
    // ------------------------------------------
    // ATUR TANGGAL ULANG TAHUN DI SINI (Format: YYYY-MM-DD THH:MM:SS)
    // Jika ingin hitung mundur asli, atur tanggal di masa depan.
    // Jika kosong/tidak valid, otomatis menggunakan MODE PENGUJIAN (5 detik).
    // WITA = UTC+8 | Tengah malam 12 Juli 2026 waktu WITA
    const TARGET_BIRTHDAY = "2026-07-12T00:00:00+08:00";
    
    // Teks Surat Cinta Bagian 4
    const LETTER_1_TEXT = `Happy birthday yaa, sayang.

Akhirnya kamu 21 tahun jugaa. 💕

Makasih ya udah hadir di hidup aku. Makasih udah jadi orang yang selalu bikin aku ngerasa bahagia, walaupun kadang kita sama-sama keras kepala. Tapi aku tetap bersyukur banget bisa kenal, sayang, dan punya kamu.

Aku cuma mau kamu tahu, aku bangga sama kamu. Aku tahu akhir-akhir ini kamu capek, kerjaan lagi berat, banyak hal yang bikin kamu sedih. Jadi di ulang tahun kamu ini aku cuma berharap semoga semua hal baik pelan-pelan dateng ke hidup kamu.

Semoga kamu selalu sehat, selalu dikelilingi orang yang sayang sama kamu, rezekinya lancar, kerjaannya makin baik, dan semua doa yang selama ini kamu simpan bisa satu-satu dikabulin.

Yang paling penting semoga senyum kamu lebih banyak daripada air mata kamu. Karena kamu pantas buat bahagia. 💕💕

Aku sayang banget sama kamu. Makasih ya udah jadi rumah buat aku.

Happy 21st Birthday, my favorite person. I love you always. 💗🫶`;

    // Teks Surat Cinta Bagian 7
    const LETTER_2_TEXT = `Happy 21st birthday, sayang.

I hope this new age brings you more happiness than sadness, more smiles than tears, and more peace than worries.

Aku tahu akhir-akhir ini kamu capek banget. Kerjaan bikin kamu lelah, banyak hal yang kamu pendam sendiri. But I really hope, starting from today, life will be a little gentler with you.

Semoga semua doa yang kamu simpan dalam hati satu per satu dikabulkan. Semoga kamu selalu sehat, selalu dikelilingi orang-orang baik, dan semua mimpi yang lagi kamu kejar bisa jadi kenyataan.

Please don't forget to take care of yourself, okay? Rest when you're tired, eat well, and remember that you don't always have to be strong.

Thank you for being the most beautiful part of my life. Thank you for letting me love you.

No matter what happens, I'll always be cheering for you and wishing nothing but the best for you.

Happy Birthday, my favorite person. I love you more than words can ever explain. ❤️`;

    // Teks Bagian 8 (Penutup)
    const ENDING_TEXTS = [
        "thank you for being part of my life.",
        "I hope this little gift can make your special day even more beautiful.",
        "Forever yours. 💖"
    ];

    // State Variables
    let bgMusic = document.getElementById("bg-music");
    let isMusicPlaying = false;
    let particlesActive = true;
    let activeSectionId = "section-countdown";

    // ------------------------------------------
    // 2. NAVIGASI SPA (SINGLE PAGE TRANSITIONS)
    // ------------------------------------------
    function goToSection(targetId) {
        const currentSection = document.getElementById(activeSectionId);
        const targetSection = document.getElementById(targetId);
        
        if (!currentSection || !targetSection) return;

        // Fade Out Current Section
        currentSection.classList.remove("show");
        
        setTimeout(() => {
            currentSection.classList.remove("active");
            
            // Show Target Section
            targetSection.classList.add("active");
            
            // Force reflow
            targetSection.offsetHeight;
            
            targetSection.classList.add("show");
            activeSectionId = targetId;
            
            // Trigger section-specific callbacks
            onSectionActive(targetId);
        }, 600); // Harus sinkron dengan durasi transisi CSS
    }

    // Callback khusus saat halaman tertentu aktif
    function onSectionActive(sectionId) {
        // Stop video if leaving video section
        if (sectionId !== "section-video") {
            const video = document.getElementById("romantic-video");
            if (video && !video.paused) {
                video.pause();
                document.querySelector(".custom-video-container").classList.add("paused");
                document.querySelector(".custom-video-container").classList.remove("playing");
            }
        }

        switch (sectionId) {
            case "section-letter":
                startTypewriter("typewriter-letter-1", LETTER_1_TEXT, 45, () => {
                    document.getElementById("reveal-container-1").classList.add("show");
                });
                break;
            case "section-wishes":
                startTypewriter("typewriter-letter-2", LETTER_2_TEXT, 40, () => {
                    document.getElementById("reveal-container-2").classList.add("show");
                });
                break;
            case "section-ending":
                startEndingSequence();
                break;
        }
    }

    // ------------------------------------------
    // 3. EFFECT TYPEWRITER (MENGETIK MANUAL)
    // ------------------------------------------
    let activeTypewriters = {};

    function startTypewriter(elementId, text, speed, callback) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Reset element content
        element.innerHTML = "";
        element.classList.remove("typing-done");
        
        // Cancel existing interval for this element if active
        if (activeTypewriters[elementId]) {
            clearInterval(activeTypewriters[elementId]);
        }

        let index = 0;
        
        activeTypewriters[elementId] = setInterval(() => {
            if (index < text.length) {
                const char = text.charAt(index);
                if (char === "\n") {
                    element.innerHTML += "<br>";
                } else {
                    element.innerHTML += char;
                }
                index++;
            } else {
                clearInterval(activeTypewriters[elementId]);
                delete activeTypewriters[elementId];
                element.classList.add("typing-done");
                if (callback) callback();
            }
        }, speed);
    }


    // ------------------------------------------
    // 4. BAGIAN 1: COUNTDOWN TIMER & TEST MODE
    // ------------------------------------------
    const btnCountdown = document.getElementById("btn-countdown");
    const testModeIndicator = document.getElementById("test-mode-indicator");
    const timerStatus = document.getElementById("timer-status");

    // --- Live WITA Clock (Asia/Makassar = UTC+8) ---
    const witaClockEl = document.getElementById("wita-live-clock");
    const witaDateEl  = document.getElementById("wita-live-date");

    const witaFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
    const witaDateFormatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Makassar",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    function updateWitaClock() {
        const now = new Date();
        if (witaClockEl) witaClockEl.textContent = witaFormatter.format(now);
        if (witaDateEl)  witaDateEl.textContent  = witaDateFormatter.format(now);
    }
    updateWitaClock();
    setInterval(updateWitaClock, 1000);
    // -----------------------------------------------

    let countdownInterval;
    let targetTime;
    let isTestMode = false;


    // Inisialisasi Target Waktu
    const urlParams = new URLSearchParams(window.location.search);
    const forceTestMode = urlParams.get('test') === 'true';

    if (TARGET_BIRTHDAY && !forceTestMode) {
        targetTime = new Date(TARGET_BIRTHDAY).getTime();
        // Cek jika valid
        if (isNaN(targetTime) || targetTime <= Date.now()) {
            setupTestMode();
        } else {
            testModeIndicator.style.display = "none";
            startCountdown();
        }
    } else {
        setupTestMode();
    }

    function setupTestMode() {
        isTestMode = true;
        testModeIndicator.style.display = "block";
        
        // Target waktu adalah 5 detik dari sekarang
        const countdownSeconds = 5;
        targetTime = Date.now() + (countdownSeconds * 1000);
        
        testModeIndicator.textContent = `Tersisa 00:05 lagi (Test Mode Aktif)`;
        startCountdown();
    }

    function startCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);

        function updateTimer() {
            const now = Date.now();
            const difference = targetTime - now;

            if (difference <= 0) {
                clearInterval(countdownInterval);
                // Unlock Button
                document.getElementById("timer-days").textContent = "00";
                document.getElementById("timer-hours").textContent = "00";
                document.getElementById("timer-minutes").textContent = "00";
                document.getElementById("timer-seconds").textContent = "00";
                
                timerStatus.textContent = "🎁 Waktunya telah tiba! Klik tombol di bawah... 💖";
                if (isTestMode) {
                    testModeIndicator.textContent = "Hitung mundur tes selesai!";
                }

                btnCountdown.removeAttribute("disabled");
                btnCountdown.classList.remove("locked");
                document.getElementById("btn-icon").textContent = "🔓";
                document.getElementById("btn-text").textContent = "BUKA SEKARANG";
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById("timer-days").textContent = String(days).padStart(2, "0");
            document.getElementById("timer-hours").textContent = String(hours).padStart(2, "0");
            document.getElementById("timer-minutes").textContent = String(minutes).padStart(2, "0");
            document.getElementById("timer-seconds").textContent = String(seconds).padStart(2, "0");

            // Update status teks
            if (!isTestMode) {
                const totalMins = Math.floor(difference / (1000 * 60));
                if (totalMins > 60) {
                    timerStatus.textContent = `⏳ Menghitung waktu menuju hari spesialnya (WITA)... 💖`;
                } else if (totalMins > 0) {
                    timerStatus.textContent = `✨ Sebentar lagi! Hampir waktunya... 💖`;
                } else {
                    timerStatus.textContent = `💫 Detik-detik menuju tengah malam WITA... 💖`;
                }
            }
            if (isTestMode) {
                testModeIndicator.textContent = `Tersisa 00:${String(seconds).padStart(2, "0")} lagi (Test Mode Aktif)`;
            }
        }

        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }

    // Event Klik Button Countdown
    btnCountdown.addEventListener("click", () => {
        goToSection("section-gift");
        // Mulai play musik di background (memicu interaksi browser)
        playMusic();
    });

    // ------------------------------------------
    // 5. BAGIAN 2: ADA SESUATU UNTUKMU (Buka Kado)
    // ------------------------------------------
    const giftInteractive = document.getElementById("gift-box-interactive");
    
    giftInteractive.addEventListener("click", () => {
        if (giftInteractive.classList.contains("opened")) return;
        
        giftInteractive.classList.add("opened");
        
        // Picu ledakan partikel kado di kanvas
        burstHearts(80);
        
        // Transisi ke halaman welcome setelah animasi kado selesai (1.2 detik)
        setTimeout(() => {
            goToSection("section-welcome");
        }, 1200);
    });

    // ------------------------------------------
    // 6. ALUR NAVIGASI ANTAR SEKSI
    // ------------------------------------------
    // Welcome Page -> Letter 1
    document.getElementById("btn-read-letter").addEventListener("click", () => {
        goToSection("section-letter");
    });

    // Letter 1 -> Memories
    document.getElementById("btn-to-memories").addEventListener("click", () => {
        goToSection("section-memories");
    });

    // Memories -> Video Message
    document.getElementById("btn-to-video").addEventListener("click", () => {
        goToSection("section-video");
    });

    // Video Message -> Wishes
    document.getElementById("btn-to-wishes").addEventListener("click", () => {
        goToSection("section-wishes");
    });

    // Wishes -> Ending Screen
    document.getElementById("btn-to-ending").addEventListener("click", () => {
        goToSection("section-ending");
    });

    // Ending Screen -> Replay
    document.getElementById("btn-replay").addEventListener("click", () => {
        // Reset container status
        document.getElementById("reveal-container-1").classList.remove("show");
        document.getElementById("reveal-container-2").classList.remove("show");
        document.getElementById("reveal-container-ending").classList.remove("show");
        
        // Reset title ke Happy Birthday
        const endingTitle = document.getElementById("ending-title");
        endingTitle.textContent = "Happy Birthday";
        endingTitle.classList.remove("typing-done");

        goToSection("section-welcome");
    });

    // ------------------------------------------
    // 7. BAGIAN 8: DETAIL ANIMASI PENUTUP (BACKSPACE EFFECT)
    // ------------------------------------------
    function startEndingSequence() {
        const p1 = document.getElementById("ending-text-p1");
        const p2 = document.getElementById("ending-text-p2");
        const p3 = document.getElementById("ending-text-p3");
        const title = document.getElementById("ending-title");

        // Clear contents
        p1.innerHTML = "";
        p2.innerHTML = "";
        p3.innerHTML = "";
        p1.classList.remove("reveal");
        p2.classList.remove("reveal");
        p3.classList.remove("reveal");
        
        // Judul awal dikosongkan terlebih dahulu
        title.textContent = "";
        title.classList.remove("typing-done");

        // Ketik judul "Happy Birthday" terlebih dahulu
        startTypewriter("ending-title", "Happy Birthday", 60, () => {
            title.classList.add("typing-done");
            
            // Jeda sebentar sebelum mengetik paragraf di bawahnya
            setTimeout(() => {
                startTypewriter("ending-text-p1", ENDING_TEXTS[0], 45, () => {
                    p1.classList.add("reveal");
                    
                    setTimeout(() => {
                        startTypewriter("ending-text-p2", ENDING_TEXTS[1], 45, () => {
                            p2.classList.add("reveal");
                            
                            setTimeout(() => {
                                startTypewriter("ending-text-p3", ENDING_TEXTS[2], 40, () => {
                                    p3.classList.add("reveal");
                                    
                                    // Setelah semua selesai, picu efek Backspace pada Judul
                                    setTimeout(triggerTitleBackspace, 1200);
                                });
                            }, 500);
                        });
                    }, 500);
                });
            }, 400);
        });
    }

    function triggerTitleBackspace() {
        const title = document.getElementById("ending-title");
        let currentText = title.textContent;
        
        // Animasi Backspace (Hapus huruf demi huruf)
        const deleteInterval = setInterval(() => {
            if (currentText.length > 0) {
                currentText = currentText.substring(0, currentText.length - 1);
                title.textContent = currentText;
            } else {
                clearInterval(deleteInterval);
                // Selesai menghapus, ketik ulang teks baru
                setTimeout(typeNewTitle, 600);
            }
        }, 1200 / "Happy Birthday".length); // Durasi hapus ~1.2 detik
    }

    function typeNewTitle() {
        const title = document.getElementById("ending-title");
        const newText = "With All My Love";
        let index = 0;

        const typeInterval = setInterval(() => {
            if (index < newText.length) {
                title.textContent += newText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                title.classList.add("typing-done");
                // Setelah With All My Love selesai, backspace lagi → Always & Forever
                setTimeout(triggerSecondBackspace, 1500);
            }
        }, 1500 / newText.length);
    }

    function triggerSecondBackspace() {
        const title = document.getElementById("ending-title");
        title.classList.remove("typing-done");
        let currentText = title.textContent;

        const deleteInterval = setInterval(() => {
            if (currentText.length > 0) {
                currentText = currentText.substring(0, currentText.length - 1);
                title.textContent = currentText;
            } else {
                clearInterval(deleteInterval);
                setTimeout(typeAlwaysForever, 600);
            }
        }, 1200 / "With All My Love".length);
    }

    function typeAlwaysForever() {
        const title = document.getElementById("ending-title");
        title.classList.add("always-forever-title");
        const newText = "Always & Forever";
        let index = 0;

        const typeInterval = setInterval(() => {
            if (index < newText.length) {
                title.textContent += newText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                title.classList.add("typing-done");
                // Munculkan tombol Replay
                document.getElementById("reveal-container-ending").classList.add("show");
            }
        }, 2000 / newText.length);
    }

    // ------------------------------------------
    // 8. FLOATING MUSIC PLAYER WIDGET
    // ------------------------------------------
    const musicDiscBtn = document.getElementById("music-disc-btn");
    const musicDiscElement = document.getElementById("music-disc-element");
    const musicEqualizer = document.getElementById("music-equalizer");
    const musicWidget = document.getElementById("music-player-widget");

    function playMusic() {
        if (!isMusicPlaying) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicDiscElement.classList.add("playing");
                musicEqualizer.classList.add("playing");
                musicWidget.classList.add("expanded");
                
                // Collapse widget after 3 seconds
                setTimeout(() => {
                    musicWidget.classList.remove("expanded");
                }, 3500);
            }).catch(e => {
                console.log("Autoplay music blocked by browser interaction restrictions.", e);
            });
        }
    }

    function pauseMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicDiscElement.classList.remove("playing");
            musicEqualizer.classList.remove("playing");
        }
    }

    musicDiscBtn.addEventListener("click", () => {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // ------------------------------------------
    // 9. CUSTOM VIDEO PLAYER CONTROLS
    // ------------------------------------------
    const video = document.getElementById("romantic-video");
    const videoContainer = document.querySelector(".custom-video-container");
    const bigPlayBtn = document.getElementById("video-play-btn");
    const miniPlayBtn = document.getElementById("video-mini-play");
    const playIcon = document.getElementById("video-play-icon");
    const progressBar = document.getElementById("video-progress-bar");
    const progressContainer = document.querySelector(".video-timeline-container");
    const muteBtn = document.getElementById("video-mute-btn");
    const volumeIcon = document.getElementById("video-volume-icon");
    const timeDisplay = document.getElementById("video-time");

    function togglePlayVideo() {
        if (video.paused) {
            // Mute background music when playing video
            pauseMusic();
            
            video.play();
            videoContainer.classList.remove("paused");
            videoContainer.classList.add("playing");
            playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause SVG path
        } else {
            video.pause();
            videoContainer.classList.add("paused");
            videoContainer.classList.remove("playing");
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play SVG path
            
            // Resume background music if playing video ends/pauses
            playMusic();
        }
    }

    bigPlayBtn.addEventListener("click", togglePlayVideo);
    miniPlayBtn.addEventListener("click", togglePlayVideo);
    video.addEventListener("click", togglePlayVideo);

    // Update progress bar & time display
    video.addEventListener("timeupdate", () => {
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percentage + "%";
        
        // Format Time Display
        const curMins = Math.floor(video.currentTime / 60);
        const curSecs = Math.floor(video.currentTime % 60);
        const durMins = Math.floor(video.duration / 60) || 0;
        const durSecs = Math.floor(video.duration % 60) || 0;
        
        timeDisplay.textContent = `${curMins}:${String(curSecs).padStart(2, "0")} / ${durMins}:${String(durSecs).padStart(2, "0")}`;
    });

    // Scrub timeline
    progressContainer.addEventListener("click", (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });

    // Mute / Unmute Video
    muteBtn.addEventListener("click", () => {
        video.muted = !video.muted;
        if (video.muted) {
            volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>'; // Muted SVG
        } else {
            volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>'; // Speaker volume SVG
        }
    });

    // When video ends, show wishes button & restart background music
    video.addEventListener("ended", () => {
        videoContainer.classList.add("paused");
        videoContainer.classList.remove("playing");
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        playMusic();
    });


    // ------------------------------------------
    // 10. BACKGROUND CANVAS - PARTIKEL HATI & BINTANG MELAYANG
    // ------------------------------------------
    const canvas = document.getElementById("canvas-particles");
    const ctx = canvas.getContext("2d");

    let particles = [];
    const maxParticles = 65;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(isBurst = false, burstX = 0, burstY = 0) {
            this.isBurst = isBurst;
            this.reset(isBurst, burstX, burstY);
        }

        reset(isBurst = false, burstX = 0, burstY = 0) {
            this.x = isBurst ? burstX : Math.random() * canvas.width;
            this.y = isBurst ? burstY : (Math.random() * -100) - 20;
            this.size = (Math.random() * 8) + 6;
            
            // Speeds
            if (isBurst) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (Math.random() * 4) + 2;
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed - 1.5; // Upward bias
            } else {
                this.speedX = (Math.random() * 1) - 0.5;
                this.speedY = (Math.random() * 1.5) + 0.8; // Downward flow
            }

            this.opacity = (Math.random() * 0.45) + 0.35;
            this.fadeSpeed = isBurst ? (Math.random() * 0.01) + 0.008 : 0;
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = (Math.random() * 0.02) - 0.01;
            
            // Shape: 70% hearts, 30% sparkles
            this.shape = Math.random() > 0.3 ? "heart" : "sparkle";
            
            // Colors: Blush pink, rose gold, warm gold
            const colors = [
                "rgba(255, 117, 151, opacity)", // Pink
                "rgba(226, 192, 134, opacity)", // Gold
                "rgba(214, 149, 167, opacity)"  // Rose
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Re-eval color with active opacity
            let drawColor = this.color.replace("opacity", this.opacity);
            ctx.fillStyle = drawColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = drawColor.replace(/[^,]+(?=\))/, "0.5"); // soft glow

            if (this.shape === "heart") {
                // Heart path drawing code
                ctx.beginPath();
                const size = this.size;
                ctx.moveTo(0, size / 4);
                ctx.quadraticCurveTo(0, 0, -size / 2, 0);
                ctx.quadraticCurveTo(-size, 0, -size, size / 2);
                ctx.quadraticCurveTo(-size, size, 0, size * 1.4);
                ctx.quadraticCurveTo(size, size, size, size / 2);
                ctx.quadraticCurveTo(size, 0, size / 2, 0);
                ctx.quadraticCurveTo(0, 0, 0, size / 4);
                ctx.closePath();
                ctx.fill();
            } else {
                // Four-point sparkle drawing code
                ctx.beginPath();
                const r = this.size;
                ctx.moveTo(0, -r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.quadraticCurveTo(0, 0, 0, r);
                ctx.quadraticCurveTo(0, 0, -r, 0);
                ctx.quadraticCurveTo(0, 0, 0, -r);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            if (this.isBurst) {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0) {
                    return false; // delete burst particle
                }
            } else {
                // Recycle normal particles when offscreen
                if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                    this.reset(false);
                }
            }
            return true;
        }
    }

    // Initialize regular particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle(false));
    }

    // Function to trigger a burst of particles (e.g. when opening gift)
    function burstHearts(count) {
        const giftContainer = document.getElementById("gift-box-interactive");
        const rect = giftContainer.getBoundingClientRect();
        const startX = rect.left + (rect.width / 2);
        const startY = rect.top + (rect.height / 3);

        for (let i = 0; i < count; i++) {
            particles.push(new Particle(true, startX, startY));
        }
    }

    // Particle Animation Loop
    function animateParticles() {
        if (!particlesActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw background radial gradient
        const bgGrad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, canvas.width);
        bgGrad.addColorStop(0, "#191122");
        bgGrad.addColorStop(1, "#0d0813");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => {
            p.draw();
            return p.update();
        });

        // Maintain base particle count if any normal ones get deleted
        const normalCount = particles.filter(p => !p.isBurst).length;
        if (normalCount < maxParticles) {
            particles.push(new Particle(false));
        }

        requestAnimationFrame(animateParticles);
    }

    // Start animation loop
    animateParticles();

    // Force animation active on load
    setTimeout(() => {
        goToSection("section-countdown");
        document.getElementById("section-countdown").classList.add("show");
    }, 200);
});
