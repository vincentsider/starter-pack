// public/js/components.js

/**
 * Charge de manière asynchrone le contenu HTML d'un composant dans un élément cible du DOM.
 * @param {string} componentPath - Le chemin vers le fichier HTML du composant (ex: '/components/header.html').
 * @param {string} targetElementId - L'ID de l'élément DOM où injecter le composant.
 * @param {function} [callback] - Une fonction optionnelle à exécuter après le chargement réussi du composant.
 */
async function loadComponent(componentPath, targetElementId, callback) {
    const targetElement = document.getElementById(targetElementId);

    if (!targetElement) {
        console.error(`L'élément cible avec l'ID '${targetElementId}' n'a pas été trouvé.`);
        return;
    }

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${componentPath}`);
        }
        const htmlContent = await response.text();
        targetElement.innerHTML = htmlContent;

        // Exécuter le callback si fourni
        if (callback && typeof callback === 'function') {
            callback();
        }
    } catch (error) {
        console.error(`Impossible de charger le composant depuis '${componentPath}':`, error);
        targetElement.innerHTML = `<p class="text-red-500">Erreur lors du chargement du composant ${componentPath}. Veuillez vérifier la console.</p>`;
    }
}

/**
 * Charge tous les composants communs de la page (header, footer).
 * Cette fonction peut être appelée depuis le script principal de chaque page.
 */
async function loadCommonComponents() {
    // Charger le header
    // Le callback pour le header pourrait être d'exécuter son script JS spécifique (header.js)
    // s'il n'est pas déjà chargé globalement ou si son initialisation dépend de l'injection.
    await loadComponent('/components/header.html', 'site-header-placeholder', () => {
        // Si header.js contient des initialisations spécifiques à exécuter APRÈS chargement du HTML du header
        // et qu'il n'est pas déjà un module qui s'auto-exécute ou chargé via <script type="module">
        // alors on pourrait appeler une fonction d'initialisation ici.
        // Pour l'instant, on suppose que header.js est inclus et s'exécute correctement.
        if (window.initializeHeader) { // Supposant une fonction globale dans header.js
            window.initializeHeader();
        }
    });

    // Charger le footer
    // De même pour le footer, son script footer.js (pour l'année dynamique)
    // doit s'exécuter après que le HTML du footer soit injecté.
    await loadComponent('/components/footer.html', 'site-footer-placeholder', () => {
        if (window.updateCopyrightYear) { // Supposant une fonction globale dans footer.js
             // Ou si updateCopyrightYear est déjà dans un DOMContentLoaded, on peut juste s'assurer que le script est là.
             // Pour plus de robustesse, on pourrait re-déclencher l'initialisation si nécessaire.
             // Cependant, si footer.js est inclus globalement et utilise DOMContentLoaded,
             // il se peut qu'il s'exécute avant que le placeholder ne soit rempli.
             // Une meilleure approche serait d'exporter une fonction initFooter() depuis footer.js et l'appeler ici.
             // Pour le moment, on s'attend à ce que updateCopyrightYear soit accessible globalement et appelé ici
             // ou que le script footer.js gère son exécution après son chargement.
             // La solution actuelle dans footer.js avec DOMContentLoaded devrait fonctionner
             // SI le script footer.js est chargé APRÈS que loadComponent ait inséré le HTML.
             // Pour assurer cela, on peut appeler dynamiquement la fonction ou s'assurer de l'ordre des scripts.
             // L'appel explicite ici est plus sûr.
            updateCopyrightYear();
        }
    });
}

// Exposition de la fonction pour l'utiliser dans les scripts de page.
// Si on utilise des modules ES6 partout, on ferait `export { loadComponent, loadCommonComponents };`
// Pour une compatibilité plus large avec des scripts simples :
window.siteComponents = {
    loadComponent,
    loadCommonComponents
};

// Note: L'approche ci-dessus pour les callbacks (window.initializeHeader, window.updateCopyrightYear)
// suppose que ces fonctions sont globales. Si header.js et footer.js sont des modules,
// ils devraient gérer leur propre initialisation ou exporter des fonctions d'initialisation
// qui seraient importées et appelées dans les scripts de page (index.js, features.js, etc.)
// après le chargement des composants.
// Une alternative plus propre serait que chaque composant JS écoute un événement personnalisé
// déclenché après l'injection de son HTML, ou que loadComponent retourne une promesse
// qui résout avec l'élément injecté, permettant d'attacher des scripts spécifiques.