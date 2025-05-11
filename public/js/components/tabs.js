// public/js/components/tabs.js

/**
 * Crée et gère un composant d'onglets.
 * @param {string} containerId - L'ID de l'élément conteneur pour les onglets.
 * @param {Array<Object>} tabsData - Un tableau d'objets, chacun décrivant un onglet.
 *                                   Chaque objet doit avoir: { id: string, title: string, contentHtml: string, isActive?: boolean, disabled?: boolean }
 * @param {Object} options - Options de configuration pour les onglets.
 * @param {string|null} [options.defaultActiveId=null] - L'ID de l'onglet à activer par défaut. Si non défini et aucun `isActive` n'est true, le premier onglet est activé.
 * @param {string} [options.navType='tabs'] - Type de navigation ('tabs' ou 'pills').
 * @param {string} [options.customNavClasses=''] - Classes CSS personnalisées pour la navigation des onglets.
 * @param {string} [options.customContentClasses=''] - Classes CSS personnalisées pour le conteneur de contenu des onglets.
 * @param {function} [options.onTabShow=() => {}] - Callback lorsqu'un onglet est affiché. Prend l'ID de l'onglet en argument.
 * @param {function} [options.onTabShown=() => {}] - Callback après qu'un onglet a été affiché (après la transition). Prend l'ID de l'onglet en argument.
 * @param {function} [options.onTabHide=() => {}] - Callback lorsqu'un onglet est masqué. Prend l'ID de l'onglet en argument.
 * @param {function} [options.onTabHidden=() => {}] - Callback après qu'un onglet a été masqué. Prend l'ID de l'onglet en argument.
 */
function createTabs(containerId, tabsData, options = {}) {
    const {
        defaultActiveId = null,
        navType = 'tabs', // 'tabs' ou 'pills'
        customNavClasses = '',
        customContentClasses = '',
        onTabShow = () => {},
        onTabShown = () => {},
        onTabHide = () => {},
        onTabHidden = () => {}
    } = options;

    const tabsContainer = document.getElementById(containerId);
    if (!tabsContainer) {
        console.error(`Tabs container with id "${containerId}" not found.`);
        return null;
    }
    tabsContainer.innerHTML = ''; // Vider le conteneur

    const navElement = document.createElement('ul');
    navElement.className = `nav nav-${navType}`;
    if (customNavClasses) {
        customNavClasses.split(' ').forEach(cls => cls && navElement.classList.add(cls));
    }
    navElement.setAttribute('role', 'tablist');

    const tabContentElement = document.createElement('div');
    tabContentElement.className = 'tab-content';
    if (customContentClasses) {
        customContentClasses.split(' ').forEach(cls => cls && tabContentElement.classList.add(cls));
    }
    tabContentElement.id = `tabContent-${containerId}-${Date.now()}`;

    let activeTabFound = false;
    let firstTabId = null;

    tabsData.forEach((tabItem, index) => {
        const tabId = tabItem.id || `tab-${containerId}-${index}`;
        const paneId = `pane-${tabId}`;
        if (index === 0) firstTabId = tabId;

        // Création de l'élément de navigation (onglet)
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        navItem.setAttribute('role', 'presentation');

        const navLink = document.createElement('button'); // Utiliser button pour l'accessibilité
        navLink.className = 'nav-link';
        navLink.id = tabId;
        navLink.setAttribute('data-bs-toggle', navType === 'pills' ? 'pill' : 'tab');
        navLink.setAttribute('data-bs-target', `#${paneId}`);
        navLink.setAttribute('type', 'button');
        navLink.setAttribute('role', 'tab');
        navLink.setAttribute('aria-controls', paneId);
        navLink.textContent = tabItem.title;

        if (tabItem.disabled) {
            navLink.classList.add('disabled');
            navLink.setAttribute('aria-disabled', 'true');
            navLink.setAttribute('tabindex', '-1');
        }

        navItem.appendChild(navLink);
        navElement.appendChild(navItem);

        // Création du panneau de contenu de l'onglet
        const tabPane = document.createElement('div');
        tabPane.className = 'tab-pane fade';
        tabPane.id = paneId;
        tabPane.setAttribute('role', 'tabpanel');
        tabPane.setAttribute('aria-labelledby', tabId);
        tabPane.innerHTML = tabItem.contentHtml;

        tabContentElement.appendChild(tabPane);

        // Déterminer l'onglet actif
        if ((defaultActiveId === tabId || (!defaultActiveId && tabItem.isActive)) && !tabItem.disabled) {
            navLink.classList.add('active');
            navLink.setAttribute('aria-selected', 'true');
            tabPane.classList.add('show', 'active');
            activeTabFound = true;
        } else {
            navLink.setAttribute('aria-selected', 'false');
        }

        // Attacher les gestionnaires d'événements Bootstrap si disponibles
        if (typeof bootstrap !== 'undefined' && bootstrap.Tab) {
            const tabInstance = new bootstrap.Tab(navLink);
            navLink.addEventListener('show.bs.tab', (event) => onTabShow(event.target.id, event.relatedTarget ? event.relatedTarget.id : null));
            navLink.addEventListener('shown.bs.tab', (event) => onTabShown(event.target.id, event.relatedTarget ? event.relatedTarget.id : null));
            navLink.addEventListener('hide.bs.tab', (event) => onTabHide(event.target.id, event.relatedTarget ? event.relatedTarget.id : null));
            navLink.addEventListener('hidden.bs.tab', (event) => onTabHidden(event.target.id, event.relatedTarget ? event.relatedTarget.id : null));
        } else {
            // Fallback si Bootstrap Tab n'est pas chargé
            navLink.addEventListener('click', (event) => {
                if (tabItem.disabled || navLink.classList.contains('active')) return;

                const currentlyActiveLink = navElement.querySelector('.nav-link.active');
                const currentlyActivePane = tabContentElement.querySelector('.tab-pane.active');
                let previousTabId = null;

                if (currentlyActiveLink) {
                    previousTabId = currentlyActiveLink.id;
                    // Simuler hide.bs.tab et hidden.bs.tab
                    const hideEvent = new CustomEvent('hide.bs.tab', { detail: { relatedTarget: navLink } });
                    currentlyActiveLink.dispatchEvent(hideEvent);
                    onTabHide(currentlyActiveLink.id, tabId);

                    currentlyActiveLink.classList.remove('active');
                    currentlyActiveLink.setAttribute('aria-selected', 'false');
                    if (currentlyActivePane) {
                        currentlyActivePane.classList.remove('show', 'active');
                    }

                    const hiddenEvent = new CustomEvent('hidden.bs.tab', { detail: { relatedTarget: navLink } });
                    currentlyActiveLink.dispatchEvent(hiddenEvent);
                    onTabHidden(currentlyActiveLink.id, tabId);
                }

                // Simuler show.bs.tab et shown.bs.tab
                const showEvent = new CustomEvent('show.bs.tab', { detail: { relatedTarget: currentlyActiveLink }});
                navLink.dispatchEvent(showEvent);
                onTabShow(tabId, previousTabId);

                navLink.classList.add('active');
                navLink.setAttribute('aria-selected', 'true');
                tabPane.classList.add('show', 'active');

                const shownEvent = new CustomEvent('shown.bs.tab', { detail: { relatedTarget: currentlyActiveLink }});
                navLink.dispatchEvent(shownEvent);
                onTabShown(tabId, previousTabId);
            });
        }
    });

    // Si aucun onglet actif n'a été défini, activer le premier non désactivé
    if (!activeTabFound && firstTabId) {
        const firstNavLink = navElement.querySelector(`#${firstTabId}`);
        const firstNavPane = tabContentElement.querySelector(`#pane-${firstTabId}`);
        if (firstNavLink && !firstNavLink.classList.contains('disabled')) {
            firstNavLink.classList.add('active');
            firstNavLink.setAttribute('aria-selected', 'true');
            if (firstNavPane) {
                firstNavPane.classList.add('show', 'active');
            }
            // Pas besoin de callbacks ici car c'est l'état initial
        }
    }

    tabsContainer.appendChild(navElement);
    tabsContainer.appendChild(tabContentElement);

    return {
        element: tabsContainer,
        navElement: navElement,
        contentElement: tabContentElement,
        showTab: (tabIdToShow) => {
            const tabButton = navElement.querySelector(`#${tabIdToShow}`);
            if (tabButton) {
                if (typeof bootstrap !== 'undefined' && bootstrap.Tab) {
                    const tabInstance = bootstrap.Tab.getInstance(tabButton) || new bootstrap.Tab(tabButton);
                    tabInstance.show();
                } else {
                    // Fallback click
                    tabButton.click();
                }
            }
        },
        getActiveTab: () => {
            const activeLink = navElement.querySelector('.nav-link.active');
            return activeLink ? activeLink.id : null;
        },
        dispose: () => {
             tabsData.forEach((tabItem, index) => {
                const tabId = tabItem.id || `tab-${containerId}-${index}`;
                const navLink = document.getElementById(tabId);
                if (navLink && typeof bootstrap !== 'undefined' && bootstrap.Tab) {
                    const instance = bootstrap.Tab.getInstance(navLink);
                    if (instance) {
                        instance.dispose();
                    }
                }
            });
            tabsContainer.innerHTML = '';
        }
    };
}

