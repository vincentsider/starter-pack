// public/js/components/navigation.js

/**
 * Gère la navigation responsive (menu hamburger).
 */
export function initResponsiveNavigation() {
    const hamburgerButton = document.getElementById('hamburger-button');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerButton && mainNav) {
        hamburgerButton.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerButton.classList.toggle('active');
            // Mettre à jour l'attribut aria-expanded pour l'accessibilité
            const isExpanded = mainNav.classList.contains('active');
            hamburgerButton.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                hamburgerButton.setAttribute('aria-label', 'Fermer le menu de navigation');
            } else {
                hamburgerButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
            }
        });

        // Optionnel : Fermer le menu si l'utilisateur clique en dehors
        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !hamburgerButton.contains(event.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburgerButton.classList.remove('active');
                hamburgerButton.setAttribute('aria-expanded', 'false');
                hamburgerButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
            }
        });

        // Optionnel : Fermer le menu lors du redimensionnement de la fenêtre si elle devient plus grande
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mainNav.classList.contains('active')) { // 768px est un point de rupture courant pour les tablettes
                mainNav.classList.remove('active');
                hamburgerButton.classList.remove('active');
                hamburgerButton.setAttribute('aria-expanded', 'false');
                hamburgerButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
            }
        });

        console.log("Gestionnaire de navigation responsive initialisé.");
    } else {
        console.warn("Bouton hamburger ou menu de navigation principal non trouvé. La navigation responsive ne fonctionnera pas.");
    }
}