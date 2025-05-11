// public/js/main.js
import { initNavigation } from './layout/navigation.js';
import { initThemeSwitcher } from './layout/theme_switcher.js';
import { initI18n } from './i18n.js'; // Assurez-vous que le chemin est correct
// Importer d'autres modules spécifiques aux pages ou aux composants ici si nécessaire
// Par exemple : import { initContactForm } from './components/contact_form.js';

/**
 * Initialise toutes les fonctionnalités principales du site lorsque le DOM est chargé.
 */
function initializeApp() {
    console.log("Initialisation de l'application...");

    initI18n().then(() => {
        console.log("i18n initialisé. Prêt à initialiser les autres modules.");
        initNavigation();
        initThemeSwitcher();

        // Initialiser d'autres modules spécifiques ici
        // Exemple pour un formulaire de contact sur la page de contact :
        // if (document.getElementById('contact-form')) { // Vérifie si l'élément du formulaire existe
        //     initContactForm();
        // }

        // Exemple pour des fonctionnalités spécifiques à la page d'accueil
        // if (document.body.classList.contains('home-page')) { // Supposant une classe sur le body pour la page d'accueil
        //     // initHomePageFeatures();
        // }

        console.log("Application initialisée avec succès.");
    }).catch(error => {
        console.error("Erreur lors de l'initialisation de i18n:", error);
        // Initialiser les autres modules même si i18n échoue, ou gérer l'erreur différemment
        initNavigation();
        initThemeSwitcher();
    });
}

// S'assurer que le DOM est entièrement chargé avant d'exécuter le script principal
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Le DOM est déjà prêt
    initializeApp();
}