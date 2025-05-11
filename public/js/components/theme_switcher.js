// public/js/components/theme_switcher.js

/**
 * Gère le changement de thème (clair/sombre) et sauvegarde la préférence utilisateur.
 */
export function initThemeSwitcher() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Récupérer le thème sauvegardé dans localStorage ou utiliser la préférence système
    const getCurrentTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    };

    // Appliquer le thème au chargement de la page
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggleButton) {
            themeToggleButton.setAttribute('aria-label', theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre');
            // Mettre à jour l'icône si nécessaire (par exemple, si vous utilisez des icônes différentes pour chaque thème)
            const icon = themeToggleButton.querySelector('i'); // Supposons que vous utilisez une balise <i> pour l'icône
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.remove('fa-moon'); // Exemple d'icône pour le thème clair
                    icon.classList.add('fa-sun');   // Exemple d'icône pour le thème sombre
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        }
        localStorage.setItem('theme', theme);
    };

    let currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme);
        });
    } else {
        console.warn("Bouton de changement de thème non trouvé. Le changement de thème manuel ne fonctionnera pas.");
    }

    // Écouter les changements de préférence système (si l'utilisateur n'a pas encore choisi manuellement)
    prefersDarkScheme.addEventListener('change', (e) => {
        // Ne change le thème que si l'utilisateur n'a pas déjà fait un choix explicite
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            applyTheme(currentTheme);
        }
    });

    console.log("Gestionnaire de thème initialisé. Thème actuel :", currentTheme);
}