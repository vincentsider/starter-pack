// public/js/components/ui.js

/**
 * Initialise tous les composants UI sur la page.
 * Actuellement, cela inclut les modales, les accordéons et les carrousels (si Bootstrap est utilisé).
 * Des implémentations personnalisées peuvent être ajoutées ici si nécessaire.
 */
function initializeUIComponents() {
    initializeModals();
    initializeAccordions();
    // initializeCarousels(); // Décommentez si vous utilisez Bootstrap Carousel ou un carrousel personnalisé
}

/**
 * Initialise les modales.
 * Cela suppose l'utilisation de Bootstrap pour les modales.
 * Si vous utilisez une solution personnalisée, adaptez ce code.
 */
function initializeModals() {
    // Logique pour les modales Bootstrap (exemple)
    // Assurez-vous que Bootstrap JS est inclus et initialisé si vous utilisez leurs composants.
    // Par exemple, pour ouvrir une modale par programmation :
    // var myModal = new bootstrap.Modal(document.getElementById('myModalElement'), options);
    // myModal.show();

    // Logique pour les modales personnalisées (si nécessaire)
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]'); // ou sélecteur personnalisé
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetModalId = this.getAttribute('data-bs-target'); // ou attribut personnalisé
            if (targetModalId) {
                const targetModal = document.querySelector(targetModalId);
                if (targetModal) {
                    // Pour Bootstrap, la gestion est automatique.
                    // Pour une modale personnalisée :
                    // targetModal.classList.add('is-active'); // ou une classe pour afficher
                    console.log(`Modal ${targetModalId} triggered.`);
                }
            }
        });
    });

    // Fermeture des modales personnalisées
    const modalClosers = document.querySelectorAll('.modal-close-button'); // Sélecteur pour les boutons de fermeture
    modalClosers.forEach(closer => {
        closer.addEventListener('click', function() {
            const modal = this.closest('.modal'); // Trouver la modale parente
            if (modal) {
                // modal.classList.remove('is-active');
                console.log(`Modal closed.`);
            }
        });
    });
}

/**
 * Initialise les accordéons.
 * Cela suppose l'utilisation de Bootstrap pour les accordéons.
 * Adaptez si vous utilisez une solution personnalisée.
 */
function initializeAccordions() {
    // Logique pour les accordéons Bootstrap (exemple)
    // Les accordéons Bootstrap fonctionnent principalement avec des attributs data-bs-*.
    // Pour une gestion personnalisée :
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // La gestion de Bootstrap est automatique via les attributs.
            // Si c'est un accordéon personnalisé :
            // const content = this.nextElementSibling;
            // content.style.display = content.style.display === 'block' ? 'none' : 'block';
            // this.classList.toggle('active');
            console.log(`Accordion item toggled: ${this.textContent.trim()}`);
        });
    });
}

/**
 * Initialise les carrousels.
 * Cela suppose l'utilisation de Bootstrap Carousel.
 * Adaptez si vous utilisez une solution personnalisée.
 */
function initializeCarousels() {
    // Logique pour les carrousels Bootstrap (exemple)
    // var myCarousel = document.querySelector('#myCarousel');
    // var carousel = new bootstrap.Carousel(myCarousel, {
    //  interval: 2000,
    //  wrap: false
    // });
    // Pour une gestion personnalisée, la logique serait plus complexe ici.
    console.log("Carousels would be initialized here if any.");
}

// Exécute l'initialisation lorsque le DOM est prêt.
document.addEventListener('DOMContentLoaded', initializeUIComponents);