// Exemple d'utilisation (peut être retiré ou commenté)
/*
document.addEventListener('DOMContentLoaded', () => {
    const myTabsContainer = document.getElementById('my-tabs-container');
    if (myTabsContainer) {
        const tabs = [
            {
                id: 'home-tab',
                title: 'Accueil',
                contentHtml: '<h4>Contenu de l\'onglet Accueil</h4><p>Ceci est le contenu de l\'onglet Accueil.</p>',
                isActive: true // Onglet actif par défaut
            },
            {
                id: 'profile-tab',
                title: 'Profil',
                contentHtml: '<h4>Contenu de l\'onglet Profil</h4><p>Informations du profil utilisateur.</p>'
            },
            {
                id: 'contact-tab',
                title: 'Contact',
                contentHtml: '<h4>Contenu de l\'onglet Contact</h4><p>Formulaire de contact ou informations.</p>',
                disabled: true // Onglet désactivé
            },
            {
                id: 'settings-tab',
                title: 'Paramètres',
                contentHtml: '<h4>Contenu de l\'onglet Paramètres</h4><p>Options et configurations.</p>'
            }
        ];

        const tabSystem = createTabs('my-tabs-container', tabs, {
            navType: 'tabs', // ou 'pills'
            // defaultActiveId: 'profile-tab', // Pourrait outrepasser isActive:true dans les données
            onTabShow: (tabId, previousTabId) => console.log(`Onglet va s'afficher: ${tabId}, précédent: ${previousTabId}`),
            onTabShown: (tabId, previousTabId) => console.log(`Onglet affiché: ${tabId}, précédent: ${previousTabId}`),
            onTabHide: (tabId, nextTabId) => console.log(`Onglet va se masquer: ${tabId}, suivant: ${nextTabId}`),
            onTabHidden: (tabId, nextTabId) => console.log(`Onglet masqué: ${tabId}, suivant: ${nextTabId}`)
        });

        // Exemple pour montrer un onglet par programmation
        // setTimeout(() => {
        //     if (tabSystem) tabSystem.showTab('settings-tab');
        // }, 3000);
    }
});
*/