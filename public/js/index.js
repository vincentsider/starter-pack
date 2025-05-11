// public/js/index.js

/**
 * Initialise la page d'accueil.
 * Charge les composants communs (header, footer) et exécute toute logique spécifique à la page d'accueil.
 */
async function initializeHomePage() {
    // Charger le header et le footer
    if (window.siteComponents && typeof window.siteComponents.loadCommonComponents === 'function') {
        await window.siteComponents.loadCommonComponents();
    } else {
        console.error("La librairie de composants (siteComponents) n'est pas chargée. Le header et le footer ne peuvent pas être injectés.");
        // Afficher un message d'erreur à l'utilisateur sur la page pourrait être une bonne fallback.
        const headerPlaceholder = document.getElementById('site-header-placeholder');
        const footerPlaceholder = document.getElementById('site-footer-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = "<p style='color:red;'>Erreur: Impossible de charger l'en-tête.</p>";
        if (footerPlaceholder) footerPlaceholder.innerHTML = "<p style='color:red;'>Erreur: Impossible de charger le pied de page.</p>";
        return;
    }

    // Logique spécifique à la page d'accueil ici (si nécessaire)
    // Par exemple, initialisation de carrousels, gestion d'animations spécifiques,
    // chargement de données dynamiques pour la section "hero" ou "témoignages".

    console.log("Page d'accueil initialisée et composants communs chargés.");

    // Exemple : Gestion d'un bouton d'appel à l'action
    const ctaButton = document.querySelector('.hero-section .cta-button'); // Supposant cette structure dans index.html
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            console.log("Bouton d'appel à l'action principal cliqué !");
            // Rediriger vers la page des tarifs ou une démo, par exemple
            // window.location.href = '/pricing.html';
        });
    }

    // Exemple : Animation simple au scroll pour certains éléments
    // (nécessiterait une librairie ou une implémentation custom)
    // setupScrollAnimations();
}

/**
 * S'assure que le DOM est complètement chargé avant d'exécuter les scripts d'initialisation.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeHomePage();
});

// Si d'autres modules JS ont besoin d'accéder à des fonctions spécifiques à l'index,
// exportez-les ici (si vous utilisez une structure de module ES6)
// export { initializeHomePage };