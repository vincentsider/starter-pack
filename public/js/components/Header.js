// public/js/components/Header.js
import { loadTranslations, getCurrentLanguage, setCurrentLanguage, getSupportedLanguages } from '../i18n.js';

/**
 * Charge et affiche le header.
 * Insère le HTML du header dans l'élément <header> de la page.
 * Gère la navigation, le sélecteur de langue et le menu burger pour mobile.
 */
export async function displayHeader() {
    const headerElement = document.querySelector('header#app-header');
    if (!headerElement) {
        console.error("L'élément header#app-header est introuvable dans le DOM.");
        return;
    }

    // HTML du Header (simplifié, sera enrichi avec i18n)
    headerElement.innerHTML = `
        <div class="container header-container">
            <div class="logo">
                <a href="#" data-page-link="home" aria-label="Accueil">
                    <img src="assets/images/logo.svg" alt="Logo Assistant Filtrage IA" id="logo-img">
                    <span id="logo-text" data-i18n="header.logo_text">FilterGuard</span>
                </a>
            </div>
            <nav class="main-nav" aria-label="Navigation principale">
                <button class="nav-toggle" aria-label="Ouvrir le menu de navigation" aria-expanded="false">
                    <span class="sr-only" data-i18n="header.nav.toggle_open">Ouvrir Menu</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <ul class="nav-links">
                    <li><a href="#" data-page-link="home" data-i18n="header.nav.home">Accueil</a></li>
                    <li><a href="#" data-page-link="features" data-i18n="header.nav.features">Fonctionnalités</a></li>
                    <li><a href="#" data-page-link="pricing" data-i18n="header.nav.pricing">Tarifs</a></li>
                    <li><a href="#" data-page-link="contact" data-i18n="header.nav.contact">Contact</a></li>
                </ul>
            </nav>
            <div class="language-selector">
                <label for="lang-select" class="sr-only" data-i18n="header.language_selector_label">Choisir la langue</label>
                <select id="lang-select" aria-label="Sélecteur de langue">
                    <!-- Les options seront peuplées dynamiquement -->
                </select>
            </div>
        </div>
    `;

    await setupLanguageSelector();
    setupNavigation();
    updateHeaderTranslations(); // Appliquer les traductions initiales
}

/**
 * Configure le sélecteur de langue.
 * Peuple les options de langue et gère le changement de langue.
 */
async function setupLanguageSelector() {
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) return;

    const supportedLanguages = getSupportedLanguages();
    const currentLang = getCurrentLanguage();

    supportedLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        option.selected = lang.code === currentLang;
        langSelect.appendChild(option);
    });

    langSelect.addEventListener('change', async (event) => {
        const newLang = event.target.value;
        setCurrentLanguage(newLang);
        await loadTranslations(newLang);
        // Recharger dynamiquement le contenu de la page actuelle ou au moins les textes traduisibles
        // Ceci sera géré par app.js ou une fonction de re-rendu globale.
        // Pour l'instant, on met à jour les textes du header et de la page si possible.
        updateHeaderTranslations();
        // Déléguer la mise à jour du contenu de la page principale à app.js
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));

    });
}

/**
 * Configure la navigation principale, y compris le menu burger pour mobile.
 */
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navToggleLabel = navToggle?.querySelector('.sr-only');


    if (navToggle && navLinks && navToggleLabel) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            if (!isExpanded) {
                navToggleLabel.setAttribute('data-i18n', 'header.nav.toggle_close');
            } else {
                navToggleLabel.setAttribute('data-i18n', 'header.nav.toggle_open');
            }
            // Mettre à jour la traduction du label du bouton
            const i18nInstance = window.i18n;
            if (i18nInstance) {
                i18nInstance.updateContent();
            }
        });
    }

    // Fermer le menu si on clique sur un lien (utile en mode mobile)
    const links = navLinks?.querySelectorAll('a[data-page-link]');
    links?.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navToggle?.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                navToggleLabel?.setAttribute('data-i18n', 'header.nav.toggle_open');
                const i18nInstance = window.i18n;
                if (i18nInstance) {
                    i18nInstance.updateContent();
                }
            }
        });
    });
}


/**
 * Met à jour les textes traduisibles du header.
 * Doit être appelée après le chargement des traductions.
 */
export function updateHeaderTranslations() {
    const i18nInstance = window.i18n;
    if (i18nInstance) {
        // Mettre à jour les éléments spécifiques au header qui ne sont pas dans le innerHTML dynamique
        // ou qui ont besoin d'être rafraîchis après un changement de langue.
        // Par exemple, si le logo avait un texte qui changeait, ou des aria-labels.
        // Pour l'instant, la plupart des textes sont dans le innerHTML et seront mis à jour par i18n.updateContent() globalement.
        i18nInstance.updateContent(); // Ceci devrait mettre à jour tous les data-i18n
    }
}