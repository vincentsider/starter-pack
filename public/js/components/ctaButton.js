// public/js/components/ctaButton.js

/**
 * Gère la logique du composant Bouton CTA (Call To Action).
 * Cela inclut la gestion des clics et la mise à jour des textes traduits.
 */
class CtaButtonComponent {
    /**
     * @param {HTMLElement} element L'élément bouton HTML.
     * @param {object} options Options de configuration.
     * @param {string} options.textKey Clé i18next pour le texte du bouton.
     * @param {function} options.onClick Callback pour l'événement click.
     */
    constructor(element, options = {}) {
        if (!element) {
            console.warn('CtaButtonComponent: Élément non fourni.');
            return;
        }
        this.element = element;
        this.options = options;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTranslations(); // Mettre à jour les traductions au chargement initial

        if (window.i18next) {
            window.i18next.on('languageChanged', () => this.updateTranslations());
        }
        console.log('CtaButtonComponent initialisé pour:', this.element);
    }

    /**
     * Initialise les écouteurs d'événements pour le bouton.
     */
    setupEventListeners() {
        if (this.options.onClick && typeof this.options.onClick === 'function') {
            DOMUtils.on(this.element, 'click', (event) => {
                this.options.onClick(event);
            });
        } else {
             // Comportement par défaut si c'est un lien <a>
            if (this.element.tagName === 'A' && this.element.getAttribute('href')) {
                // L'événement de clic par défaut du navigateur gérera la navigation
                // On peut ajouter un tracking ici si besoin
                DOMUtils.on(this.element, 'click', (event) => {
                    console.log(`CTA Button (link) clicked: ${this.element.getAttribute('href')}`);
                });
            } else {
                // Pour les <button> sans onClick défini
                 DOMUtils.on(this.element, 'click', (event) => {
                    console.log('CTA Button clicked (no custom action defined):', this.element);
                });
            }
        }
    }

    /**
     * Met à jour le texte traduisible du bouton.
     * Utilise data-i18n sur l'élément ou la textKey des options.
     */
    updateTranslations() {
        if (!window.i18next) return;

        const i18nKeyFromAttribute = this.element.getAttribute('data-i18n');
        const keyToUse = this.options.textKey || i18nKeyFromAttribute;

        if (keyToUse) {
            const translation = window.i18next.t(keyToUse);
            if (translation !== keyToUse) { // S'assurer que la clé a été trouvée
                this.element.textContent = translation;
            }
        }
    }
}

// Initialisation automatique des boutons CTA ayant l'attribut data-component="cta-button"
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtonElements = DOMUtils.findAll('[data-component="cta-button"]');
    ctaButtonElements.forEach(btnElement => {
        // Les options peuvent être passées via des attributs data-* sur l'élément
        const options = {
            textKey: btnElement.getAttribute('data-i18n'), // data-i18n est standard
            // onClick pourrait être défini par une fonction globale accessible ici
            // ou par une référence à une méthode d'un autre composant
        };
        if (window.i18next && window.i18next.isInitialized) {
           new CtaButtonComponent(btnElement, options);
        } else if (window.i18next) {
            window.i18next.on('initialized', () => {
                 new CtaButtonComponent(btnElement, options);
            });
        } else {
            console.warn("i18next n'est pas détecté, initialisation de CtaButtonComponent sans support de traduction dynamique initial.");
            new CtaButtonComponent(btnElement, options);
        }
    });
});