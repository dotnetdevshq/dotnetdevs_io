// Apply a saved override before the first paint. Without JavaScript CSS follows the system.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('dotnetdevs-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;
