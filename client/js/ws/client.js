/**
 * Client for interacting with the Gemini 2.0 Flash Multimodal Live API via WebSockets.
 * This class handles the connection, sending and receiving messages, and processing responses.
 */
import { blobToJSON, base64ToArrayBuffer } from '../utils/utils.js';

export class GeminiWebsocketClient {
    /**
     * Creates a new GeminiWebsocketClient with the given configuration.
     * @param {string} name - Name for the websocket client.
     * @param {string} url - URL for the Gemini API that contains the API key at the end.
     * @param {Object} config - Configuration object for the Gemini API.
     */
    constructor(name, url, config) {
        this._eventListeners = new Map();
        this.name = name || 'WebSocketClient';
        this.url = url || `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
        this.ws = null;
        this.config = config;
        this.isConnecting = false;
        this.connectionPromise = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5; // Increased from 3 to 5
        this.reconnectDelay = 2000;
        this.wasIntentionallyDisconnected = false;
    }

    /**
     * Registers an event listener for the specified event
     * @param {string} eventName - Name of the event to listen for
     * @param {Function} callback - Function to call when the event occurs
     */
    on(eventName, callback) {
        if (!this._eventListeners.has(eventName)) {
            this._eventListeners.set(eventName, []);
        }
        this._eventListeners.get(eventName).push(callback);
    }

    /**
     * Emits an event with the specified data
     * @param {string} eventName - Name of the event to emit
     * @param {any} data - Data to pass to the event listeners
     */
    emit(eventName, data) {
        if (!this._eventListeners.has(eventName)) {
            return;
        }
        for (const callback of this._eventListeners.get(eventName)) {
            callback(data);
        }
    }

    /**
     * Checks if the WebSocket connection is currently open and ready
     * @returns {boolean} True if the connection is open, false otherwise
     */
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Establishes a WebSocket connection and initializes the session with a configuration.
     * @returns {Promise} Resolves when the connection is established and setup is complete
     */
    async connect() {
        if (this.isConnected()) {
            return this.connectionPromise;
        }

        if (this.isConnecting) {
            return this.connectionPromise;
        }

        console.info('🔗 Establishing WebSocket connection...');
        this.isConnecting = true;
        this.connectionPromise = new Promise((resolve, reject) => {
            const ws = new WebSocket(this.url);

            // Send setup message upon successful connection
            ws.addEventListener('open', () => {
                console.info('🔗 Successfully connected to websocket');
                this.ws = ws;
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.wasIntentionallyDisconnected = false; // Reset intentional disconnect flag

                // Configure
                this.sendJSON({ setup: this.config });
                console.debug("Setup message with the following configuration was sent:", this.config);
                
                // Emit connected event
                this.emit('connected', {});
                resolve();
            });

            // Handle connection errors
            ws.addEventListener('error', (error) => {
                this.isConnecting = false;
                const reason = error.reason || 'Unknown';
                const message = `Could not connect to "${this.url}. Reason: ${reason}"`;
                console.error(message, error);
                this.emit('connection_error', { error });
                reject(error);
            });

            // Handle connection close
            ws.addEventListener('close', (event) => {
                this.isConnecting = false;
                console.warn(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
                this.emit('disconnected', { code: event.code, reason: event.reason });
                
                // Attempt reconnect if not intentionally disconnected and we haven't exceeded max attempts
                if (!this.wasIntentionallyDisconnected && event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1); // Gentler exponential backoff
                    console.info(`Attempting to reconnect in ${delay/1000} seconds... (Attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts})`);
                    
                    setTimeout(() => {
                        this.connect().catch(err => {
                            console.error('Reconnection failed:', err);
                            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                                this.emit('reconnection_failed');
                            }
                        });
                    }, delay);
                }
            });

            // Listen for incoming messages, expecting Blob data for binary streams
            ws.addEventListener('message', async (event) => {
                if (event.data instanceof Blob) {
                    this.receive(event.data);
                } else {
                    console.error('Non-blob message received', event);
                }
            });
        });

        return this.connectionPromise;
    }

    /**
     * Gracefully disconnect the WebSocket connection
     */
    disconnect() {
        if (this.ws) {
            this.wasIntentionallyDisconnected = true; // Mark as intentional disconnect
            
            // Close with normal closure code
            this.ws.close(1000, "User initiated disconnect");
            this.ws = null;
            this.isConnecting = false;
            this.connectionPromise = null;
            console.info(`${this.name} successfully disconnected from websocket`);
        }
    }

    /**
     * Processes incoming WebSocket messages.
     * Handles various response types including tool calls, setup completion,
     * and content delivery (text/audio).
     */
    async receive(blob) {
        const response = await blobToJSON(blob);
        
        if (response.setupComplete) {
            console.debug(`${this.name} setup completed successfully`);
            this.emit('setup_complete');
            return;
        }
        
        // Handle image acknowledgment
        if (response.mediaAck) {
            console.debug(`${this.name} acknowledged media receipt:`, response.mediaAck);
            this.emit('media_ack', response.mediaAck);
            return;
        }

        // Handle tool call responses
        if (response.toolCall) {
            console.debug(`${this.name} received tool call`, response);       
            this.emit('tool_call', response.toolCall);
            return;
        }

        // Handle tool call cancellation
        if (response.toolCallCancellation) {
            console.debug(`${this.name} received tool call cancellation`, response);
            this.emit('tool_call_cancellation', response.toolCallCancellation);
            return;
        }

        // Process server content (text/audio/interruptions)
        if (response.serverContent) {
            const { serverContent } = response;
            if (serverContent.interrupted) {
                console.debug(`${this.name} is interrupted`);
                this.emit('interrupted');
                return;
            }
            if (serverContent.turnComplete) {
                console.debug(`${this.name} has completed its turn`);
                this.emit('turn_complete');
            }
            if (serverContent.modelTurn) {
                // console.debug(`${this.name} is sending content`);
                // Split content into audio and non-audio parts
                let parts = serverContent.modelTurn.parts;

                // Filter out audio parts from the model's content parts
                const audioParts = parts.filter((p) => p.inlineData && p.inlineData.mimeType.startsWith('audio/pcm'));
                
                // Extract base64 encoded audio data from the audio parts
                const base64s = audioParts.map((p) => p.inlineData?.data);
                
                // Create an array of non-audio parts by excluding the audio parts
                const otherParts = parts.filter((p) => !audioParts.includes(p));

                // Process audio data
                base64s.forEach((b64) => {
                    if (b64) {
                        const data = base64ToArrayBuffer(b64);
                        this.emit('audio', data);
                    }
                });

                // Emit remaining content
                if (otherParts.length) {
                    this.emit('content', { modelTurn: { parts: otherParts } });
                    console.debug(`${this.name} sent:`, otherParts);
                }
            }
        } else {
            console.debug(`${this.name} received unmatched message:`, response);
        }
    }

    /**
     * Safely sends JSON data to the server if the connection is open
     * @param {Object} data - The data to send
     * @returns {boolean} - Whether the send was successful
     */
    safelySendJSON(data) {
        if (this.isConnected()) {
            try {
                this.ws.send(JSON.stringify(data));
                return true;
            } catch (error) {
                console.error(`Failed to send data to ${this.name}:`, error);
                return false;
            }
        } else {
            console.warn(`Cannot send to ${this.name}: WebSocket not connected`);
            return false;
        }
    }

    /**
     * Sends encoded audio chunk to the Gemini API.
     * 
     * @param {string} base64audio - The base64 encoded audio string.
     */
    async sendAudio(base64audio) {
        if (!base64audio) return;
        
        const data = { realtimeInput: { mediaChunks: [{ mimeType: 'audio/pcm', data: base64audio }] } };
        const success = this.safelySendJSON(data);
        if (success) {
            console.debug(`Sending audio chunk to ${this.name}.`);
        }
    }

    /**
     * Sends encoded image to the Gemini API.
     * 
     * @param {string} base64image - The base64 encoded image string.
     */
    async sendImage(base64image) {
        if (!base64image) return;
        
        const data = { 
            realtimeInput: { 
                mediaChunks: [{
                    mimeType: 'image/jpeg',
                    data: base64image
                }]
            } 
        };
        
        const success = this.safelySendJSON(data);
        if (success) {
            const sizeMB = (base64image.length * 0.75) / (1024 * 1024); // Convert from base64 to MB
            console.debug(`Image sent to ${this.name}. Size: ${sizeMB.toFixed(2)}MB`);
            this.emit('image_sent', { success: true, size: sizeMB });
        } else {
            console.error(`Failed to send image to ${this.name}`);
            this.emit('image_sent', { success: false });
        }
    }

    /**
     * Sends a text message to the Gemini API.
     * 
     * @param {string} text - The text to send to Gemini.
     * @param {boolean} endOfTurn - If false model will wait for more input without sending a response.
     */
    async sendText(text, endOfTurn = true) {
        const formattedText = {
            clientContent: {
                turns: [{
                    role: 'user',
                    parts: [{ text: text }] // Fixed: parts should be an array of objects
                }],
                turnComplete: endOfTurn
            }
        };
        const success = this.safelySendJSON(formattedText);
        if (success) {
            console.debug(`Text sent to ${this.name}:`, text);
        }
    }

    /**
     * Sends the result of the tool call to Gemini.
     * @param {Object} toolResponse - The response object
     * @param {any} toolResponse.output - The output of the tool execution (string, number, object, etc.)
     * @param {string} toolResponse.id - The identifier of the tool call from toolCall.functionCalls[0].id
     * @param {string} toolResponse.error - Send the output as null and the error message if the tool call failed (optional)
     */
    async sendToolResponse(toolResponse) {
        if (!toolResponse || !toolResponse.id) {
            throw new Error('Tool response must include an id');
        }

        const { output, id, error } = toolResponse;
        let result = [];

        if (error) {
            result = [{
                response: { error: error },
                id
            }];
        } else if (output === undefined) {
            throw new Error('Tool response must include an output when no error is provided');
        } else {
            result = [{
                response: { output: output },
                id
            }];
        }

        const success = this.safelySendJSON({ toolResponse: {functionResponses: result} });
        if (success) {
            console.debug(`Tool response sent to ${this.name}:`, toolResponse);
        }
    }

    /**
     * DEPRECATED: Use safelySendJSON instead
     * Sends a JSON object to the Gemini API.
     * 
     * @param {Object} json - The JSON object to send.
     */
    async sendJSON(json) {        
        try {
            if (!this.isConnected()) {
                throw new Error(`WebSocket is not connected`);
            }
            this.ws.send(JSON.stringify(json));
        } catch (error) {
            throw new Error(`Failed to send ${json} to ${this.name}: ${error.message}`);
        }
    }
}
