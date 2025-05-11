// public/js/components/accordion.js

/**
 * Crée et gère un composant accordéon.
 * @param {string} containerId - L'ID de l'élément conteneur pour l'accordéon.
 * @param {Array<Object>} items - Un tableau d'objets, chacun décrivant un élément de l'accordéon.
 *                                 Chaque objet doit avoir: { id: string, title: string, contentHtml: string, isOpen?: boolean }
 * @param {Object} options - Options de configuration pour l'accordéon.
 * @param {boolean} [options.alwaysOpen=false] - Si true, plusieurs éléments peuvent être ouverts. Sinon, un seul à la fois.
 * @param {string|null} [options.defaultOpenId=null] - L'ID de l'élément à ouvrir par défaut.
 * @param {string} [options.customClasses=''] - Classes CSS personnalisées pour le conteneur de l'accordéon.
 * @param {function} [options.onItemOpen=() => {}] - Callback lorsqu'un item est ouvert. Prend l'ID de l'item en argument.
 * @param {function} [options.onItemClose=() => {}] - Callback lorsqu'un item est fermé. Prend l'ID de l'item en argument.
 */
function createAccordion(containerId, items, options = {}) {
    const {
        alwaysOpen = false,
        defaultOpenId = null,
        customClasses = '',
        onItemOpen = () => {},
        onItemClose = () => {}
    } = options;

    const accordionContainer = document.getElementById(containerId);
    if (!accordionContainer) {
        console.error(`Accordion container with id "${containerId}" not found.`);
        return null;
    }

    accordionContainer.classList.add('accordion');
    if (customClasses) {
        customClasses.split(' ').forEach(cls => cls && accordionContainer.classList.add(cls));
    }
    // Un ID unique pour le groupe d'accordéon, nécessaire pour `data-bs-parent` si !alwaysOpen
    const parentId = `accordion-parent-${containerId}-${Date.now()}`;
    if (!alwaysOpen) {
        accordionContainer.id = parentId;
    }


    items.forEach((item, index) => {
        const itemId = item.id || `accordion-item-${containerId}-${index}`;
        const collapseId = `collapse-${itemId}`;
        const headerId = `header-${itemId}`;

        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        accordionItem.id = itemId;

        const accordionHeader = document.createElement('h2');
        accordionHeader.className = 'accordion-header';
        accordionHeader.id = headerId;

        const button = document.createElement('button');
        button.className = 'accordion-button';
        button.type = 'button';
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', `#${collapseId}`);
        button.setAttribute('aria-controls', collapseId);
        button.textContent = item.title;

        const accordionCollapse = document.createElement('div');
        accordionCollapse.id = collapseId;
        accordionCollapse.className = 'accordion-collapse collapse';
        accordionCollapse.setAttribute('aria-labelledby', headerId);

        if (!alwaysOpen) {
            accordionCollapse.setAttribute('data-bs-parent', `#${parentId}`);
        }

        const accordionBody = document.createElement('div');
        accordionBody.className = 'accordion-body';
        accordionBody.innerHTML = item.contentHtml;

        accordionCollapse.appendChild(accordionBody);
        accordionHeader.appendChild(button);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        accordionContainer.appendChild(accordionItem);

        // Gestion de l'état ouvert/fermé
        const bsCollapseInstance = (typeof bootstrap !== 'undefined' && bootstrap.Collapse) ? new bootstrap.Collapse(accordionCollapse, { toggle: false }) : null;

        if (item.isOpen || defaultOpenId === itemId) {
            button.classList.remove('collapsed');
            button.setAttribute('aria-expanded', 'true');
            accordionCollapse.classList.add('show');
            if (bsCollapseInstance) bsCollapseInstance.show();
        } else {
            button.classList.add('collapsed');
            button.setAttribute('aria-expanded', 'false');
        }

        // Callbacks
        accordionCollapse.addEventListener('show.bs.collapse', () => {
            onItemOpen(itemId);
        });
        accordionCollapse.addEventListener('hide.bs.collapse', () => {
            onItemClose(itemId);
        });

        // Fallback si Bootstrap n'est pas là pour le toggle
        if (!bsCollapseInstance) {
            button.addEventListener('click', () => {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    button.classList.add('collapsed');
                    button.setAttribute('aria-expanded', 'false');
                    accordionCollapse.classList.remove('show');
                    // Simuler l'événement hide.bs.collapse
                    const eventHide = new CustomEvent('hide.bs.collapse');
                    accordionCollapse.dispatchEvent(eventHide);
                    onItemClose(itemId);

                } else {
                    // Si !alwaysOpen, fermer les autres
                    if (!alwaysOpen) {
                        const allButtons = accordionContainer.querySelectorAll('.accordion-button');
                        const allCollapses = accordionContainer.querySelectorAll('.accordion-collapse');
                        allButtons.forEach(btn => {
                            if (btn !== button && btn.getAttribute('aria-expanded') === 'true') {
                                btn.classList.add('collapsed');
                                btn.setAttribute('aria-expanded', 'false');
                                const targetId = btn.getAttribute('data-bs-target');
                                const targetCollapse = document.querySelector(targetId);
                                if (targetCollapse) {
                                    targetCollapse.classList.remove('show');
                                    const eventHideOther = new CustomEvent('hide.bs.collapse');
                                    targetCollapse.dispatchEvent(eventHideOther);
                                    const otherItemId = targetCollapse.id.replace('collapse-', '');
                                    onItemClose(otherItemId);
                                }
                            }
                        });
                    }

                    button.classList.remove('collapsed');
                    button.setAttribute('aria-expanded', 'true');
                    accordionCollapse.classList.add('show');
                     // Simuler l'événement show.bs.collapse
                    const eventShow = new CustomEvent('show.bs.collapse');
                    accordionCollapse.dispatchEvent(eventShow);
                    onItemOpen(itemId);
                }
            });
        }
    });

    return {
        element: accordionContainer,
        // Peut-être ajouter des méthodes pour contrôler l'accordéon par programme ici
        openItem: (itemId) => {
            const itemElement = document.getElementById(`collapse-${itemId}`);
            if (itemElement) {
                const bsCollapse = bootstrap.Collapse.getInstance(itemElement);
                if (bsCollapse) bsCollapse.show();
                else { // Fallback
                    const button = document.querySelector(`[data-bs-target="#collapse-${itemId}"]`);
                    if (button && button.getAttribute('aria-expanded') === 'false') button.click();
                }
            }
        },
        closeItem: (itemId) => {
             const itemElement = document.getElementById(`collapse-${itemId}`);
            if (itemElement) {
                const bsCollapse = bootstrap.Collapse.getInstance(itemElement);
                if (bsCollapse) bsCollapse.hide();
                else { // Fallback
                    const button = document.querySelector(`[data-bs-target="#collapse-${itemId}"]`);
                    if (button && button.getAttribute('aria-expanded') === 'true') button.click();
                }
            }
        },
        dispose: () => {
            items.forEach((item, index) => {
                const itemId = item.id || `accordion-item-${containerId}-${index}`;
                const collapseElement = document.getElementById(`collapse-${itemId}`);
                if (collapseElement) {
                    const instance = bootstrap.Collapse.getInstance(collapseElement);
                    if (instance) {
                        instance.dispose();
                    }
                }
            });
            accordionContainer.innerHTML = ''; // Nettoyer le conteneur
        }
    };
}

