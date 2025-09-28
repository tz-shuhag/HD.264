(function () {
  var mse = window.MediaSource;
  if (mse) {
    var nativeITS = mse.isTypeSupported.bind(mse);
    mse.isTypeSupported = ourITS(nativeITS);
  }

  function ourITS(fallback) {
    return function (type) {
      if (!type) return '';

      // Block VP9 / VP09 / AV1
      const lower = type.toLowerCase();
      if (lower.includes('vp9') || lower.includes('vp09') || lower.includes('av01')) {
        return '';
      }

      // Allow everything else
      return fallback(type);
    };
  }
})();
