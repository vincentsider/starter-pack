// public/js/layout/navigation.js

/**
 * Initialise la gestion du menu de navigation mobile.
 * Attend un bouton avec l'ID 'mobile-menu-button' et un conteneur de menu avec l'ID 'mobile-menu'.
 */
export function initMobileNavigation() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu'); // Le conteneur du menu de navigation
    const mainContent = document.querySelector('main'); // Pour le focus trap et aria-hidden

    if (!menuButton || !mobileMenu) {
        console.warn("Bouton de menu mobile ou conteneur de menu non trouvé. Assurez-vous que les IDs 'mobile-menu-button' et 'mobile-menu' existent.");
        return;
    }

    // Fonction pour basculer l'état du menu
    const toggleMenu = () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('active'); // Classe pour afficher/masquer le menu
        document.body.classList.toggle('no-scroll'); // Optionnel: pour bloquer le scroll du body

        if (!isExpanded) {
            // Menu ouvert
            mobileMenu.removeAttribute('hidden');
            if (mainContent) mainContent.setAttribute('aria-hidden', 'true'); // Cache le contenu principal aux lecteurs d'écran
            // Focus sur le premier lien dans le menu
            const firstFocusableElement = mobileMenu.querySelector('a[href], button:not([disabled])');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        } else {
            // Menu fermé
            mobileMenu.setAttribute('hidden', '');
            if (mainContent) mainContent.removeAttribute('aria-hidden'); // Rend le contenu principal à nouveau accessible
            menuButton.focus(); // Remet le focus sur le bouton du menu
        }
    };

    menuButton.addEventListener('click', toggleMenu);

    // Fermer le menu si on clique sur un lien à l'intérieur (pour les ancres ou navigation SPA)
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                // Vérifie si c'est une ancre sur la même page ou une navigation
                // Si c'est une navigation vers une autre page, le menu se fermera naturellement.
                // Si c'est une ancre, on force la fermeture.
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    toggleMenu();
                } else if (!href || href === '#' || (link.target !== '_blank' && !link.download)) {
                    // S'il n'y a pas de href, c'est un bouton, ou si c'est une navigation non-externe/téléchargement
                    // Forcer la fermeture si le menu est toujours actif.
                    // Cela peut être utile si la navigation est gérée par JS (SPA).
                    // toggleMenu(); // Décommentez si nécessaire pour les SPA.
                }
            }
        });
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Gestion du focus trap dans le menu mobile ouvert
    mobileMenu.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' && mobileMenu.classList.contains('active')) {
            const focusableElements = Array.from(
                mobileMenu.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')
            ).filter(el => el.offsetParent !== null); // Seulement les éléments visibles

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    });


    console.log("Navigation mobile initialisée.");
}

// D'autres fonctions de navigation peuvent être ajoutées ici, par exemple :
// - Gestion des menus déroulants dans la navigation principale (desktop)
// - Mise en évidence du lien actif
// - Scroll-spy pour la navigation sur une seule page