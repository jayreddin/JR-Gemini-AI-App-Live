/**
 * Makes an element draggable and resizable
 * @param {HTMLElement} element - The element to make draggable and resizable
 */
export function makeDraggableAndResizable(element) {
    if (!element) return;
    
    let isDragging = false;
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    let lastTouchX, lastTouchY;
    let originalPosition = null;

    // Store the original position once the element is visible
    const storeOriginalPosition = () => {
        if (element.style.display !== 'none' && !originalPosition) {
            originalPosition = {
                left: element.offsetLeft,
                top: element.offsetTop,
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        }
    };

    // Reset to original position if it goes off screen
    const checkBoundaries = () => {
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // If more than 50% off screen, reset position
        if (rect.right < 50 || rect.bottom < 50 || 
            rect.left > windowWidth - 50 || rect.top > windowHeight - 50) {
            resetPosition();
        }
    };

    // Reset position to original or centered
    const resetPosition = () => {
        if (originalPosition) {
            element.style.left = `${originalPosition.left}px`;
            element.style.top = `${originalPosition.top}px`;
            element.style.width = `${originalPosition.width}px`;
            element.style.height = `${originalPosition.height}px`;
        } else {
            // Center in viewport as fallback
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            element.style.left = `${(windowWidth - element.offsetWidth) / 2}px`;
            element.style.top = `${(windowHeight - element.offsetHeight) / 2}px`;
        }
    };

    // Add a drag handle to make it clearer the element can be dragged
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.position = 'absolute';
    dragHandle.style.top = '0';
    dragHandle.style.left = '0';
    dragHandle.style.right = '0';
    dragHandle.style.height = '30px';
    dragHandle.style.cursor = 'move';
    dragHandle.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    dragHandle.style.borderTopLeftRadius = '8px';
    dragHandle.style.borderTopRightRadius = '8px';
    element.appendChild(dragHandle);

    // Make draggable - mouse events
    dragHandle.addEventListener('mousedown', (e) => {
        storeOriginalPosition();
        isDragging = true;
        startX = e.clientX - element.offsetLeft;
        startY = e.clientY - element.offsetTop;
        element.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging || isResizing) {
            checkBoundaries();
        }
        isDragging = false;
        isResizing = false;
        element.style.cursor = '';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newLeft = Math.max(0, e.clientX - startX);
            const newTop = Math.max(0, e.clientY - startY);
            
            // Prevent dragging completely off-screen
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            
            element.style.left = `${Math.min(maxLeft, newLeft)}px`;
            element.style.top = `${Math.min(maxTop, newTop)}px`;
        }
    });

    // Make draggable - touch events
    dragHandle.addEventListener('touchstart', (e) => {
        storeOriginalPosition();
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX - element.offsetLeft;
        startY = touch.clientY - element.offsetTop;
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (isDragging || isResizing) {
            checkBoundaries();
        }
        isDragging = false;
        isResizing = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            const newLeft = Math.max(0, touch.clientX - startX);
            const newTop = Math.max(0, touch.clientY - startY);
            
            // Prevent dragging completely off-screen
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            
            element.style.left = `${Math.min(maxLeft, newLeft)}px`;
            element.style.top = `${Math.min(maxTop, newTop)}px`;
            
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
            e.preventDefault(); // Prevent scrolling while dragging
        }
    }, { passive: false });

    // Make resizable - mouse events
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    element.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', (e) => {
        storeOriginalPosition();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        e.stopPropagation();
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            const width = Math.max(100, startWidth + (e.clientX - startX));
            const height = Math.max(75, startHeight + (e.clientY - startY));
            
            // Add max size constraints to avoid excessive resizing
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            
            element.style.width = `${Math.min(maxWidth, width)}px`;
            element.style.height = `${Math.min(maxHeight, height)}px`;
        }
    });

    // Make resizable - touch events
    resizeHandle.addEventListener('touchstart', (e) => {
        storeOriginalPosition();
        isResizing = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        e.stopPropagation();
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (isResizing) {
            const touch = e.touches[0];
            const width = Math.max(100, startWidth + (touch.clientX - startX));
            const height = Math.max(75, startHeight + (touch.clientY - startY));
            
            // Add max size constraints
            const maxWidth = window.innerWidth * 0.8;
            const maxHeight = window.innerHeight * 0.8;
            
            element.style.width = `${Math.min(maxWidth, width)}px`;
            element.style.height = `${Math.min(maxHeight, height)}px`;
            e.preventDefault(); // Prevent scrolling while resizing
        }
    }, { passive: false });

    // Add a reset button to restore original position
    const resetButton = document.createElement('div');
    resetButton.className = 'reset-position-btn';
    resetButton.innerHTML = '↺';
    resetButton.setAttribute('aria-label', 'Reset position');
    element.appendChild(resetButton);

    resetButton.addEventListener('click', (e) => {
        resetPosition();
        e.stopPropagation();
    });

    resetButton.addEventListener('touchend', (e) => {
        resetPosition();
        e.stopPropagation();
        e.preventDefault();
    }, { passive: false });

    // Add a fullscreen toggle button
    const fullscreenButton = document.createElement('div');
    fullscreenButton.className = 'fullscreen-toggle-btn';
    fullscreenButton.innerHTML = '⛶';
    fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
    element.appendChild(fullscreenButton);

    let isFullscreen = false;
    fullscreenButton.addEventListener('click', (e) => {
        if (!isFullscreen) {
            element.style.left = '0px';
            element.style.top = '0px';
            element.style.width = `${window.innerWidth}px`;
            element.style.height = `${window.innerHeight}px`;
            element.style.zIndex = '1000';
            isFullscreen = true;
        } else {
            resetPosition();
            isFullscreen = false;
        }
        e.stopPropagation();
    });

    fullscreenButton.addEventListener('touchend', (e) => {
        if (!isFullscreen) {
            element.style.left = '0px';
            element.style.top = '0px';
            element.style.width = `${window.innerWidth}px`;
            element.style.height = `${window.innerHeight}px`;
            element.style.zIndex = '1000';
            isFullscreen = true;
        } else {
            resetPosition();
            isFullscreen = false;
        }
        e.stopPropagation();
        e.preventDefault();
    }, { passive: false });

    // Enhance drag to snap to edges
    function snapToEdge() {
        const snapThreshold = 30; // pixels
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (rect.left < snapThreshold) {
            element.style.left = '0px';
        }
        if (rect.top < snapThreshold) {
            element.style.top = '0px';
        }
        if (windowWidth - rect.right < snapThreshold) {
            element.style.left = `${windowWidth - rect.width}px`;
        }
        if (windowHeight - rect.bottom < snapThreshold) {
            element.style.top = `${windowHeight - rect.height}px`;
        }
    }

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            snapToEdge();
        }
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            snapToEdge();
        }
    });

    // Store position once visible
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style' &&
                element.style.display !== 'none' &&
                !originalPosition) {
                storeOriginalPosition();
            }
        });
    });
    
    observer.observe(element, { attributes: true });
}