const buildEndpointUrl = (path, route) => {
  if (!route) {
    route = '/api';
  }

  if (window.location.hostname === 'localhost') {
    return `${window.location.protocol}//${window.location.hostname}:3050${route}/${path}`;
  }

  return `${window.location.origin}${route}/${path}`;
};

const createCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

const readCookie = (name) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

const deleteCookie = (name) => {
  createCookie(name, '', -1);
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const downloadXLSX = (data, filenamePrefix = 'export') => {
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

  const filename = `${filenamePrefix}-${Date.now()}`;

  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
}

export {
  buildEndpointUrl,
  createCookie,
  readCookie,
  deleteCookie,
  scrollToTop,
  downloadXLSX
};
