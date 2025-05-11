// public/js/layout/header.js

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');
    const navLinks = document.querySelectorAll('.main-navigation .nav-link'); // Pour fermer le menu au clic

    // Gestion du menu mobile
    if (mobileMenuToggle && mainNavigation) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNavigation.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            // Empêcher le scroll du body lorsque le menu est ouvert
            document.body.style.overflow = mainNavigation.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer le menu mobile lors d'un clic sur un lien (pour les ancres ou SPA)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavigation.classList.contains('active')) {
                    mainNavigation.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Fermer le menu si on clique en dehors (optionnel, peut être gênant)
        // document.addEventListener('click', (event) => {
        //     if (mainNavigation.classList.contains('active') &&
        //         !mainNavigation.contains(event.target) &&
        //         !mobileMenuToggle.contains(event.target)) {
        //         mainNavigation.classList.remove('active');
        //         mobileMenuToggle.classList.remove('active');
        //         document.body.style.overflow = '';
        //     }
        // });
    }

    // Gestion du header au scroll
    if (header) {
        const scrollThreshold = 50; // Pixels à scroller avant d'ajouter la classe
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Gestion du lien actif (basé sur l'URL actuelle)
    // Cette partie est plus complexe pour un site statique multi-pages
    // et nécessite de comparer window.location.pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Prend le nom du fichier
    navLinks.forEach(link => {
        const linkPath = (link.getAttribute('href') || '').split('/').pop();
        if (linkPath === currentPath || (currentPath === 'index.html' && (linkPath === '' || linkPath === '/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });


    // Initialisation du sélecteur de langue (si i18next est utilisé et configuré)
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector && window.i18next && typeof window.changeLanguage === 'function') {
        // Pré-sélectionner la langue actuelle
        if (window.i18next.language) {
            const currentLang = window.i18next.language.split('-')[0]; // ex: 'fr-FR' -> 'fr'
            if (Array.from(languageSelector.options).some(opt => opt.value === currentLang)) {
                 languageSelector.value = currentLang;
            } else if (Array.from(languageSelector.options).some(opt => opt.value === window.i18next.language)) {
                 languageSelector.value = window.i18next.language; // Tenter avec la langue complète si la version courte n'existe pas
            }
        }

        languageSelector.addEventListener('change', (event) => {
            window.changeLanguage(event.target.value);
        });
    } else if (languageSelector) {
        // Comportement par défaut si i18n.js n'est pas (encore) chargé ou mal configuré
        // On pourrait rediriger ou stocker la préférence
        languageSelector.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            console.log(`Langue sélectionnée : ${selectedLang}. Implémenter la logique de changement de langue.`);
            // Exemple: redirection vers une version de la page dans la langue
            // window.location.pathname = window.location.pathname.replace(/\/(en|fr|es)\//, `/${selectedLang}/`);
            // Ou stocker dans localStorage et recharger
            localStorage.setItem('preferredLanguage', selectedLang);
            // Pour que cela prenne effet, il faudrait un script qui lise cette valeur au chargement
            // et adapte le contenu (ou charge les bons fichiers i18n)
            // window.location.reload(); // Attention, peut être déroutant.
        });

        // Initialiser avec la langue du localStorage si présente
        const preferredLang = localStorage.getItem('preferredLanguage');
        if (preferredLang) {
            if (Array.from(languageSelector.options).some(opt => opt.value === preferredLang)) {
                languageSelector.value = preferredLang;
            }
        }
    }
});