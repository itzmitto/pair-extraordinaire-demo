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
  text: [...card.querySelectorAll('.project-copy > p, .project-copy > h3')]
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

const projectDetails = {
  fieldwork: {
    description: 'Fieldwork verkent hoe een buitenmerk herkenbaar blijft op een poster en in een kleine digitale uiting. Donkergroen, een felgroen accent en grote letters dragen de identiteit. Concentrische lijnen verwijzen naar hoogtelijnen op een kaart.',
    technologies: ['Typografie', 'Kleursysteem', 'CSS-patronen'],
    deliverable: 'Een conceptidentiteit met een kleurenpalet, typografische regels en een postermock-up.',
  },
  forma: {
    description: 'Forma verkent welke informatie iemand nodig heeft om een dagelijkse gewoonte vol te houden. Het dagscherm geeft de eerstvolgende actie voorrang. Een compacte grafiek laat zien hoe de voortgang zich over meerdere dagen ontwikkelt.',
    technologies: ['Mobiel interfaceontwerp', 'Datavisualisatie', 'CSS-mock-ups'],
    deliverable: 'Een mobiel appconcept met een dagscherm en een voortgangsweergave.',
  },
  offset: {
    description: 'Offset brengt de uitstraling van een onafhankelijk gedrukt magazine naar het web. Grote koppen, een warm papierpalet en diagonale patronen geven het ontwerp een eigen karakter. De lay-out biedt ruimte voor beeld en langere artikelen.',
    technologies: ['HTML', 'CSS Grid', 'Responsive CSS'],
    deliverable: 'Een webconcept voor een onafhankelijk magazine, met een digitale omslag en een redactioneel lay-outvoorstel.',
  },
};

const projectDialog = document.querySelector('.project-dialog');
const dialogTitle = document.querySelector('#project-dialog-title');
const dialogType = document.querySelector('#project-dialog-type');
const dialogDescription = document.querySelector('#project-dialog-description');
const dialogTechnologies = document.querySelector('#project-dialog-technologies');
const dialogDeliverable = document.querySelector('#project-dialog-deliverable');

for (const { card } of projects) {
  const trigger = card.querySelector('.project-trigger');
  const details = projectDetails[trigger.dataset.project];

  trigger.addEventListener('click', () => {
    dialogTitle.textContent = card.querySelector('h3').textContent;
    dialogType.textContent = card.querySelector('.project-type').textContent;
    dialogDescription.textContent = details.description;
    dialogTechnologies.replaceChildren(...details.technologies.map((technology) => {
      const item = document.createElement('li');
      item.textContent = technology;
      return item;
    }));
    dialogDeliverable.textContent = details.deliverable;
    projectDialog.showModal();
  });

  trigger.hidden = false;
}
