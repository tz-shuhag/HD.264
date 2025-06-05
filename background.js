function isYouTubeUrl(url) {
  return url && (url.includes('youtube.com') || url.includes('youtube-nocookie.com'));
}

function sendQualityMessage(tabId, quality) {
  chrome.tabs.sendMessage(tabId, { 
    type: 'qualityChange',
    quality: quality
  }, (response) => {
    if (chrome.runtime.lastError && chrome.runtime.lastError.message.includes("Could not establish connection")) {
      return;
    }
  });
}

function applyQualitySettings(tabId) {
  chrome.storage.local.get(['qualityValue'], (res) => {
    const quality = res.qualityValue || '1080p';
    sendQualityMessage(tabId, quality);
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && isYouTubeUrl(tab.url)) {
    applyQualitySettings(tabId);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url && isYouTubeUrl(tab.url)) {
      applyQualitySettings(activeInfo.tabId);
    }
  });
});

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      qualityValue: '1080p',
      extensionEnabled: true
    });
  }
});
