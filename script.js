document.addEventListener('DOMContentLoaded', () => {

    // --- State & Elements ---
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        preparation: document.getElementById('preparation-screen'),
        form: document.getElementById('connection-form-screen'),
        accessing: document.getElementById('accessing-screen'),
        session: document.getElementById('session-screen'),
        closing: document.getElementById('closing-screen'),
        mentoring: document.getElementById('mentoring-screen'),
    };

    const buttons = {
        beginJourney: document.getElementById('begin-journey-btn'),
        startConnection: document.getElementById('start-connection-btn'),
        closeSession: document.getElementById('close-session-btn'),
        restart: document.getElementById('restart-btn'),
    };
    
    const akashicForm = document.getElementById('akashic-form');
    const logbook = document.getElementById('logbook');
    const protectionShield = document.getElementById('protection-shield');
    const sacredGeometry = document.getElementById('sacred-geometry-container');
    
    let audioContext;
    let oscillator;
    let audioBuffers = {};

    // --- Navigation Logic ---
    function navigateTo(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        }
    }

    // --- Audio Logic ---
    async function initAudio() {
        if (audioContext) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await loadSound('door-open', 'door-open.mp3');
        await loadSound('energetic-shield', 'energetic-shield.mp3');
        await loadSound('session-end', 'session-end.mp3');
    }

    async function loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBuffers[name] = audioBuffer;
        } catch (error) {
            console.error(`Error loading sound ${name}:`, error);
        }
    }

    function playSound(name) {
        if (!audioContext || !audioBuffers[name]) return;
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers[name];
        source.connect(audioContext.destination);
        source.start(0);
    }
    
    function startHealingTone() {
        if (!audioContext) initAudio();
        if (oscillator) oscillator.stop();
        oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(963, audioContext.currentTime); // 963 Hz
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Lower volume
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 8); // Fade out over 8s

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
    }
    
    function stopHealingTone() {
        if (oscillator) {
            oscillator.stop();
            oscillator = null;
        }
    }
    
    // Breathing Animation Text
    const breathingText = document.getElementById('breathing-text');
    setInterval(() => {
        breathingText.style.opacity = '0';
        setTimeout(() => {
            if (breathingText.textContent === 'Inhale') {
                breathingText.textContent = 'Exhale';
            } else {
                breathingText.textContent = 'Inhale';
            }
             breathingText.style.opacity = '1';
        }, 1000);
    }, 4000);

    // --- Application Flow ---
    
    // 1. Start Journey
    buttons.beginJourney.addEventListener('click', () => {
        initAudio(); // Initialize audio on first user interaction
        playSound('energetic-shield');
        protectionShield.classList.add('activate');
        
        setTimeout(() => {
            sacredGeometry.classList.remove('d-none');
            sacredGeometry.classList.add('visible');
            navigateTo('preparation');
            startHealingTone();
            protectionShield.classList.remove('activate');
        }, 1500);
    });
    
    // 2. Preparation to Form
    buttons.startConnection.addEventListener('click', () => {
        stopHealingTone();
        navigateTo('form');
    });
    
    // 3. Form to Accessing
    akashicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        navigateTo('accessing');
        playSound('door-open');
        
        setTimeout(() => {
            navigateTo('session');
            loadLogbook();
        }, 4000); // Duration of the light tunnel animation
    });

    // 4. Session to Closing
    buttons.closeSession.addEventListener('click', () => {
        saveLogbook();
        navigateTo('closing');
        playSound('session-end');
        
        protectionShield.classList.add('deactivate');

        setTimeout(() => {
            sacredGeometry.classList.remove('visible');
            navigateTo('mentoring');
            protectionShield.classList.remove('deactivate');
        }, 2000);
    });
    
    // 5. Mentoring to Welcome
    buttons.restart.addEventListener('click', () => {
        akashicForm.reset();
        logbook.value = '';
        localStorage.removeItem('akashicLogbook');
        navigateTo('welcome');
    });

    // --- Logbook Persistence ---
    function saveLogbook() {
        localStorage.setItem('akashicLogbook', logbook.value);
    }
    
    function loadLogbook() {
        const savedData = localStorage.getItem('akashicLogbook');
        if (savedData) {
            logbook.value = savedData;
        }
    }
    
    logbook.addEventListener('input', saveLogbook);
    
    // --- Initial State ---
    navigateTo('welcome');
});

