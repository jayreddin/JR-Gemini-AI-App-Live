/**
 * Manages screen sharing capture and image processing
 */
import elements from '../dom/elements.js';
import { makeDraggableAndResizable } from '../utils/drag-resize.js';

export class ScreenManager {
    /**
     * @param {Object} config
     * @param {number} config.width - Target width for resizing captured images
     * @param {number} config.quality - JPEG quality (0-1)
     * @param {Function} [config.onStop] - Callback when screen sharing stops
     */
    constructor(config) {
        this.config = {
            width: config.width || 1280,
            quality: config.quality || 0.8,
            onStop: config.onStop
        };
        
        this.stream = null;
        this.videoElement = null;
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.aspectRatio = null;
        this.previewContainer = null;
    }

    /**
     * Show the screen preview
     */
    showPreview() {
        if (this.previewContainer) {
            this.previewContainer.style.display = 'block';
        }
    }

    /**
     * Hide the screen preview
     */
    hidePreview() {
        if (this.previewContainer) {
            this.previewContainer.style.display = 'none';
        }
    }

    /**
     * Initialize screen capture stream and canvas
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            let stream;
            
            // Determine if we're running in Electron or browser
            if (window.api && typeof window.api.getScreenSources === 'function') {
                // Electron environment
                try {
                    // Get available screen sources using native desktopCapturer
                    const sources = await window.api.getScreenSources();
                    
                    // Default to the first screen source if available
                    const source = sources[0];
                    if (!source) {
                        alert('No screen sources available. Please try again.');
                        throw new Error('No screen sources available');
                    }

                    // Request screen sharing using the source ID
                    this.stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1280,
                                maxWidth: 4096,
                                minHeight: 720,
                                maxHeight: 2160
                            }
                        }
                    });
                } catch (electronError) {
                    console.error('Failed with Electron API, falling back to browser API:', electronError);
                    // Will fall back to browser API below
                    throw electronError;
                }
            } else {
                // Browser environment - use standard Web API
                try {
                    console.info('Running in browser environment, using standard Web API for screen capture');
                    // Use standard browser screen capture API
                    this.stream = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            cursor: 'always',
                            displaySurface: 'monitor',
                        },
                        audio: false
                    });
                    
                    console.info('Browser screen sharing initialized successfully');
                } catch (browserError) {
                    console.error('Screen sharing permission denied:', browserError);
                    alert('Screen sharing access was denied. Please allow screen sharing and try again.');
                    throw new Error('Screen sharing permission denied: ' + browserError.message);
                }
            }

            // Create and setup video element
            this.videoElement = document.createElement('video');
            this.videoElement.srcObject = this.stream;
            this.videoElement.playsInline = true;

            // Add video to preview container
            const previewContainer = document.getElementById('screenPreview');
            if (previewContainer) {
                previewContainer.innerHTML = ''; // Clear existing content first
                previewContainer.appendChild(this.videoElement);
                this.previewContainer = previewContainer;
                this.showPreview(); // Show preview when initialized
                makeDraggableAndResizable(this.previewContainer);
            }

            try {
                await this.videoElement.play();
            } catch (playError) {
                console.error('Failed to play screen video:', playError);
                this.dispose();
                throw new Error('Failed to play screen video: ' + playError.message);
            }

            // Get the actual video dimensions
            const videoWidth = this.videoElement.videoWidth;
            const videoHeight = this.videoElement.videoHeight;
            this.aspectRatio = videoHeight / videoWidth;

            // Calculate canvas size maintaining aspect ratio
            const canvasWidth = this.config.width;
            const canvasHeight = Math.round(this.config.width * this.aspectRatio);

            // Create canvas for image processing
            this.canvas = document.createElement('canvas');
            this.canvas.width = canvasWidth;
            this.canvas.height = canvasHeight;
            this.ctx = this.canvas.getContext('2d');

            // Listen for the end of screen sharing
            this.stream.getVideoTracks()[0].addEventListener('ended', () => {
                this.dispose();
                // Notify parent component that sharing has stopped
                if (this.config.onStop) {
                    this.config.onStop();
                }
            });

            this.isInitialized = true;
        } catch (error) {
            // Make sure we clean up resources on error
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            throw new Error(`Failed to initialize screen capture: ${error.message}`);
        }
    }

    /**
     * Get current canvas dimensions
     * @returns {{width: number, height: number}}
     */
    getDimensions() {
        if (!this.isInitialized) {
            throw new Error('Screen capture not initialized. Call initialize() first.');
        }
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    /**
     * Capture and process a screenshot
     * @returns {Promise<string>} Base64 encoded JPEG image
     */
    async capture() {
        if (!this.isInitialized) {
            throw new Error('Screen capture not initialized. Call initialize() first.');
        }

        // Draw current video frame to canvas, maintaining aspect ratio
        this.ctx.drawImage(
            this.videoElement,
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        // Convert to base64 JPEG with specified quality
        return this.canvas.toDataURL('image/jpeg', this.config.quality).split(',')[1];
    }

    /**
     * Stop screen capture and cleanup resources
     */
    dispose() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.videoElement) {
            this.videoElement.srcObject = null;
            this.videoElement = null;
        }

        if (this.previewContainer) {
            this.hidePreview();
            this.previewContainer.innerHTML = ''; // Clear the preview container
            this.previewContainer = null;
        }

        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.aspectRatio = null;
    }
}
