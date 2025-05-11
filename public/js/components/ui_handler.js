// public/js/components/ui_handler.js

/**
 * Initialise et gère les modales sur la page.
 * Les modales sont identifiées par la classe '.modal-overlay'
 * Les déclencheurs de modales ont un attribut 'data-modal-target' qui correspond à l'ID de la modale.
 * Les boutons de fermeture dans les modales ont la classe '.modal-close-button' ou un attribut 'data-modal-dismiss'.
 */
export function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('.modal-close-button, [data-modal-dismiss]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            const modalId = trigger.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal && modal.classList.contains('modal-overlay')) {
                openModal(modal);
            } else {
                console.warn(`Modal with ID '${modalId}' not found or not a modal overlay.`);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            // Trouve la modale parente la plus proche
            const modal = button.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Fermer la modale en cliquant sur l'overlay (si spécifié)
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal && modal.dataset.dismissOnOverlayClick !== 'false') {
                closeModal(modal);
            }
        });
    });

    // Fermer la modale avec la touche Échap
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    console.log("Gestionnaires de modales initialisés.");
}

/**
 * Ouvre une modale spécifiée.
 * @param {HTMLElement} modalElement - L'élément de la modale (overlay) à ouvrir.
 */
function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêche le défilement du corps de la page
    // Focus sur le premier élément focusable dans la modale pour l'accessibilité
    const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    console.log(`Modal '${modalElement.id || 'sans ID'}' ouverte.`);
}

/**
 * Ferme une modale spécifiée.
 * @param {HTMLElement} modalElement - L'élément de la modale (overlay) à fermer.
 */
function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove('active');
    document.body.style.overflow = ''; // Rétablit le défilement du corps de la page
    console.log(`Modal '${modalElement.id || 'sans ID'}' fermée.`);
}


/**
 * Initialise les accordéons.
 * Les accordéons sont des groupes d'éléments où un seul peut être ouvert à la fois (ou plusieurs si configuré).
 * Structure attendue:
 * <div class="accordion">
 *   <div class="accordion-item">
 *     <button class="accordion-header" aria-expanded="false" aria-controls="content-id-1">Titre 1</button>
 *     <div class="accordion-content" id="content-id-1" hidden>Contenu 1...</div>
 *   </div>
 *   <div class="accordion-item">
 *     <button class="accordion-header" aria-expanded="false" aria-controls="content-id-2">Titre 2</button>
 *     <div class="accordion-content" id="content-id-2" hidden>Contenu 2...</div>
 *   </div>
 * </div>
 */
export function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        const headers = accordion.querySelectorAll('.accordion-header');
        const allowMultiple = accordion.dataset.allowMultiple === 'true';

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const contentId = header.getAttribute('aria-controls');
                const content = document.getElementById(contentId);
                const item = header.closest('.accordion-item');
                const isExpanded = header.getAttribute('aria-expanded') === 'true';

                if (!allowMultiple) {
                    // Fermer les autres items si un seul est permis
                    accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherHeader = otherItem.querySelector('.accordion-header');
                            const otherContent = otherItem.querySelector('.accordion-content');
                            if (otherHeader && otherContent) {
                                otherHeader.setAttribute('aria-expanded', 'false');
                                otherItem.classList.remove('active');
                                otherContent.hidden = true;
                                otherContent.style.maxHeight = null;
                            }
                        }
                    });
                }

                // Basculer l'item actuel
                if (isExpanded) {
                    header.setAttribute('aria-expanded', 'false');
                    item.classList.remove('active');
                    content.hidden = true;
                    content.style.maxHeight = null;
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    item.classList.add('active');
                    content.hidden = false;
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });

            // Initialiser l'état (si un item doit être ouvert par défaut via la classe 'active' ou l'attribut aria-expanded)
            const content = document.getElementById(header.getAttribute('aria-controls'));
            if (header.getAttribute('aria-expanded') === 'true' || header.closest('.accordion-item')?.classList.contains('active')) {
                header.setAttribute('aria-expanded', 'true');
                header.closest('.accordion-item')?.classList.add('active');
                content.hidden = false;
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                header.setAttribute('aria-expanded', 'false');
                content.hidden = true;
                content.style.maxHeight = null;
            }
        });
    });
    console.log("Gestionnaires d'accordéons initialisés.");
}


/**
 * Initialise les onglets (tabs).
 * Structure attendue:
 * <div class="tabs">
 *   <div class="tab-list" role="tablist">
 *     <button class="tab-item" role="tab" aria-selected="true" aria-controls="panel-id-1" id="tab-id-1">Onglet 1</button>
 *     <button class="tab-item" role="tab" aria-selected="false" aria-controls="panel-id-2" id="tab-id-2">Onglet 2</button>
 *   </div>
 *   <div class="tab-panel" role="tabpanel" aria-labelledby="tab-id-1" id="panel-id-1">Contenu Onglet 1...</div>
 *   <div class="tab-panel" role="tabpanel" aria-labelledby="tab-id-2" id="panel-id-2" hidden>Contenu Onglet 2...</div>
 * </div>
 */
export function initTabs() {
    const tabLists = document.querySelectorAll('.tab-list');

    tabLists.forEach(tabList => {
        const tabs = tabList.querySelectorAll('.tab-item[role="tab"]');
        const panels = tabList.closest('.tabs')?.querySelectorAll('.tab-panel[role="tabpanel"]');

        if (!panels || panels.length === 0) {
            console.warn("Aucun panneau d'onglet trouvé pour la liste d'onglets:", tabList);
            return;
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Désélectionner tous les onglets et masquer tous les panneaux
                tabs.forEach(t => {
                    t.setAttribute('aria-selected', 'false');
                    t.classList.remove('active');
                });
                panels.forEach(p => {
                    p.hidden = true;
                    p.classList.remove('active');
                });

                // Sélectionner l'onglet cliqué et afficher le panneau correspondant
                tab.setAttribute('aria-selected', 'true');
                tab.classList.add('active');
                const controlledPanelId = tab.getAttribute('aria-controls');
                const controlledPanel = document.getElementById(controlledPanelId);
                if (controlledPanel) {
                    controlledPanel.hidden = false;
                    controlledPanel.classList.add('active');
                }
            });

            // Initialiser l'état (si un onglet doit être actif par défaut)
            if (tab.getAttribute('aria-selected') === 'true' || tab.classList.contains('active')) {
                const controlledPanelId = tab.getAttribute('aria-controls');
                const controlledPanel = document.getElementById(controlledPanelId);
                if (controlledPanel) {
                    controlledPanel.hidden = false;
                    controlledPanel.classList.add('active');
                }
            } else {
                 const controlledPanelId = tab.getAttribute('aria-controls');
                 const controlledPanel = document.getElementById(controlledPanelId);
                 if (controlledPanel) {
                    controlledPanel.hidden = true;
                    controlledPanel.classList.remove('active');
                 }
            }
        });
    });
    console.log("Gestionnaires d'onglets initialisés.");
}

// Appeler ici d'autres initialisations de composants UI si nécessaire.
// Par exemple: initCarousels(), initDropdowns(), etc.

// Vous pouvez exporter une fonction principale qui appelle toutes les initialisations
// pour l'importer facilement dans main.js
export function initAllUIComponents() {
    initModals();
    initAccordions();
    initTabs();
    // ... autres initialisations
    console.log("Tous les composants UI interactifs ont été initialisés.");
}