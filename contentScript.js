chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'qualityChange') {
    changeQualityLevelsForYoutube(message.quality);
  } else if (message.type === 'extensionToggle') {
    location.reload();
  }
});

const changeQualityLevelsForYoutube = (quality) => {
  const timerId = setInterval(() => {
    if (document.querySelector('div.ad-showing')) return;
    
    clearInterval(timerId);
    const button = document.querySelector('.ytp-settings-button');
    if (!button) return;
    
    button.click();
    
    setTimeout(() => {
      const qualityButtons = Array.from(document.querySelectorAll('.ytp-menuitem-label'))
        .filter(el => el.textContent === 'Quality');
      
      if (qualityButtons.length === 0) return;
      
      qualityButtons[0].click();
      
      setTimeout(() => {
        const qualityOptions = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem-label');
        for (const option of qualityOptions) {
          if (option.textContent === quality) {
            option.click();
            localStorage.setItem('selectedItem', quality);
            chrome.storage.local.set({ qualityValue: quality });
            return;
          }
        }
        
        if (qualityOptions.length > 0) {
          qualityOptions[0].click();
          const highestQuality = qualityOptions[0].textContent;
          localStorage.setItem('selectedItem', highestQuality);
          chrome.storage.local.set({ qualityValue: highestQuality });
        }
      }, 300);
    }, 100);
  }, 1000);
};

window.addEventListener('load', function() {
  chrome.storage.local.get(['extensionEnabled'], function(result) {
    const isEnabled = result.extensionEnabled !== false;
    
    if (isEnabled) {
      injectCode(chrome.runtime.getURL('./inject.js'));
    }
  });
});

function injectCode(src) {
  const script = document.createElement('script');
  script.src = src;
  (document.head || document.documentElement).appendChild(script);
}
