// public/js/components/featureCard.js

/**
 * Gère la logique du composant FeatureCard.
 * Affiche une icône, un titre et une description pour une fonctionnalité.
 * Gère également les mises à jour de traduction.
 */
class FeatureCardComponent {
    /**
     * @param {HTMLElement} element L'élément HTML de la carte de fonctionnalité.
     * @param {object} options Options de configuration.
     * @param {string} [options.iconClass] Classe CSS pour l'icône (si non définie via HTML).
     * @param {string} [options.titleKey] Clé i18next pour le titre.
     * @param {string} [options.descriptionKey] Clé i18next pour la description.
     */
    constructor(element, options = {}) {
        if (!element) {
            console.warn('FeatureCardComponent: Élément non fourni.');
            return;
        }
        this.element = element;
        this.options = options;

        // Trouver les éléments internes de la carte
        this.iconElement = DOMUtils.find('.feature-icon [class*="icon-"]', this.element) || DOMUtils.find('.feature-icon img', this.element);
        this.titleElement = DOMUtils.find('.feature-title', this.element);
        this.descriptionElement = DOMUtils.find('.feature-description', this.element);

        this.init();
    }

    init() {
        this.applyInitialOptions();
        this.updateTranslations(); // Mettre à jour les traductions au chargement initial

        if (window.i18next) {
            window.i18next.on('languageChanged', () => this.updateTranslations());
        }
        console.log('FeatureCardComponent initialisé pour:', this.element);
    }

    /**
     * Applique les options initiales (par exemple, classe d'icône) si fournies.
     */
    applyInitialOptions() {
        if (this.options.iconClass && this.iconElement && !this.iconElement.hasAttribute('src')) { // Vérifie si ce n'est pas une balise img
            // Supprime les anciennes classes d'icônes avant d'ajouter la nouvelle
            const iconClasses = Array.from(this.iconElement.classList).filter(cls => cls.startsWith('icon-'));
            iconClasses.forEach(cls => this.iconElement.classList.remove(cls));
            this.iconElement.classList.add(this.options.iconClass);
        }
    }

    /**
     * Met à jour les textes traduisibles (titre, description) de la carte.
     * Utilise data-i18n sur les éléments internes ou les clés des options.
     */
    updateTranslations() {
        if (!window.i18next) return;

        // Traduction du titre
        if (this.titleElement) {
            const titleI18nKey = this.options.titleKey || this.titleElement.getAttribute('data-i18n');
            if (titleI18nKey) {
                const translatedTitle = window.i18next.t(titleI18nKey);
                if (translatedTitle !== titleI18nKey) {
                    this.titleElement.textContent = translatedTitle;
                }
            }
        }

        // Traduction de la description
        if (this.descriptionElement) {
            const descriptionI18nKey = this.options.descriptionKey || this.descriptionElement.getAttribute('data-i18n');
            if (descriptionI18nKey) {
                const translatedDescription = window.i18next.t(descriptionI18nKey);
                if (translatedDescription !== descriptionI18nKey) {
                    this.descriptionElement.innerHTML = translatedDescription; // innerHTML pour permettre le formatage HTML simple
                }
            }
        }
    }
}

// Initialisation automatique des cartes de fonctionnalité ayant l'attribut data-component="feature-card"
document.addEventListener('DOMContentLoaded', () => {
    const featureCardElements = DOMUtils.findAll('[data-component="feature-card"]');
    featureCardElements.forEach(cardElement => {
        // Les options peuvent être passées via des attributs data-* sur l'élément
        const options = {
            // Exemple: data-icon-class="icon-checkmark"
            iconClass: cardElement.getAttribute('data-icon-class'),
            // data-i18n-title et data-i18n-description peuvent être utilisés,
            // ou les éléments internes peuvent avoir leur propre data-i18n.
            titleKey: cardElement.getAttribute('data-i18n-title'),
            descriptionKey: cardElement.getAttribute('data-i18n-description')
        };

        if (window.i18next && window.i18next.isInitialized) {
            new FeatureCardComponent(cardElement, options);
        } else if (window.i18next) {
            window.i18next.on('initialized', () => {
                 new FeatureCardComponent(cardElement, options);
            });
        } else {
            console.warn("i18next n'est pas détecté, initialisation de FeatureCardComponent sans support de traduction dynamique initial.");
            new FeatureCardComponent(cardElement, options);
        }
    });
});