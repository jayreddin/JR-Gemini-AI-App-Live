import { settingsTemplate } from './settings-template.js';

class SettingsManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadSettings();
    }

    initializeElements() {
        this.dialog = document.createElement('div');
        this.dialog.className = 'settings-dialog';

        // Force insert vanilla HTML template
        this.dialog.innerHTML = '';
        this.dialog.insertAdjacentHTML('afterbegin', settingsTemplate);

        this.overlay = document.createElement('div');
        this.overlay.className = 'settings-overlay';

        document.body.appendChild(this.dialog);
        document.body.appendChild(this.overlay);

        this.elements = {
            dialog: this.dialog,
            overlay: this.overlay,
            saveBtn: this.dialog.querySelector('#settingsSaveBtn'),
            apiKeyInput: this.dialog.querySelector('#apiKey'),
            deepgramApiKeyInput: this.dialog.querySelector('#deepgramApiKey'),
            checkGeminiKey: this.dialog.querySelector('#checkGeminiKey'),
            checkDeepgramKey: this.dialog.querySelector('#checkDeepgramKey'),
            systemPrompt: this.dialog.querySelector('#systemPrompt'),
            themeBtn: this.dialog.querySelector('#themeBtn'),
            textSize: this.dialog.querySelector('#textSize'),
            textSizeValue: this.dialog.querySelector('#textSizeValue'),
            voiceSelect: this.dialog.querySelector('#voice'),
            sampleRate: this.dialog.querySelector('#sampleRate'),
            sampleRateValue: this.dialog.querySelector('#sampleRateValue'),
            fps: this.dialog.querySelector('#fps'),
            fpsValue: this.dialog.querySelector('#fpsValue'),
            resizeWidth: this.dialog.querySelector('#resizeWidth'),
            resizeWidthValue: this.dialog.querySelector('#resizeWidthValue'),
            quality: this.dialog.querySelector('#quality'),
            qualityValue: this.dialog.querySelector('#qualityValue'),
            harassment: this.dialog.querySelector('#harassmentThreshold'),
            harassmentValue: this.dialog.querySelector('#harassmentValue'),
            dangerous: this.dialog.querySelector('#dangerousContentThreshold'),
            dangerousValue: this.dialog.querySelector('#dangerousValue'),
            sexual: this.dialog.querySelector('#sexuallyExplicitThreshold'),
            sexualValue: this.dialog.querySelector('#sexualValue'),
            civic: this.dialog.querySelector('#civicIntegrityThreshold'),
            civicValue: this.dialog.querySelector('#civicValue')
        };
    }

    setupEventListeners() {
        this.overlay.addEventListener('click', () => this.hide());
        this.dialog.addEventListener('click', (e) => e.stopPropagation());

        // Tab switching
        const tabButtons = this.dialog.querySelectorAll('.settings-tabs button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                this.dialog.querySelectorAll('.tab-panel').forEach(panel => {
                    panel.style.display = panel.id === 'tab-' + target ? 'block' : 'none';
                });
            });
        });

        // Eyeball toggle buttons
        this.dialog.querySelector('#toggleGeminiKey').addEventListener('click', () => {
            const input = this.elements.apiKeyInput;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
        this.dialog.querySelector('#toggleDeepgramKey').addEventListener('click', () => {
            const input = this.elements.deepgramApiKeyInput;
            input.type = input.type === 'password' ? 'text' : 'password';
        });

        this.elements.saveBtn.addEventListener('click', () => {
            this.saveSettings();
            this.animateSaveButton();
            setTimeout(() => this.hide(), 300);
        });

        this.elements.checkGeminiKey.addEventListener('click', async () => {
            const valid = await this.validateApiKey(this.elements.apiKeyInput.value, 'gemini');
            this.showApiStatus(this.elements.checkGeminiKey, valid);
        });

        this.elements.checkDeepgramKey.addEventListener('click', async () => {
            const valid = await this.validateApiKey(this.elements.deepgramApiKeyInput.value, 'deepgram');
            this.showApiStatus(this.elements.checkDeepgramKey, valid);
        });

        const sliders = [
            ['sampleRate', 'sampleRateValue', ' Hz'],
            ['textSize', 'textSizeValue', 'px'],
            ['fps', 'fpsValue', ' FPS'],
            ['resizeWidth', 'resizeWidthValue', ' px'],
            ['quality', 'qualityValue', ''],
            ['harassment', 'harassmentValue', ''],
            ['dangerous', 'dangerousValue', ''],
            ['sexual', 'sexualValue', ''],
            ['civic', 'civicValue', '']
        ];
        sliders.forEach(([id, labelId, suffix]) => {
            const slider = this.elements[id];
            const label = this.elements[labelId];
            slider.addEventListener('input', () => {
                label.textContent = slider.value + suffix;
            });
        });
    }

    async validateApiKey(key, type) {
        if (!key) return false;
        try {
            if (type === 'gemini') {
                const res = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/models', {
                    headers: { 'Authorization': `Bearer ${key}` }
                });
                return res.status === 200;
            } else if (type === 'deepgram') {
                const res = await fetch('https://api.deepgram.com/v1/projects', {
                    headers: { 'Authorization': `Token ${key}` },
                    mode: 'no-cors'
                });
                return true; // opaque response, assume success
            }
        } catch {
            return false;
        }
    }

    showApiStatus(button, valid) {
        const originalText = 'Check';
        button.textContent = valid ? '✓' : '✗';
        if (!valid) button.style.backgroundColor = 'red';
        else button.style.backgroundColor = '';
        button.style.transition = 'opacity 0.5s';
        button.style.opacity = '1';
        setTimeout(() => {
            button.style.opacity = '0';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                button.style.opacity = '1';
            }, 500);
        }, 800);
    }

    animateSaveButton() {
        this.elements.saveBtn.style.backgroundColor = 'green';
        setTimeout(() => {
            this.elements.saveBtn.style.backgroundColor = '';
        }, 300);
    }

    loadSettings() {
        this.elements.apiKeyInput.value = localStorage.getItem('apiKey') || '';
        this.elements.deepgramApiKeyInput.value = localStorage.getItem('deepgramApiKey') || '';
        this.elements.systemPrompt.value = localStorage.getItem('systemInstructions') || '';
        this.elements.voiceSelect.value = localStorage.getItem('voiceName') || 'Aoede';
        this.elements.sampleRate.value = localStorage.getItem('sampleRate') || '27000';
        this.elements.textSize.value = localStorage.getItem('textSize') || '16';
        this.elements.fps.value = localStorage.getItem('fps') || '1';
        this.elements.resizeWidth.value = localStorage.getItem('resizeWidth') || '640';
        this.elements.quality.value = localStorage.getItem('quality') || '0.3';
        this.elements.harassment.value = localStorage.getItem('harassmentThreshold') || '3';
        this.elements.dangerous.value = localStorage.getItem('dangerousContentThreshold') || '3';
        this.elements.sexual.value = localStorage.getItem('sexuallyExplicitThreshold') || '3';
        this.elements.civic.value = localStorage.getItem('civicIntegrityThreshold') || '3';

        this.elements.sampleRateValue.textContent = this.elements.sampleRate.value + ' Hz';
        this.elements.textSizeValue.textContent = this.elements.textSize.value + 'px';
        this.elements.fpsValue.textContent = this.elements.fps.value + ' FPS';
        this.elements.resizeWidthValue.textContent = this.elements.resizeWidth.value + ' px';
        this.elements.qualityValue.textContent = this.elements.quality.value;
        this.elements.harassmentValue.textContent = this.elements.harassment.value;
        this.elements.dangerousValue.textContent = this.elements.dangerous.value;
        this.elements.sexualValue.textContent = this.elements.sexual.value;
        this.elements.civicValue.textContent = this.elements.civic.value;
    }

    saveSettings() {
        localStorage.setItem('apiKey', this.elements.apiKeyInput.value);
        localStorage.setItem('deepgramApiKey', this.elements.deepgramApiKeyInput.value);
        localStorage.setItem('systemInstructions', this.elements.systemPrompt.value);
        localStorage.setItem('voiceName', this.elements.voiceSelect.value);
        localStorage.setItem('sampleRate', this.elements.sampleRate.value);
        localStorage.setItem('textSize', this.elements.textSize.value);
        localStorage.setItem('fps', this.elements.fps.value);
        localStorage.setItem('resizeWidth', this.elements.resizeWidth.value);
        localStorage.setItem('quality', this.elements.quality.value);
        localStorage.setItem('harassmentThreshold', this.elements.harassment.value);
        localStorage.setItem('dangerousContentThreshold', this.elements.dangerous.value);
        localStorage.setItem('sexuallyExplicitThreshold', this.elements.sexual.value);
        localStorage.setItem('civicIntegrityThreshold', this.elements.civic.value);
    }

    show() {
        this.dialog.classList.add('active');
        this.overlay.classList.add('active');
    }

    hide() {
        this.dialog.classList.remove('active');
        this.overlay.classList.remove('active');
    }
}

export default new SettingsManager();