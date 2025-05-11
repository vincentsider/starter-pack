// public/js/common/ui/navigation.js

/**
 * Gère le basculement du menu de navigation mobile.
 * Recherche un bouton avec la classe '.navbar-toggler' et un élément avec la classe '.navbar-collapse'.
 * Au clic sur le bouton, bascule la classe 'show' sur l'élément '.navbar-collapse'.
 */
function initializeMobileMenuToggle() {
    const toggler = document.querySelector('.navbar-toggler');
    const collapseMenu = document.querySelector('.navbar-collapse');
    const mainNav = document.querySelector('#mainNav'); // ou un autre sélecteur pour votre barre de navigation principale

    if (toggler && collapseMenu) {
        toggler.addEventListener('click', function() {
            const isExpanded = toggler.getAttribute('aria-expanded') === 'true';
            toggler.setAttribute('aria-expanded', !isExpanded);
            collapseMenu.classList.toggle('show');

            // Optionnel: ajouter une classe au body pour un style global ou pour empêcher le scroll
            document.body.classList.toggle('mobile-menu-open');

            // Optionnel: changer la couleur de fond de la navbar si elle est transparente initialement
            if (mainNav && mainNav.classList.contains('navbar-transparent') && !mainNav.classList.contains('scrolled')) {
                if (collapseMenu.classList.contains('show')) {
                    mainNav.classList.add('navbar-toggled-background');
                } else {
                    mainNav.classList.remove('navbar-toggled-background');
                }
            }
        });
    } else {
        if (!toggler) {
            console.warn('Bouton de basculement du menu mobile (.navbar-toggler) non trouvé.');
        }
        if (!collapseMenu) {
            console.warn('Élément de menu mobile à afficher/masquer (.navbar-collapse) non trouvé.');
        }
    }
}

/**
 * Gère la fermeture du menu mobile lorsqu'un lien est cliqué.
 * Utile pour les Single Page Applications (SPA) ou pour une meilleure UX.
 */
function initializeMobileMenuLinkCloser() {
    const collapseMenu = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');

    if (collapseMenu && toggler) {
        const links = collapseMenu.querySelectorAll('a[href^="#"], a[href^="/"]'); // Liens internes ou d'ancrage
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (collapseMenu.classList.contains('show')) {
                    collapseMenu.classList.remove('show');
                    toggler.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('mobile-menu-open');

                    const mainNav = document.querySelector('#mainNav');
                    if (mainNav && mainNav.classList.contains('navbar-toggled-background') && !mainNav.classList.contains('scrolled')) {
                         mainNav.classList.remove('navbar-toggled-background');
                    }
                }
            });
        });
    }
}


// Initialisation des fonctionnalités lorsque le DOM est prêt.
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenuToggle();
    initializeMobileMenuLinkCloser();
});