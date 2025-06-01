// State management
let usbState = false; // false = OFF, true = ON
let headphoneState = 'Disconnected'; // 'Disconnected', '3 Pin', '4 Pin'

// DOM elements
const usbButton = document.getElementById('usbButton');
const headphoneButton = document.getElementById('headphoneButton');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const optionButtons = document.querySelectorAll('.option-button');
const usbStatus = document.getElementById('usbStatus');
const headphoneStatus = document.getElementById('headphoneStatus');

// Initialize the application
function init() {
    updateUSBButton();
    updateHeadphoneButton();
    updateStatusPanel();
    attachEventListeners();
}

// Update USB button appearance and text
function updateUSBButton() {
    const statusSpan = usbButton.querySelector('.status');
    
    if (usbState) {
        usbButton.classList.remove('off');
        usbButton.classList.add('on');
        statusSpan.textContent = 'ON';
    } else {
        usbButton.classList.remove('on');
        usbButton.classList.add('off');
        statusSpan.textContent = 'OFF';
    }
}

// Update headphone button text
function updateHeadphoneButton() {
    const statusSpan = headphoneButton.querySelector('.status');
    statusSpan.textContent = headphoneState;
}

// Update status panel
function updateStatusPanel() {
    usbStatus.textContent = usbState ? 'ON' : 'OFF';
    headphoneStatus.textContent = headphoneState;
}

// Toggle USB state
function toggleUSB() {
    usbState = !usbState;
    updateUSBButton();
    updateStatusPanel();
    
    // Optional: Add some feedback
    console.log(`USB toggled to: ${usbState ? 'ON' : 'OFF'}`);
}

// Show headphone selection modal
function showHeadphoneModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Hide headphone selection modal
function hideHeadphoneModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Handle headphone option selection
function selectHeadphoneOption(option) {
    headphoneState = option;
    updateHeadphoneButton();
    updateStatusPanel();
    hideHeadphoneModal();
    
    // Optional: Add some feedback
    console.log(`Headphone option selected: ${option}`);
}

// Attach event listeners
function attachEventListeners() {
    // USB button click handler
    usbButton.addEventListener('click', toggleUSB);
    
    // Headphone button click handler
    headphoneButton.addEventListener('click', showHeadphoneModal);
    
    // Modal close button
    closeModalButton.addEventListener('click', hideHeadphoneModal);
    
    // Option buttons in modal
    optionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const option = e.currentTarget.getAttribute('data-option');
            selectHeadphoneOption(option);
        });
    });
    
    // Close modal when clicking outside of it
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideHeadphoneModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideHeadphoneModal();
        }
    });
}

// Add some additional interactive features
function addAdvancedFeatures() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // 'U' key for USB toggle
        if (e.key.toLowerCase() === 'u' && !modal.classList.contains('show')) {
            e.preventDefault();
            toggleUSB();
        }
        
        // 'H' key for headphone modal
        if (e.key.toLowerCase() === 'h' && !modal.classList.contains('show')) {
            e.preventDefault();
            showHeadphoneModal();
        }
        
        // Number keys for headphone options when modal is open
        if (modal.classList.contains('show')) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    selectHeadphoneOption('3 Pin');
                    break;
                case '2':
                    e.preventDefault();
                    selectHeadphoneOption('4 Pin');
                    break;
                case '3':
                    e.preventDefault();
                    selectHeadphoneOption('Disconnected');
                    break;
            }
        }
    });
    
    // Add button press animations
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    addAdvancedFeatures();
});

// Optional: Export functions for Tauri backend communication
window.addEventListener('DOMContentLoaded', () => {
    // You can add Tauri-specific functionality here if needed
    // For example, saving state to file system or communicating with system APIs
    
    // Example of how you might use Tauri's invoke function:
    /*
    import { invoke } from '@tauri-apps/api/tauri';
    
    async function saveState() {
        try {
            await invoke('save_device_state', {
                usb: usbState,
                headphone: headphoneState
            });
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }
    
    async function loadState() {
        try {
            const state = await invoke('load_device_state');
            usbState = state.usb;
            headphoneState = state.headphone;
            updateUSBButton();
            updateHeadphoneButton();
            updateStatusPanel();
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }
    */
});