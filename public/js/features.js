// public/js/features.js

/**
 * Initialise la page des fonctionnalités.
 * Charge les composants communs (header, footer) et exécute toute logique spécifique à cette page.
 */
async function initializeFeaturesPage() {
    // Charger le header et le footer
    if (window.siteComponents && typeof window.siteComponents.loadCommonComponents === 'function') {
        await window.siteComponents.loadCommonComponents();
    } else {
        console.error("La librairie de composants (siteComponents) n'est pas chargée. Le header et le footer ne peuvent pas être injectés.");
        const headerPlaceholder = document.getElementById('site-header-placeholder');
        const footerPlaceholder = document.getElementById('site-footer-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = "<p style='color:red;'>Erreur: Impossible de charger l'en-tête.</p>";
        if (footerPlaceholder) footerPlaceholder.innerHTML = "<p style='color:red;'>Erreur: Impossible de charger le pied de page.</p>";
        return;
    }

    // Logique spécifique à la page des fonctionnalités ici (si nécessaire)
    // Par exemple, gestion des interactions avec les cartes de fonctionnalités,
    // filtres, ou animations spécifiques.

    console.log("Page des fonctionnalités initialisée et composants communs chargés.");

    // Exemple : Interactivité pour les cartes de fonctionnalités
    const featureCards = document.querySelectorAll('.feature-card'); // Supposant cette classe dans features.html
    featureCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            // Effet au survol, par exemple
            // card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseout', () => {
            // Rétablir l'effet
            // card.style.transform = 'scale(1)';
        });
        card.addEventListener('click', () => {
            const featureTitle = card.querySelector('h3')?.textContent || 'une fonctionnalité';
            console.log(`L'utilisateur s'intéresse à ${featureTitle}`);
            // Pourrait ouvrir un modal avec plus de détails, etc.
        });
    });
}

/**
 * S'assure que le DOM est complètement chargé avant d'exécuter les scripts d'initialisation.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeFeaturesPage();
});

// Si d'autres modules JS ont besoin d'accéder à des fonctions spécifiques à la page des fonctionnalités,
// exportez-les ici (si vous utilisez une structure de module ES6)
// export { initializeFeaturesPage };