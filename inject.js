function inject() {
  let videoElem = document.createElement('video');
  let origCanPlayType = videoElem.canPlayType.bind(videoElem);
  
  videoElem.__proto__.canPlayType = makeCustomType(origCanPlayType);
  
  if (window.MediaSource) {
    const mse = window.MediaSource;
    const origIsTypeSupported = mse.isTypeSupported.bind(mse);
    mse.isTypeSupported = makeCustomType(origIsTypeSupported);
  }
  
  function makeCustomType(origChecker) {
    return function(type) {
      if (!type) return '';
      
      if (type.includes('av01') || type.includes('vp09') || type.includes('vp9')) {
        return '';
      }
      
      return origChecker(type);
    };
  }
}

inject();
