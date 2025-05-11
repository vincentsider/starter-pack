// public/js/utils/dom.js

/**
 * Fonctions utilitaires pour la manipulation du DOM.
 */
const DOMUtils = {
    /**
     * Sélectionne un seul élément du DOM.
     * @param {string} selector - Le sélecteur CSS.
     * @param {Element|Document} [context=document] - Le contexte de recherche (optionnel).
     * @returns {Element|null} L'élément trouvé ou null.
     */
    find: (selector, context = document) => {
        if (!selector || typeof selector !== 'string') {
            console.error('DOMUtils.find: Sélecteur invalide fourni.');
            return null;
        }
        return context.querySelector(selector);
    },

    /**
     * Sélectionne plusieurs éléments du DOM.
     * @param {string} selector - Le sélecteur CSS.
     * @param {Element|Document} [context=document] - Le contexte de recherche (optionnel).
     * @returns {NodeListOf<Element>} Une NodeList des éléments trouvés.
     */
    findAll: (selector, context = document) => {
        if (!selector || typeof selector !== 'string') {
            console.error('DOMUtils.findAll: Sélecteur invalide fourni.');
            return document.querySelectorAll(null); // Retourne une NodeList vide
        }
        return context.querySelectorAll(selector);
    },

    /**
     * Crée un élément HTML avec des attributs et du contenu optionnels.
     * @param {string} tagName - Le nom du tag de l'élément (ex: 'div', 'a').
     * @param {object} [attributes={}] - Un objet d'attributs à définir sur l'élément.
     * @param {string|Node|Array<Node|string>} [content=''] - Le contenu à ajouter à l'élément.
     * @returns {Element} L'élément HTML créé.
     */
    create: (tagName, attributes = {}, content = '') => {
        if (!tagName || typeof tagName !== 'string') {
            console.error('DOMUtils.create: Nom de tag invalide fourni.');
            // Retourner un fragment de document ou un div vide pour éviter des erreurs plus loin
            return document.createElement('div');
        }
        const element = document.createElement(tagName);

        for (const attr in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
                if (attr === 'dataset') { // Gérer les attributs data-*
                    for (const dataAttr in attributes.dataset) {
                        if (Object.prototype.hasOwnProperty.call(attributes.dataset, dataAttr)) {
                            element.dataset[dataAttr] = attributes.dataset[dataAttr];
                        }
                    }
                } else if (attr === 'className') { // Pour la compatibilité avec React-style props
                    element.className = attributes[attr];
                } else {
                    element.setAttribute(attr, attributes[attr]);
                }
            }
        }

        if (Array.isArray(content)) {
            content.forEach(item => {
                if (item instanceof Node) {
                    element.appendChild(item);
                } else {
                    element.appendChild(document.createTextNode(String(item)));
                }
            });
        } else if (content instanceof Node) {
            element.appendChild(content);
        } else if (content !== '') {
            element.innerHTML = String(content); // Attention: utiliser avec prudence si content vient de l'utilisateur
        }

        return element;
    },

    /**
     * Ajoute un écouteur d'événement à un élément, avec délégation optionnelle.
     * @param {Element|Window|Document} element - L'élément sur lequel attacher l'écouteur.
     * @param {string} eventType - Le type d'événement (ex: 'click', 'mouseover').
     * @param {string|Function} targetSelectorOrHandler - Sélecteur pour délégation, ou la fonction handler.
     * @param {Function} [handler] - La fonction handler si targetSelectorOrHandler est un sélecteur.
     * @param {object} [options={}] - Options pour addEventListener.
     */
    on: (element, eventType, targetSelectorOrHandler, handler, options = {}) => {
        if (!element || !eventType) {
            console.error('DOMUtils.on: Élément ou type d\'événement manquant.');
            return;
        }

        if (typeof targetSelectorOrHandler === 'function') {
            // Pas de délégation
            element.addEventListener(eventType, targetSelectorOrHandler, options);
        } else if (typeof targetSelectorOrHandler === 'string' && typeof handler === 'function') {
            // Délégation
            element.addEventListener(eventType, (event) => {
                if (event.target && event.target.matches(targetSelectorOrHandler)) {
                    handler.call(event.target, event); // 'this' sera l'élément qui correspond au sélecteur
                } else if (event.target && event.target.closest(targetSelectorOrHandler)) {
                    // Gérer les cas où l'événement est sur un enfant de l'élément correspondant au sélecteur
                    const closestTarget = event.target.closest(targetSelectorOrHandler);
                    if (closestTarget && element.contains(closestTarget)) { // S'assurer que la cible est bien dans le contexte de l'élément écouté
                        handler.call(closestTarget, event);
                    }
                }
            }, options);
        } else {
            console.error('DOMUtils.on: Paramètres de handler ou de sélecteur invalides.');
        }
    },

    /**
     * Supprime un écouteur d'événement d'un élément.
     * Note: Nécessite la même référence de fonction et les mêmes options que lors de l'ajout.
     * @param {Element|Window|Document} element - L'élément.
     * @param {string} eventType - Le type d'événement.
     * @param {Function} handler - La fonction handler.
     * @param {object} [options={}] - Options pour removeEventListener.
     */
    off: (element, eventType, handler, options = {}) => {
        if (!element || !eventType || typeof handler !== 'function') {
            console.error('DOMUtils.off: Paramètres invalides.');
            return;
        }
        element.removeEventListener(eventType, handler, options);
    },

    /**
     * Ajoute une classe à un élément.
     * @param {Element} element - L'élément.
     * @param {string} className - La classe à ajouter.
     */
    addClass: (element, className) => {
        if (element && className) element.classList.add(className);
    },

    /**
     * Supprime une classe d'un élément.
     * @param {Element} element - L'élément.
     * @param {string} className - La classe à supprimer.
     */
    removeClass: (element, className) => {
        if (element && className) element.classList.remove(className);
    },

    /**
     * Bascule une classe sur un élément.
     * @param {Element} element - L'élément.
     * @param {string} className - La classe à basculer.
     * @param {boolean} [force] - Si défini, ajoute la classe si true, la supprime si false.
     * @returns {boolean|undefined} La valeur de classList.toggle.
     */
    toggleClass: (element, className, force) => {
        if (element && className) return element.classList.toggle(className, force);
        return undefined;
    },

    /**
     * Vérifie si un élément a une classe.
     * @param {Element} element - L'élément.
     * @param {string} className - La classe à vérifier.
     * @returns {boolean} True si la classe existe, false sinon.
     */
    hasClass: (element, className) => {
        return element && className ? element.classList.contains(className) : false;
    },

    /**
     * Définit ou obtient un attribut data.
     * @param {Element} element - L'élément.
     * @param {string} key - La clé de l'attribut data (camelCase).
     * @param {string} [value] - La valeur à définir. Si omis, retourne la valeur actuelle.
     * @returns {string|undefined} La valeur de l'attribut data ou undefined.
     */
    data: (element, key, value) => {
        if (!element || !key) return undefined;
        if (typeof value !== 'undefined') {
            element.dataset[key] = value;
        }
        return element.dataset[key];
    },

    /**
     * Vide le contenu d'un élément.
     * @param {Element} element - L'élément à vider.
     */
    empty: (element) => {
        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    },

    /**
     * Insère du HTML à une position spécifiée par rapport à l'élément.
     * @param {Element} element - L'élément de référence.
     * @param {string} position - 'beforebegin', 'afterbegin', 'beforeend', 'afterend'.
     * @param {string} htmlString - La chaîne HTML à insérer.
     */
    insertHTML: (element, position, htmlString) => {
        if (element && typeof element.insertAdjacentHTML === 'function' && position && htmlString) {
            element.insertAdjacentHTML(position, htmlString);
        } else {
            console.error('DOMUtils.insertHTML: Paramètres invalides ou insertAdjacentHTML non supporté.');
        }
    },

    /**
     * Obtient ou définit la valeur d'un champ de formulaire.
     * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} element - L'élément de formulaire.
     * @param {string} [value] - La valeur à définir. Si omise, retourne la valeur actuelle.
     * @returns {string|undefined} La valeur du champ.
     */
    val: (element, value) => {
        if (!element || !('value' in element)) {
            console.warn('DOMUtils.val: Élément non valide ou sans propriété "value".', element);
            return undefined;
        }
        if (typeof value !== 'undefined') {
            element.value = value;
        }
        return element.value;
    }
};

// Exporter l'objet pour une utilisation en tant que module si nécessaire,
// ou le rendre global si c'est un script simple.
// Pour une utilisation simple sans modules ES6 formels dans le navigateur:
window.DOMUtils = DOMUtils;

// Ou si vous prévoyez d'utiliser des modules plus tard :
// export default DOMUtils;

console.log('DOMUtils.js chargé.');