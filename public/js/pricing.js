// public/js/pricing.js

/**
 * Initialise la page des tarifs.
 * Charge les composants communs (header, footer) et exécute toute logique spécifique à cette page.
 */
async function initializePricingPage() {
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

    // Logique spécifique à la page des tarifs ici (si nécessaire)
    // Par exemple, gestion de la sélection des plans, interactivité des boutons d'abonnement,
    // affichage de messages promotionnels, etc.

    console.log("Page des tarifs initialisée et composants communs chargés.");

    // Exemple : Gestion des boutons "Choisir ce plan"
    const planButtons = document.querySelectorAll('.pricing-plan .cta-button'); // Supposant cette structure dans pricing.html
    planButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const planCard = event.target.closest('.pricing-plan');
            const planName = planCard?.querySelector('h3')?.textContent || 'un plan tarifaire';
            console.log(`L'utilisateur a cliqué pour choisir ${planName}.`);
            // Logique pour rediriger vers une page d'inscription, un checkout, ou afficher plus d'infos.
            // Par exemple: window.location.href = `/signup?plan=${encodeURIComponent(planName)}`;
        });
    });

    // Exemple : Bascule entre facturation mensuelle/annuelle (si applicable)
    // const billingToggle = document.getElementById('billing-toggle');
    // if (billingToggle) {
    //     billingToggle.addEventListener('change', (event) => {
    //         const isAnnual = event.target.checked;
    //         updatePricingDisplay(isAnnual); // Fonction à implémenter pour mettre à jour les prix affichés
    //         console.log(`Affichage des tarifs : ${isAnnual ? 'annuel' : 'mensuel'}`);
    //     });
    // }
}

// function updatePricingDisplay(isAnnual) {
//     // Logique pour changer les montants des prix affichés sur la page
//     // en fonction de la sélection mensuelle ou annuelle.
// }

/**
 * S'assure que le DOM est complètement chargé avant d'exécuter les scripts d'initialisation.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializePricingPage();
});

// Si d'autres modules JS ont besoin d'accéder à des fonctions spécifiques à la page des tarifs,
// exportez-les ici (si vous utilisez une structure de module ES6)
// export { initializePricingPage };