const youtubeQuality = {
  'Auto': 'Auto',
  '1080p': '1080p',
  '720p': '720p',
  '480p': '480p',
  '360p': '360p',
  '240p': '240p',
  '144p': '144p'
};

document.addEventListener('DOMContentLoaded', () => {
  const popupContent = document.getElementById('popupContent');
  
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const url = tabs[0].url;
    
    if (url && url.includes('youtube.com')) {
      renderYouTubeUI();
    } else {
      renderUnsupportedUI();
    }
  });

  function renderYouTubeUI() {
    const qualitySection = document.createElement('div');
    qualitySection.className = 'quality-section';
    
    const qualityTitle = document.createElement('div');
    qualityTitle.className = 'section-title';
    qualityTitle.textContent = 'DEFAULT QUALITY';
    
    const qualitySelect = document.createElement('select');
    qualitySelect.className = 'quality-select';
    qualitySelect.id = 'qualitySelect';
    
    for (const [key, value] of Object.entries(youtubeQuality)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = value;
      qualitySelect.appendChild(option);
    }
    
    qualitySection.appendChild(qualityTitle);
    qualitySection.appendChild(qualitySelect);
    
    const codecSection = document.createElement('div');
    codecSection.className = 'codec-section';
    
    const codecTitle = document.createElement('div');
    codecTitle.className = 'section-title';
    codecTitle.textContent = 'H.264 CODEC';
    
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'codec-toggle';
    
    const toggleLabel = document.createElement('div');
    toggleLabel.className = 'toggle-label';
    toggleLabel.textContent = 'Enable H.264';
    
    const toggleWrapper = document.createElement('label');
    toggleWrapper.className = 'toggle-switch';
    
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.id = 'codecToggle';
    
    const toggleSlider = document.createElement('span');
    toggleSlider.className = 'toggle-slider';
    
    toggleWrapper.appendChild(toggleInput);
    toggleWrapper.appendChild(toggleSlider);
    
    toggleContainer.appendChild(toggleLabel);
    toggleContainer.appendChild(toggleWrapper);
    
    codecSection.appendChild(codecTitle);
    codecSection.appendChild(toggleContainer);
    
    popupContent.appendChild(qualitySection);
    popupContent.appendChild(codecSection);
    
    loadSettings();
    
    qualitySelect.addEventListener('change', handleQualityChange);
    toggleInput.addEventListener('change', handleCodecToggle);
  }

  function renderUnsupportedUI() {
    const unsupportedDiv = document.createElement('div');
    unsupportedDiv.className = 'unsupported-message';
    
    const warningImg = document.createElement('img');
    warningImg.src = '../icons/warning.png';
    warningImg.alt = 'Warning';
    
    const message = document.createElement('div');
    message.className = 'unsupported-text';
    message.textContent = 'Only YouTube is currently supported';
    
    unsupportedDiv.appendChild(warningImg);
    unsupportedDiv.appendChild(message);
    popupContent.appendChild(unsupportedDiv);
  }

  function loadSettings() {
    chrome.storage.local.get(
      ['qualityValue', 'h264Enabled'],
      (result) => {
        const qualitySelect = document.getElementById('qualitySelect');
        if (qualitySelect && result.qualityValue) {
          qualitySelect.value = result.qualityValue;
        }
        
        const codecToggle = document.getElementById('codecToggle');
        if (codecToggle) {
          codecToggle.checked = result.h264Enabled !== false; // Default to true
        }
      }
    );
  }

  function handleQualityChange(e) {
    const qualityValue = e.target.value;
    chrome.storage.local.set({ qualityValue });
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'qualityChange',
        quality: qualityValue
      });
    });
  }

  function handleCodecToggle(e) {
    const h264Enabled = e.target.checked;
    chrome.storage.local.set({ h264Enabled });
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    });
  }
});
