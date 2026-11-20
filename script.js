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

const projectSearch = document.querySelector('#project-search');
const projectSearchStatus = document.querySelector('.project-search-status');

function normalizeSearchText(text) {
  return text.toLocaleLowerCase('nl').normalize('NFD').replace(/\p{M}/gu, '');
}

const projects = Array.from(document.querySelectorAll('.project-grid .project-card'), (card) => ({
  card,
  text: [...card.querySelector('.project-copy').children]
    .map((element) => normalizeSearchText(element.textContent))
    .join(' '),
}));

function filterProjects() {
  const query = normalizeSearchText(projectSearch.value).trim();
  const terms = query ? query.split(/\s+/) : [];
  let matches = 0;

  for (const { card, text } of projects) {
    const isMatch = terms.every((term) => text.includes(term));
    card.hidden = !isMatch;
    if (isMatch) matches += 1;
  }

  let message = '';
  if (query) {
    if (matches === 0) {
      message = 'Geen projecten gevonden. Probeer een andere zoekterm.';
    } else {
      message = matches === 1 ? '1 project gevonden.' : `${matches} projecten gevonden.`;
    }
  }

  if (projectSearchStatus.textContent !== message) projectSearchStatus.textContent = message;
}

projectSearch.addEventListener('input', filterProjects);
window.addEventListener('pageshow', filterProjects);
filterProjects();
projectSearch.closest('.project-search').hidden = false;
