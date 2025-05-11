// public/js/pages/home.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Page d'accueil chargée et script exécuté.");

    // Logique pour le slider de témoignages (si implémenté)
    // Exemple : initialiser un slider
    // if (document.querySelector('.testimonial-slider')) {
    //     // Code d'initialisation du slider
    // }

    // Gestion des liens CTA (si une action spécifique est nécessaire au clic)
    // Par exemple, tracking d'événements ou navigation douce (smooth scroll)
    const ctaButtons = document.querySelectorAll('.cta-button, .cta-link');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Implémenter le défilement doux si nécessaire
                // event.preventDefault();
                // document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
                console.log(`Défilement doux vers : ${href}`);
            } else if (this.dataset.pageLink) {
                // La navigation se fera via app.js pour charger les pages dynamiquement
                console.log(`Clic sur CTA pour charger la page : ${this.dataset.pageLink}`);
            }
        });
    });
});