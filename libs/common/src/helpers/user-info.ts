export const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const longtitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      return { longitude: `${longtitude}`, latitude: `${latitude}` };
    });
  }
  return { longitude: '0', latitude: '0' };
};

export const getBrowser = () => {
  let browser;
  if (
    (navigator.userAgent.indexOf('Opera') ||
      navigator.userAgent.indexOf('OPR')) != -1
  ) {
    browser = 'Opera';
  } else if (navigator.userAgent.indexOf('Edg') != -1) {
    browser = 'Edge';
  } else if (navigator.userAgent.indexOf('Chrome') != -1) {
    browser = 'Chrome';
  } else if (navigator.userAgent.indexOf('Safari') != -1) {
    browser = 'Safari';
  } else if (navigator.userAgent.indexOf('Firefox') != -1) {
    browser = 'Firefox';
  } else if (
    navigator.userAgent.indexOf('MSIE') != -1
    // || !!document.documentMode == true
  ) {
    //IF IE > 10
    browser = 'IE';
  } else {
    browser = 'unknown';
  }
  return browser;
};

export const getOS = () => {
  let OSName = 'Unknown';
  if (window.navigator.userAgent.indexOf('Windows NT 10.0') != -1)
    OSName = 'Windows 10';
  if (window.navigator.userAgent.indexOf('Windows NT 6.3') != -1)
    OSName = 'Windows 8.1';
  if (window.navigator.userAgent.indexOf('Windows NT 6.2') != -1)
    OSName = 'Windows 8';
  if (window.navigator.userAgent.indexOf('Windows NT 6.1') != -1)
    OSName = 'Windows 7';
  if (window.navigator.userAgent.indexOf('Windows NT 6.0') != -1)
    OSName = 'Windows Vista';
  if (window.navigator.userAgent.indexOf('Windows NT 5.1') != -1)
    OSName = 'Windows XP';
  if (window.navigator.userAgent.indexOf('Windows NT 5.0') != -1)
    OSName = 'Windows 2000';
  if (window.navigator.userAgent.indexOf('Mac') != -1) OSName = 'Mac/iOS';
  if (window.navigator.userAgent.indexOf('X11') != -1) OSName = 'UNIX';
  if (window.navigator.userAgent.indexOf('Linux') != -1) OSName = 'Linux';
  return OSName;
};
