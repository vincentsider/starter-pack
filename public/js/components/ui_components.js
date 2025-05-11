// public/js/components/ui_components.js

/**
 * Initialise les composants UI réutilisables sur le site.
 * Exemples : modales, accordéons, carrousels, tooltips, etc.
 * Pour l'instant, cette fonction est un placeholder.
 */
export function initUIComponents() {
    // Exemple d'initialisation de modales (si vous en avez)
    // initModals();

    // Exemple d'initialisation d'accordéons (si vous en avez)
    // initAccordions();

    // Exemple d'initialisation de tooltips (si vous en avez)
    // initTooltips();

    console.log("Composants UI initialisés (actuellement vide).");
}

/*
// Exemple de fonction pour initialiser des modales
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloses = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('.modal'); // Assurez-vous que vos modales ont la classe 'modal'

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll'); // Empêcher le scroll en arrière-plan
            } else {
                console.warn(`Modal avec ID "${modalId}" non trouvée.`);
            }
        });
    });

    modalCloses.forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            const modal = closeButton.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                // S'assurer qu'aucun autre modal n'est actif avant de réactiver le scroll
                const activeModals = document.querySelectorAll('.modal.active');
                if (activeModals.length === 0) {
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Fermer la modale si on clique en dehors (sur l'overlay)
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Si le clic est sur l'élément modal lui-même (l'overlay)
                modal.classList.remove('active');
                const activeModals = document.querySelectorAll('.modal.active');
                if (activeModals.length === 0) {
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Fermer la modale avec la touche Échap
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });
}
*/

/*
// Exemple de fonction pour initialiser des accordéons
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const accordionContent = header.nextElementSibling;
            const currentlyActive = document.querySelector('.accordion-item.active');

            if (currentlyActive && currentlyActive !== accordionItem) {
                currentlyActive.classList.remove('active');
                currentlyActive.querySelector('.accordion-content').style.maxHeight = null;
                currentlyActive.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            }

            accordionItem.classList.toggle('active');
            header.setAttribute('aria-expanded', accordionItem.classList.contains('active'));

            if (accordionItem.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            } else {
                accordionContent.style.maxHeight = null;
            }
        });

        // Initialiser l'état aria-expanded
        const isOpen = header.parentElement.classList.contains('active');
        header.setAttribute('aria-expanded', isOpen);
        if (!isOpen && header.nextElementSibling) {
             header.nextElementSibling.style.maxHeight = null;
        } else if (isOpen && header.nextElementSibling) {
            header.nextElementSibling.style.maxHeight = header.nextElementSibling.scrollHeight + "px";
        }


    });
}
*/