// Exemple d'utilisation (peut être retiré ou commenté)
/*
document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-accordion-container');
    if (faqContainer) {
        const faqItems = [
            {
                id: 'faq1',
                title: 'Qu\'est-ce que l\'assistant de filtrage d\'appels ?',
                contentHtml: '<p>C\'est un service intelligent qui filtre vos appels entrants pour bloquer les spams et les appels indésirables, vous permettant de vous concentrer sur ce qui compte.</p>'
            },
            {
                id: 'faq2',
                title: 'Comment fonctionne-t-il ?',
                contentHtml: '<p>Il utilise une combinaison de listes noires, d\'analyses heuristiques et d\'intelligence artificielle pour identifier et bloquer les appels suspects avant qu\'ils n\'atteignent votre téléphone.</p>',
                isOpen: false // Cet item sera fermé par défaut, sauf si defaultOpenId le spécifie
            },
            {
                id: 'faq3',
                title: 'Est-ce compatible avec mon téléphone ?',
                contentHtml: '<p>Notre service est compatible avec la plupart des smartphones modernes (iOS et Android) et certains téléphones fixes VoIP.</p>'
            }
        ];

        createAccordion('faq-accordion-container', faqItems, {
            // alwaysOpen: true, // Décommentez pour permettre à plusieurs items d'être ouverts
            defaultOpenId: 'faq1', // Ouvre le premier item par défaut
            onItemOpen: (itemId) => console.log(`FAQ Item ouvert: ${itemId}`),
            onItemClose: (itemId) => console.log(`FAQ Item fermé: ${itemId}`)
        });
    }

    const anotherAccordionContainer = document.getElementById('another-accordion');
    if(anotherAccordionContainer) {
        const items = [
            { title: "Section 1", contentHtml: "Contenu de la section 1" },
            { title: "Section 2", contentHtml: "Contenu de la section 2" },
        ];
        createAccordion('another-accordion', items, { alwaysOpen: true });
    }
});

// Rendre createAccordion accessible globalement si besoin
// window.createAccordion = createAccordion;
*/