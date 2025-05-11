document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.language-selector button');
    const titleElement = document.querySelector('.hero h1');
    const welcomeParagraphElement = document.querySelector('.hero p');
    const footerTextElement = document.querySelector('footer p');

    const translations = {
        'fr': {
            title: "Bienvenue sur Notre Site Web",
            welcome: "Ceci est un exemple de page d'accueil responsive et multilingue. Explorez et découvrez les possibilités.",
            footer: "&copy; 2025 Votre Entreprise. Tous droits réservés."
        },
        'en': {
            title: "Welcome to Our Website",
            welcome: "This is an example of a responsive and multilingual homepage. Explore and discover the possibilities.",
            footer: "&copy; 2025 Your Company. All rights reserved."
        }
    };

    function updateContent(lang) {
        if (translations[lang]) {
            titleElement.textContent = translations[lang].title;
            welcomeParagraphElement.textContent = translations[lang].welcome;
            footerTextElement.innerHTML = translations[lang].footer; // Use innerHTML for copyright symbol
        }
    }

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            updateContent(lang);
            // Optionally, store user preference
            localStorage.setItem('preferredLanguage', lang);
        });
    });

    // Load preferred language or default to 'fr'
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    updateContent(preferredLanguage);
});