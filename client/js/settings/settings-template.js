export const settingsTemplate = `
<div class="settings-tabs">
  <button data-tab="api">API</button>
  <button data-tab="advanced">Advanced</button>
  <button data-tab="ui">UI</button>
  <button data-tab="audio">Audio</button>
  <button data-tab="camscrn">Cam/SCRN</button>
  <button data-tab="misc">Misc</button>
</div>

<div class="tab-panel" id="tab-api">
  <div class="settings-group">
    <label for="apiKey">Gemini API Key</label>
    <div class="api-row">
      <div class="input-container">
        <input type="password" id="apiKey" placeholder="Enter your Gemini API key">
        <button type="button" id="toggleGeminiKey" class="eyeball-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      <button id="checkGeminiKey" class="check-btn">Check</button>
    </div>
    <small>Get your Gemini API key <a href="https://makersuite.google.com/app/apikey" target="_blank">here</a>.</small>
  </div>

  <div class="settings-group">
    <label for="deepgramApiKey">Deepgram API Key (Optional)</label>
    <div class="api-row">
      <div class="input-container">
        <input type="password" id="deepgramApiKey" placeholder="Enter your Deepgram API key">
        <button type="button" id="toggleDeepgramKey" class="eyeball-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      <button id="checkDeepgramKey" class="check-btn">Check</button>
    </div>
    <small>Get your Deepgram API key <a href="https://console.deepgram.com/signup" target="_blank">here</a>.</small>
  </div>
</div>

<div class="tab-panel" id="tab-advanced" style="display:none">
  <div class="settings-group">
    <label for="systemPrompt">System Prompt</label>
    <textarea id="systemPrompt" rows="3" placeholder="Enter system prompt"></textarea>
  </div>
</div>

<div class="tab-panel" id="tab-ui" style="display:none">
  <div class="settings-group">
    <label for="themeBtn">Themes</label>
    <button id="themeBtn">Themes</button>
    <label for="textSize">Text Size</label>
    <input type="range" id="textSize" min="10" max="30" value="16">
    <span id="textSizeValue">16px</span>
  </div>
</div>

<div class="tab-panel" id="tab-audio" style="display:none">
  <div class="settings-group">
    <label for="voice">Voice</label>
    <select id="voice">
      <option value="Puck">Puck</option>
      <option value="Charon">Charon</option>
      <option value="Kore">Kore</option>
      <option value="Fenrir">Fenrir</option>
      <option value="Aoede">Aoede</option>
    </select>
    <label for="sampleRate">Sample Rate</label>
    <input type="range" id="sampleRate" min="8000" max="48000" step="1000" value="27000">
    <span id="sampleRateValue">27000 Hz</span>
  </div>
</div>

<div class="tab-panel" id="tab-camscrn" style="display:none">
  <div class="settings-group">
    <label for="fps">FPS (1-10)</label>
    <input type="range" id="fps" min="1" max="10" value="1">
    <span id="fpsValue">1 FPS</span>
    <label for="resizeWidth">Resize Width (640-1920)</label>
    <input type="range" id="resizeWidth" min="640" max="1920" step="80" value="640">
    <span id="resizeWidthValue">640 px</span>
    <label for="quality">Quality (0.1-1)</label>
    <input type="range" id="quality" min="0.1" max="1" step="0.1" value="0.3">
    <span id="qualityValue">0.3</span>
  </div>
</div>

<div class="tab-panel" id="tab-misc" style="display:none">
  <div class="settings-group">
    <label for="harassmentThreshold">Harassment (0-3)</label>
    <input type="range" id="harassmentThreshold" min="0" max="3" step="1" value="3">
    <span id="harassmentValue">High</span>
    <label for="dangerousContentThreshold">Dangerous Content (0-3)</label>
    <input type="range" id="dangerousContentThreshold" min="0" max="3" step="1" value="3">
    <span id="dangerousValue">High</span>
    <label for="sexuallyExplicitThreshold">Sexually Explicit (0-3)</label>
    <input type="range" id="sexuallyExplicitThreshold" min="0" max="3" step="1" value="3">
    <span id="sexualValue">High</span>
    <label for="civicIntegrityThreshold">Civic Integrity (0-3)</label>
    <input type="range" id="civicIntegrityThreshold" min="0" max="3" step="1" value="3">
    <span id="civicValue">High</span>
  </div>
</div>

<button id="settingsSaveBtn" class="settings-save-btn">Save Settings</button>`;