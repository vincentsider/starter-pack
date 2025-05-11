// public/js/components/header.js

/**
 * Initialise la logique de l'en-tête, y compris le menu de navigation mobile
 * et la gestion du lien actif.
 */
function initializeHeader() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNavigation = document.querySelector('.main-navigation');
    const navLinks = document.querySelectorAll('.main-navigation .nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is empty

    // Gestion du menu mobile
    if (mobileNavToggle && mainNavigation) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mainNavigation.classList.toggle('mobile-open');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded.toString());
            mobileNavToggle.classList.toggle('active'); // For styling the toggle button itself (e.g., X icon)
        });
    }

    // Gestion du lien actif
    navLinks.forEach(link => {
        // Retirer 'active' de tous les liens
        link.classList.remove('active');
        // Obtenir le nom de fichier du href du lien
        const linkPath = link.getAttribute('href').split('/').pop();

        if (linkPath === currentPath) {
            link.classList.add('active');
        }

        // Cas spécial pour la racine "/" qui doit pointer vers index.html
        if (currentPath === '' && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });

    // Optionnel: Fermer le menu mobile si on clique sur un lien (pour une meilleure UX sur mobile)
    if (mainNavigation && mainNavigation.classList.contains('mobile-open')) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavigation.classList.contains('mobile-open')) {
                    mainNavigation.classList.remove('mobile-open');
                    mobileNavToggle.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

// S'assurer que le DOM est chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', initializeHeader);