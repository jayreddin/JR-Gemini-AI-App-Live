export const settingsTemplate = `
<div class="settings-dialog">
  <md-tabs>
    <md-primary-tab id="tab-api">API</md-primary-tab>
    <md-primary-tab id="tab-advanced">Advanced</md-primary-tab>
    <md-primary-tab id="tab-ui">UI</md-primary-tab>
    <md-primary-tab id="tab-audio">Audio</md-primary-tab>
    <md-primary-tab id="tab-camscrn">Cam/SCRN</md-primary-tab>
    <md-primary-tab id="tab-misc">Misc</md-primary-tab>
  </md-tabs>

  <div class="tab-content" id="api-panel">
    <md-filled-text-field type="password" id="apiKey" label="Gemini API Key"></md-filled-text-field>
    <md-icon-button id="checkGeminiKey" title="Check Gemini API Key">
      <md-icon>check</md-icon>
    </md-icon-button>
    <md-filled-text-field type="password" id="deepgramApiKey" label="Deepgram API Key (Optional)"></md-filled-text-field>
    <md-icon-button id="checkDeepgramKey" title="Check Deepgram API Key">
      <md-icon>check</md-icon>
    </md-icon-button>
  </div>

  <div class="tab-content" id="advanced-panel" hidden>
    <md-filled-text-field id="systemPrompt" label="System Prompt"></md-filled-text-field>
  </div>

  <div class="tab-content" id="ui-panel" hidden>
    <md-filled-button id="themeBtn">Themes</md-filled-button>
    <label>Text Size</label>
    <md-slider id="textSize" min="10" max="30" value="16"></md-slider>
    <span id="textSizeValue">16px</span>
  </div>

  <div class="tab-content" id="audio-panel" hidden>
    <label for="voice">Voice</label>
    <select id="voice">
      <option value="Puck">Puck</option>
      <option value="Charon">Charon</option>
      <option value="Kore">Kore</option>
      <option value="Fenrir">Fenrir</option>
      <option value="Aoede">Aoede</option>
    </select>
    <label>Sample Rate</label>
    <md-slider id="sampleRate" min="8000" max="48000" step="1000" value="27000"></md-slider>
    <span id="sampleRateValue">27000 Hz</span>
  </div>

  <div class="tab-content" id="camscrn-panel" hidden>
    <label>FPS (1-10)</label>
    <md-slider id="fps" min="1" max="10" value="1"></md-slider>
    <span id="fpsValue">1 FPS</span>
    <label>Resize Width (640-1920)</label>
    <md-slider id="resizeWidth" min="640" max="1920" step="80" value="640"></md-slider>
    <span id="resizeWidthValue">640 px</span>
    <label>Quality (0.1-1)</label>
    <md-slider id="quality" min="0.1" max="1" step="0.1" value="0.3"></md-slider>
    <span id="qualityValue">0.3</span>
  </div>

  <div class="tab-content" id="misc-panel" hidden>
    <label>Harassment (0-3)</label>
    <md-slider id="harassmentThreshold" min="0" max="3" step="1" value="3"></md-slider>
    <span id="harassmentValue">High</span>
    <label>Dangerous Content (0-3)</label>
    <md-slider id="dangerousContentThreshold" min="0" max="3" step="1" value="3"></md-slider>
    <span id="dangerousValue">High</span>
    <label>Sexually Explicit (0-3)</label>
    <md-slider id="sexuallyExplicitThreshold" min="0" max="3" step="1" value="3"></md-slider>
    <span id="sexualValue">High</span>
    <label>Civic Integrity (0-3)</label>
    <md-slider id="civicIntegrityThreshold" min="0" max="3" step="1" value="3"></md-slider>
    <span id="civicValue">High</span>
  </div>

  <md-filled-button id="settingsSaveBtn" class="save-btn">Save</md-filled-button>
</div>`;