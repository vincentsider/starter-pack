// public/js/components/modal.js

/**
 * @module Modal
 * @description Gère la logique pour les composants modaux, y compris l'ouverture, la fermeture et l'accessibilité.
 * Basé sur le pseudocode de `pseudocode/site_vitrine/common/ui_components.md`.
 */

(function() {
    'use strict';

    const FOCUSABLE_ELEMENTS_SELECTOR = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    let activeModal = null; // Garde une référence à la modale actuellement ouverte

    /**
     * Ouvre une modale spécifiée par son ID.
     * @param {string} modalId - L'ID de l'élément modal à ouvrir.
     * @param {object} [options] - Options pour la modale (titre, contenu HTML du corps, contenu HTML du pied de page).
     * @param {string} [options.title] - Texte pour le titre de la modale.
     * @param {string} [options.bodyHTML] - Contenu HTML pour le corps de la modale.
     * @param {string} [options.footerHTML] - Contenu HTML pour le pied de page de la modale (généralement des boutons).
     */
    function openModal(modalId, options = {}) {
        const modalElement = document.getElementById(modalId);

        if (!modalElement) {
            console.warn(`Modal: Aucun élément modal trouvé avec l'ID "${modalId}".`);
            return;
        }

        // Fermer toute modale déjà active
        if (activeModal && activeModal !== modalElement) {
            closeModal(activeModal.id);
        }

        activeModal = modalElement;

        // Mettre à jour le contenu si fourni
        if (options.title) {
            const titleElement = modalElement.querySelector('[data-modal-title]');
            if (titleElement) titleElement.textContent = options.title;
        }
        if (options.bodyHTML) {
            const bodyElement = modalElement.querySelector('[data-modal-body]');
            if (bodyElement) bodyElement.innerHTML = options.bodyHTML;
        }
        if (options.footerHTML) {
            const footerElement = modalElement.querySelector('[data-modal-footer]');
            if (footerElement) footerElement.innerHTML = options.footerHTML;
        }


        modalElement.dataset.modalState = 'open';
        document.body.classList.add('modal-open'); // Pour désactiver le scroll du body

        // Gestion du focus pour l'accessibilité
        trapFocus(modalElement);

        // Ajouter des écouteurs d'événements pour la fermeture
        modalElement.querySelectorAll('[data-modal-close]').forEach(closeTrigger => {
            closeTrigger.addEventListener('click', handleCloseTrigger);
        });
        document.addEventListener('keydown', handleEscKey);

        // Émettre un événement personnalisé lors de l'ouverture
        modalElement.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
    }

    /**
     * Ferme la modale active ou une modale spécifiée par son ID.
     * @param {string} [modalId] - L'ID de l'élément modal à fermer. Si non fourni, ferme la modale active.
     */
    function closeModal(modalId) {
        const modalToClose = modalId ? document.getElementById(modalId) : activeModal;

        if (!modalToClose || modalToClose.dataset.modalState !== 'open') {
            return; // La modale n'existe pas ou n'est pas ouverte
        }

        modalToClose.dataset.modalState = 'closed';
        document.body.classList.remove('modal-open');

        // Nettoyer les écouteurs d'événements de fermeture
        modalToClose.querySelectorAll('[data-modal-close]').forEach(closeTrigger => {
            closeTrigger.removeEventListener('click', handleCloseTrigger);
        });
        document.removeEventListener('keydown', handleEscKey);

        // Rétablir le focus sur l'élément qui a ouvert la modale (si possible)
        if (modalToClose.openedBy) {
            modalToClose.openedBy.focus();
            delete modalToClose.openedBy; // Nettoyer la référence
        }

        // Émettre un événement personnalisé lors de la fermeture
        modalToClose.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));

        if (activeModal === modalToClose) {
            activeModal = null;
        }
    }

    /**
     * Gestionnaire pour les déclencheurs de fermeture (boutons, overlay).
     * @param {Event} event - L'événement de clic.
     */
    function handleCloseTrigger(event) {
        const modal = event.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }

    /**
     * Gestionnaire pour la touche 'Escape' pour fermer la modale.
     * @param {KeyboardEvent} event - L'événement clavier.
     */
    function handleEscKey(event) {
        if (event.key === 'Escape' && activeModal) {
            closeModal(activeModal.id);
        }
    }

    /**
     * Piège le focus à l'intérieur de la modale pour l'accessibilité.
     * @param {HTMLElement} modalElement - L'élément modal.
     */
    function trapFocus(modalElement) {
        const focusableElements = modalElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        // Mettre le focus initial sur la modale elle-même ou son premier élément focusable
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        } else {
            modalElement.focus(); // Si aucun élément focusable, focus sur la modale
        }


        modalElement.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') {
                return;
            }

            if (event.shiftKey) { // Maj + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    event.preventDefault();
                }
            }
        });
    }


    /**
     * Initialise les déclencheurs d'ouverture de modales sur la page.
     * Les éléments avec `data-modal-open="id-de-la-modale"` ouvriront la modale correspondante.
     * Les options peuvent être passées via des attributs data sur le déclencheur:
     *  - `data-modal-title="Mon Titre"`
     *  - `data-modal-body-selector="#contenu-pour-body"` (un sélecteur vers un élément dont l'innerHTML sera utilisé)
     *  - `data-modal-footer-selector="#contenu-pour-footer"`
     */
    function initializeModalTriggers() {
        document.querySelectorAll('[data-modal-open]').forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                const modalId = trigger.dataset.modalOpen;
                if (!modalId) {
                    console.warn('Modal: L\'attribut data-modal-open doit spécifier un ID de modale.');
                    return;
                }

                const options = {};
                if (trigger.dataset.modalTitle) {
                    options.title = trigger.dataset.modalTitle;
                }
                if (trigger.dataset.modalBodySelector) {
                    const bodyContentElement = document.querySelector(trigger.dataset.modalBodySelector);
                    if (bodyContentElement) options.bodyHTML = bodyContentElement.innerHTML;
                    else console.warn(`Modal: Sélecteur de contenu du corps non trouvé: ${trigger.dataset.modalBodySelector}`);
                }
                 if (trigger.dataset.modalBodyHtml) { // Alternative pour passer du HTML directement
                    options.bodyHTML = trigger.dataset.modalBodyHtml;
                }
                if (trigger.dataset.modalFooterSelector) {
                    const footerContentElement = document.querySelector(trigger.dataset.modalFooterSelector);
                    if (footerContentElement) options.footerHTML = footerContentElement.innerHTML;
                     else console.warn(`Modal: Sélecteur de contenu du pied de page non trouvé: ${trigger.dataset.modalFooterSelector}`);
                }
                if (trigger.dataset.modalFooterHtml) { // Alternative pour passer du HTML directement
                    options.footerHTML = trigger.dataset.modalFooterHtml;
                }


                // Sauvegarder l'élément qui a ouvert la modale pour y retourner le focus
                const modalElement = document.getElementById(modalId);
                if (modalElement) {
                    modalElement.openedBy = trigger;
                }

                openModal(modalId, options);
            });
        });
    }

    // Exposer les fonctions publiquement (si nécessaire pour un usage global ou par d'autres modules)
    // Pour ce projet, une initialisation automatique pourrait suffire.
    window.App = window.App || {};
    window.App.Modal = {
        open: openModal,
        close: closeModal,
        initTriggers: initializeModalTriggers,
        getActiveModal: () => activeModal
    };

    // Initialiser les déclencheurs lorsque le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModalTriggers);
    } else {
        initializeModalTriggers();
    }

})();