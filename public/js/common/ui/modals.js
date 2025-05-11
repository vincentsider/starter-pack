// public/js/common/ui/modals.js

/**
 * Initialise la logique pour toutes les modales de la page.
 * Gère l'ouverture et la fermeture des modales.
 */
function initializeModals() {
    // Sélectionne tous les déclencheurs de modale
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    
    // Sélectionne toutes les modales
    const modals = document.querySelectorAll('.modal');

    // Configure les déclencheurs pour ouvrir les modales
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetModalId = this.getAttribute('data-bs-target');
            if (targetModalId) {
                const targetModal = document.querySelector(targetModalId);
                if (targetModal) {
                    openModal(targetModal);
                } else {
                    console.warn(`Modal with ID '${targetModalId}' not found.`);
                }
            } else {
                console.warn('Modal trigger does not have a data-bs-target attribute.');
            }
        });
    });

    // Configure les boutons de fermeture et la fermeture en cliquant à l'extérieur
    modals.forEach(modal => {
        // Fermeture via le bouton de fermeture (avec la classe .btn-close ou l'attribut data-bs-dismiss="modal")
        const closeButtons = modal.querySelectorAll('.btn-close, [data-bs-dismiss="modal"]');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeModal(modal);
            });
        });

        // Fermeture en cliquant à l'extérieur de la modale (sur le .modal-backdrop)
        modal.addEventListener('click', function(event) {
            // Si le clic est directement sur l'élément modal (le fond)
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModalElement = document.querySelector('.modal.show');
            if (openModalElement) {
                closeModal(openModalElement);
            }
        }
    });
}

/**
 * Ouvre une modale spécifiée.
 * @param {HTMLElement} modalElement - L'élément de la modale à ouvrir.
 */
function openModal(modalElement) {
    if (!modalElement) return;

    // Ajouter la classe 'show' pour afficher la modale avec une transition
    modalElement.style.display = 'block'; // Assurez-vous que la modale est affichable
    
    // Forcer un reflow pour que la transition CSS s'applique
    // Solution simple : utiliser requestAnimationFrame ou un petit délai
    requestAnimationFrame(() => {
        modalElement.classList.add('show');
        document.body.classList.add('modal-open'); // Empêche le scroll du body

        // Créer et ajouter un backdrop si nécessaire (style Bootstrap)
        let backdrop = document.querySelector('.modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade';
            document.body.appendChild(backdrop);
            requestAnimationFrame(() => { // Pour la transition du backdrop
                 backdrop.classList.add('show');
            });
        }
    });
     // Mettre le focus sur la modale ou son premier élément focusable
     const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
     if (focusableElements.length > 0) {
         focusableElements[0].focus();
     }
}

/**
 * Ferme une modale spécifiée.
 * @param {HTMLElement} modalElement - L'élément de la modale à fermer.
 */
function closeModal(modalElement) {
    if (!modalElement) return;

    modalElement.classList.remove('show');
    document.body.classList.remove('modal-open');

    // Gérer le backdrop
    const backdrop = document.querySelector('.modal-backdrop.show');
    if (backdrop) {
        backdrop.classList.remove('show');
        // Supprimer le backdrop après la transition
        backdrop.addEventListener('transitionend', () => {
            if (backdrop.parentNode) { // Vérifier s'il est toujours dans le DOM
                backdrop.parentNode.removeChild(backdrop);
            }
        }, { once: true });
    }


    // Masquer la modale après la transition pour qu'elle ne bloque pas les interactions
    // Utilisez 'transitionend' pour s'assurer que la transition est terminée
    modalElement.addEventListener('transitionend', () => {
        if (!modalElement.classList.contains('show')) { // Vérifier si elle ne doit plus être visible
            modalElement.style.display = 'none';
        }
    }, { once: true }); // 'once: true' pour que l'écouteur soit retiré après exécution
}

// Initialisation des modales lorsque le DOM est prêt.
document.addEventListener('DOMContentLoaded', () => {
    initializeModals();
});