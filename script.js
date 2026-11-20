const themeButton = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeKey = 'studio-andre-theme';

let chosenTheme;
try {
  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme === 'light' || savedTheme === 'dark') chosenTheme = savedTheme;
} catch {
  // Keep theme switching available when browser storage is disabled.
}

function applyTheme() {
  const theme = chosenTheme ?? (systemTheme.matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
}

applyTheme();
themeButton.hidden = false;

themeButton.addEventListener('click', () => {
  chosenTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  try {
    localStorage.setItem(themeKey, chosenTheme);
  } catch {
    // The current page still uses the selected theme.
  }
});

systemTheme.addEventListener('change', applyTheme);

const navigation = document.querySelectorAll('nav a');

function updateNavigation() {
  const current = window.location.hash || '#home';
  navigation.forEach((link) => {
    if (link.hash === current) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

updateNavigation();
window.addEventListener('hashchange', updateNavigation);
