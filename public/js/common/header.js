// public/js/common/header.js

document.addEventListener('DOMContentLoaded', () => {
    // Gestion du menu burger
    const menuToggle = document.getElementById('menu-toggle');
    const mainNavigation = document.getElementById('main-navigation');

    if (menuToggle && mainNavigation) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNavigation.setAttribute('data-open', !isExpanded); // Utiliser un attribut data pour le style CSS
        });
    }

    // Gestion du lien actif de navigation
    const navLinks = document.querySelectorAll('.main-navigation .nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });


    // Gestion du sélecteur de langue
    const languageSwitcher = document.querySelector('.language-switcher');
    const currentLangBtn = document.getElementById('current-lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangFlag = document.getElementById('current-lang-flag');

    if (languageSwitcher && currentLangBtn && langDropdown && currentLangFlag) {
        currentLangBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêche la propagation au document pour la fermeture
            const isOpen = langDropdown.parentElement.getAttribute('data-open') === 'true';
            langDropdown.parentElement.setAttribute('data-open', !isOpen);
            currentLangBtn.setAttribute('aria-expanded', !isOpen);
        });

        const langOptions = langDropdown.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', async function() {
                const selectedLang = this.dataset.lang;
                
                // Mettre à jour l'affichage du bouton
                currentLangBtn.childNodes[0].nodeValue = ` ${this.textContent.trim().slice(-2)} `; // Met à jour le texte (FR, EN, ES)
                currentLangFlag.src = this.querySelector('.lang-flag').src;
                currentLangFlag.alt = this.querySelector('.lang-flag').alt;

                // Fermer le dropdown
                langDropdown.parentElement.setAttribute('data-open', 'false');
                currentLangBtn.setAttribute('aria-expanded', 'false');

                // Changer la langue via i18next (si i18next est chargé et initialisé)
                if (window.i18next && typeof window.changeLanguage === 'function') {
                    try {
                        await window.changeLanguage(selectedLang);
                        // Optionnel : stocker la langue sélectionnée dans localStorage
                        localStorage.setItem('selectedLanguage', selectedLang);
                    } catch (error) {
                        console.error('Erreur lors du changement de langue:', error);
                    }
                } else {
                    console.warn('i18next ou changeLanguage non disponible. Le changement de langue réel ne sera pas effectué.');
                     // Logique de secours si i18n.js n'est pas là ou window.changeLanguage non défini
                    localStorage.setItem('selectedLanguage', selectedLang);
                    location.reload(); // Recharger pour appliquer la langue si la gestion est basique
                }
            });
        });

        // Fermer le dropdown si on clique en dehors
        document.addEventListener('click', (event) => {
            if (!languageSwitcher.contains(event.target)) {
                langDropdown.parentElement.setAttribute('data-open', 'false');
                currentLangBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Initialiser avec la langue stockée ou par défaut
        const storedLang = localStorage.getItem('selectedLanguage');
        if (storedLang) {
            const activeOption = Array.from(langOptions).find(opt => opt.dataset.lang === storedLang);
            if (activeOption) {
                 currentLangBtn.childNodes[0].nodeValue = ` ${activeOption.textContent.trim().slice(-2)} `;
                 currentLangFlag.src = activeOption.querySelector('.lang-flag').src;
                 currentLangFlag.alt = activeOption.querySelector('.lang-flag').alt;
            }
        }
    }

    // Sticky header (optionnel, si vous voulez ajouter une classe quand il devient sticky)
    const header = document.getElementById('main-header');
    if (header) {
        const sticky = header.offsetTop;
        window.onscroll = function() {
            if (window.pageYOffset > sticky) {
                header.classList.add('sticky-header');
            } else {
                header.classList.remove('sticky-header');
            }
        };
    }
});