// public/js/layout/theme_switcher.js

const THEME_KEY = 'user-preferred-theme';
const DARK_MODE_CLASS = 'dark-mode';
const LIGHT_MODE_CLASS = 'light-mode'; // Optionnel, si vous voulez une classe spécifique pour le mode clair

/**
 * Récupère le thème préféré de l'utilisateur depuis localStorage.
 * @returns {string | null} 'dark', 'light', ou null si non défini.
 */
function getPreferredTheme() {
    return localStorage.getItem(THEME_KEY);
}

/**
 * Sauvegarde le thème préféré de l'utilisateur dans localStorage.
 * @param {string} theme - Le thème à sauvegarder ('dark' ou 'light').
 */
function setPreferredTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Applique le thème (classe CSS) au corps du document.
 * @param {string} theme - Le thème à appliquer ('dark' ou 'light').
 */
function applyTheme(theme) {
    document.body.classList.remove(DARK_MODE_CLASS, LIGHT_MODE_CLASS);
    if (theme === 'dark') {
        document.body.classList.add(DARK_MODE_CLASS);
    } else {
        document.body.classList.add(LIGHT_MODE_CLASS); // Applique light-mode si ce n'est pas dark
    }
    // Mettre à jour l'attribut data-theme pour les styles CSS qui en dépendent
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Initialise le sélecteur de thème.
 * Gère la détection du thème système, le thème stocké localement et le bouton de basculement.
 */
export function initThemeSwitcher() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    if (!themeToggleButton) {
        console.warn("Bouton de basculement de thème non trouvé. Assurez-vous que l'ID 'theme-toggle-button' existe.");
        // Appliquer le thème par défaut même si le bouton n'existe pas
        loadAndApplyInitialTheme();
        return;
    }

    loadAndApplyInitialTheme();

    themeToggleButton.addEventListener('click', () => {
        const currentThemeIsDark = document.body.classList.contains(DARK_MODE_CLASS);
        const newTheme = currentThemeIsDark ? 'light' : 'dark';
        applyTheme(newTheme);
        setPreferredTheme(newTheme);
        updateToggleButtonAppearance(newTheme, themeToggleButton);
        console.log(`Thème basculé vers : ${newTheme}`);
    });

    // Écouter les changements de préférence de thème du système d'exploitation
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDarkScheme.addEventListener('change', (e) => {
        // Ne met à jour que si l'utilisateur n'a pas explicitement défini une préférence
        if (!getPreferredTheme()) {
            const systemTheme = e.matches ? 'dark' : 'light';
            applyTheme(systemTheme);
            updateToggleButtonAppearance(systemTheme, themeToggleButton);
            console.log(`Thème système changé vers : ${systemTheme}, appliqué car aucune préférence utilisateur.`);
        }
    });

    console.log("Sélecteur de thème initialisé.");
}

/**
 * Charge et applique le thème initial au chargement de la page.
 * Vérifie d'abord les préférences utilisateur stockées, puis les préférences système.
 */
function loadAndApplyInitialTheme() {
    const userPreferredTheme = getPreferredTheme();
    const themeToggleButton = document.getElementById('theme-toggle-button');

    if (userPreferredTheme) {
        applyTheme(userPreferredTheme);
        if (themeToggleButton) updateToggleButtonAppearance(userPreferredTheme, themeToggleButton);
        console.log(`Thème préféré utilisateur chargé : ${userPreferredTheme}`);
    } else {
        // Pas de préférence utilisateur, vérifier le thème système
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
        if (themeToggleButton) updateToggleButtonAppearance(systemTheme, themeToggleButton);
        console.log(`Thème système détecté et appliqué : ${systemTheme}`);
    }
}

/**
 * Met à jour l'apparence du bouton de basculement (icône, texte) en fonction du thème actuel.
 * @param {string} currentTheme - Le thème actuel ('dark' ou 'light').
 * @param {HTMLElement} buttonElement - L'élément du bouton de basculement.
 */
function updateToggleButtonAppearance(currentTheme, buttonElement) {
    if (!buttonElement) return;

    // Exemple : basculer une classe sur le bouton ou changer son contenu (icône/texte)
    // Vous devrez adapter cela à la structure HTML de votre bouton.
    const iconLight = buttonElement.querySelector('.icon-light-mode');
    const iconDark = buttonElement.querySelector('.icon-dark-mode');
    const srText = buttonElement.querySelector('.sr-only'); // Texte pour lecteur d'écran

    if (currentTheme === 'dark') {
        if (iconLight) iconLight.style.display = 'inline-block'; // Montrer l'icône pour passer en mode clair
        if (iconDark) iconDark.style.display = 'none';
        buttonElement.setAttribute('aria-label', 'Passer en mode clair');
        if (srText) srText.textContent = 'Passer en mode clair';
    } else {
        if (iconLight) iconLight.style.display = 'none';
        if (iconDark) iconDark.style.display = 'inline-block'; // Montrer l'icône pour passer en mode sombre
        buttonElement.setAttribute('aria-label', 'Passer en mode sombre');
        if (srText) srText.textContent = 'Passer en mode sombre';
    }
}