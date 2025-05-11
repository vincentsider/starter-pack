// Initialisation et configuration de i18next
async function initI18next() {
  const i18nextInstance = i18next
    .use(i18nextBrowserLanguageDetector)
    .use(i18nextHttpBackend);

  try {
    await i18nextInstance.init({
      debug: false, // Mettre à true pour le débogage
      fallbackLng: 'fr',
      supportedLngs: ['fr', 'en', 'es'],
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json', // Correction du chemin si vos fichiers sont dans public/
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      }
    });
    updateContent();
    setupLanguageSelector();
  } catch (error) {
    console.error("Erreur lors de l'initialisation de i18next:", error);
  }
}

// Met à jour le contenu textuel de la page
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const optionsAttr = element.getAttribute('data-i18n-options');
    let options = {};
    if (optionsAttr) {
      try {
        options = JSON.parse(optionsAttr);
      } catch (e) {
        console.error(`Erreur lors de l'analyse des options JSON pour la clé ${key}:`, e);
      }
    }

    // Gérer le remplacement de l'année dans le footer
    if (key === 'footer.copyright') { // Correction de la clé
      options = { ...options, year: new Date().getFullYear() };
    }

    const translation = i18next.t(key, options);

    // Si l'élément est une balise <title>, mettre à jour document.title
    if (element.tagName.toLowerCase() === 'title') {
      document.title = translation;
    } else if (element.hasAttribute('placeholder')) {
      element.setAttribute('placeholder', translation);
    } else if (element.tagName.toLowerCase() === 'meta' && element.getAttribute('name') === 'description') {
        element.setAttribute('content', translation);
    } else if (element.tagName.toLowerCase() === 'meta' && element.getAttribute('name') === 'keywords') {
        element.setAttribute('content', translation);
    }
    else {
      element.innerHTML = translation;
    }
  });

  // Mettre à jour l'attribut lang de la balise html
  const currentLanguage = i18next.language.split('-')[0]; // ex: 'fr-FR' -> 'fr'
  document.documentElement.lang = currentLanguage;

  // Mettre à jour la valeur sélectionnée dans le sélecteur de langue
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    langSelector.value = currentLanguage;
  }
}

// Configure le sélecteur de langue
function setupLanguageSelector() {
  const langSelector = document.getElementById('language-selector');
  if (langSelector) {
    // La valeur est déjà définie par updateContent lors de l'initialisation

    langSelector.addEventListener('change', (event) => {
      const selectedLanguage = event.target.value;
      i18next.changeLanguage(selectedLanguage, (err) => {
        if (err) {
          return console.error("Erreur lors du changement de langue:", err);
        }
        updateContent();
        // Stocker la préférence dans localStorage
        localStorage.setItem('i18nextLng', selectedLanguage);
      });
    });
  }
}

// Appeler initI18next lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  initI18next();
});