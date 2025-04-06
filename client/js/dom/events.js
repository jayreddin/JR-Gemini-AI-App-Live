import elements from './elements.js';
import settingsManager from '../settings/settings-manager.js';

/**
 * Updates UI to show disconnect button and hide connect button
 */
const showDisconnectButton = () => {
    elements.connectBtn.style.display = 'none';
    elements.disconnectBtn.style.display = 'block';
};

/**
 * Updates UI to show connect button and hide disconnect button
 */
const showConnectButton = () => {
    elements.disconnectBtn.style.display = 'none';
    elements.connectBtn.style.display = 'block';
};

let isCameraActive = false;

/**
 * Ensures the agent is connected and initialized
 * @param {GeminiAgent} agent - The main application agent instance
 * @returns {Promise<void>}
 */
const ensureAgentReady = async (agent) => {
    if (!agent.connected) {
        await agent.connect();
        showDisconnectButton();
    }
    if (!agent.initialized) {
        await agent.initialize();
    }
};

/**
 * Sets up event listeners for the application's UI elements
 * @param {GeminiAgent} agent - The main application agent instance
 */
export function setupEventListeners(agent) {
    // Power button connect/disconnect toggle
    elements.powerBtn.addEventListener('click', async () => {
        try {
            if (agent.connected) {
                await agent.disconnect();
                elements.powerBtn.classList.remove('connected');
                elements.powerBtn.classList.add('disconnected');
            } else {
                await ensureAgentReady(agent);
                elements.powerBtn.classList.remove('disconnected');
                elements.powerBtn.classList.add('connected');
            }
            [elements.cameraBtn, elements.screenBtn, elements.micBtn].forEach(btn => btn.classList.remove('active'));
            isCameraActive = false;
        } catch (error) {
            console.error('Error toggling connection:', error);
        }
    });

    // Microphone toggle handler
    elements.micBtn.addEventListener('click', async () => {
        try {
            await ensureAgentReady(agent);
            await agent.toggleMic();
            elements.micBtn.classList.toggle('active');
        } catch (error) {
            console.error('Error toggling microphone:', error);
            elements.micBtn.classList.remove('active');
        }
    });

    // Camera toggle handler
    elements.cameraBtn.addEventListener('click', async () => {
        try {
            await ensureAgentReady(agent);
            if (!isCameraActive) {
                await agent.startCameraCapture();
                elements.cameraBtn.classList.add('active');
                isCameraActive = true;
            } else {
                await agent.stopCameraCapture();
                elements.cameraBtn.classList.remove('active');
                isCameraActive = false;
            }
            updateOutputModeFromMediaState();
        } catch (error) {
            console.error('Error toggling camera:', error);
            elements.cameraBtn.classList.remove('active');
            isCameraActive = false;
            updateOutputModeFromMediaState();
        }
    });

    // Screen sharing handler
    let isScreenShareActive = false;

    agent.on('screenshare_stopped', () => {
        elements.screenBtn.classList.remove('active');
        isScreenShareActive = false;
        updateOutputModeFromMediaState();
        console.info('Screen share stopped');
    });

    elements.screenBtn.addEventListener('click', async () => {
        try {
            await ensureAgentReady(agent);
            if (!isScreenShareActive) {
                await agent.startScreenShare();
                elements.screenBtn.classList.add('active');
                isScreenShareActive = true;
            } else {
                await agent.stopScreenShare();
                elements.screenBtn.classList.remove('active');
                isScreenShareActive = false;
            }
            updateOutputModeFromMediaState();
        } catch (error) {
            console.error('Error toggling screen share:', error);
            elements.screenBtn.classList.remove('active');
            isScreenShareActive = false;
            updateOutputModeFromMediaState();
        }
    });

    // Toggle output mode (text/audio)
    let outputMode = localStorage.getItem('outputMode') || 'text';
    
    // Function to update output toggle button based on current state
    const updateOutputToggleIcon = () => {
        // Check if camera or screen sharing is active, force text mode if so
        if (isCameraActive || isScreenShareActive) {
            outputMode = 'text';
            localStorage.setItem('outputMode', 'text');
            elements.outputToggleBtn.disabled = true; // Disable the button
            elements.outputToggleBtn.title = 'Text Replies (Forced when camera/screen is active)';
        } else {
            elements.outputToggleBtn.disabled = false; // Enable the button
        }
        
        // Update the button with the appropriate SVG icon based on current mode
        if (outputMode === 'text') {
            elements.outputToggleBtn.innerHTML = '<img src="assets/icons/output-text.svg" alt="Text Mode">';
            elements.outputToggleBtn.title = elements.outputToggleBtn.disabled ? 
                'Text Replies (Forced when camera/screen is active)' : 
                'Text Replies (Click for Audio)';
        } else {
            elements.outputToggleBtn.innerHTML = '<img src="assets/icons/output-audio.svg" alt="Audio Mode">';
            elements.outputToggleBtn.title = 'Audio Replies (Click for Text)';
        }
    };
    updateOutputToggleIcon();

    // Add helper to update output mode when camera/screen state changes
    const updateOutputModeFromMediaState = () => {
        if (isCameraActive || isScreenShareActive) {
            outputMode = 'text';
            localStorage.setItem('outputMode', 'text');
        }
        updateOutputToggleIcon();
    };

    elements.outputToggleBtn.addEventListener('click', () => {
        if (!isCameraActive && !isScreenShareActive) { // Only allow toggle if no media is active
            outputMode = outputMode === 'text' ? 'audio' : 'text';
            localStorage.setItem('outputMode', outputMode);
            updateOutputToggleIcon();
            console.info('Switched output mode to', outputMode);
        }
    });

    // Message sending handlers
    const sendMessage = async () => {
        try {
            await ensureAgentReady(agent);
            const text = elements.messageInput.value.trim();
            await agent.sendText(text);
            elements.messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Settings button click
    elements.settingsBtn.addEventListener('click', () => settingsManager.show());
}

// Initialize settings
settingsManager;
