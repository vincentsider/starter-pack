// public/js/components/testimonialCard.js

/**
 * Gère la logique du composant TestimonialCard.
 * Affiche le texte du témoignage, le nom de l'auteur et sa désignation.
 * Gère également les mises à jour de traduction.
 */
class TestimonialCardComponent {
    /**
     * @param {HTMLElement} element L'élément HTML de la carte de témoignage.
     * @param {object} options Options de configuration.
     * @param {string} [options.quoteKey] Clé i18next pour le texte du témoignage.
     * @param {string} [options.authorNameKey] Clé i18next pour le nom de l'auteur.
     * @param {string} [options.authorTitleKey] Clé i18next pour le titre/la société de l'auteur.
     * @param {string} [options.authorImageSrc] URL de l'image de l'auteur (si non définie via HTML).
     */
    constructor(element, options = {}) {
        if (!element) {
            console.warn('TestimonialCardComponent: Élément non fourni.');
            return;
        }
        this.element = element;
        this.options = options;

        // Trouver les éléments internes de la carte
        this.quoteElement = DOMUtils.find('.testimonial-quote', this.element);
        this.authorNameElement = DOMUtils.find('.testimonial-author-name', this.element);
        this.authorTitleElement = DOMUtils.find('.testimonial-author-title', this.element);
        this.authorImageElement = DOMUtils.find('.testimonial-author-image', this.element); // Balise <img>

        this.init();
    }

    init() {
        this.applyInitialOptions();
        this.updateTranslations(); // Mettre à jour les traductions au chargement initial

        if (window.i18next) {
            window.i18next.on('languageChanged', () => this.updateTranslations());
        }
        console.log('TestimonialCardComponent initialisé pour:', this.element);
    }

    /**
     * Applique les options initiales (par exemple, image de l'auteur).
     */
    applyInitialOptions() {
        if (this.options.authorImageSrc && this.authorImageElement) {
            this.authorImageElement.src = this.options.authorImageSrc;
            // Alternativement, si l'image est définie via CSS (background-image sur un div),
            // il faudrait une logique différente ici. Pour l'instant, on suppose une balise <img>.
        }
    }

    /**
     * Met à jour les textes traduisibles (citation, nom de l'auteur, titre de l'auteur) de la carte.
     */
    updateTranslations() {
        if (!window.i18next) return;

        // Traduction de la citation
        if (this.quoteElement) {
            const quoteKey = this.options.quoteKey || this.quoteElement.getAttribute('data-i18n');
            if (quoteKey) {
                const translatedQuote = window.i18next.t(quoteKey);
                if (translatedQuote !== quoteKey) {
                    this.quoteElement.textContent = translatedQuote;
                }
            }
        }

        // Traduction du nom de l'auteur
        if (this.authorNameElement) {
            const authorNameKey = this.options.authorNameKey || this.authorNameElement.getAttribute('data-i18n');
            if (authorNameKey) {
                const translatedName = window.i18next.t(authorNameKey);
                if (translatedName !== authorNameKey) {
                    this.authorNameElement.textContent = translatedName;
                }
            }
        }

        // Traduction du titre/société de l'auteur
        if (this.authorTitleElement) {
            const authorTitleKey = this.options.authorTitleKey || this.authorTitleElement.getAttribute('data-i18n');
            if (authorTitleKey) {
                const translatedTitle = window.i18next.t(authorTitleKey);
                if (translatedTitle !== authorTitleKey) {
                    this.authorTitleElement.textContent = translatedTitle;
                }
            }
        }
    }
}

// Initialisation automatique des cartes de témoignage ayant l'attribut data-component="testimonial-card"
document.addEventListener('DOMContentLoaded', () => {
    const testimonialCardElements = DOMUtils.findAll('[data-component="testimonial-card"]');
    testimonialCardElements.forEach(cardElement => {
        const options = {
            quoteKey: cardElement.getAttribute('data-i18n-quote'),
            authorNameKey: cardElement.getAttribute('data-i18n-author-name'),
            authorTitleKey: cardElement.getAttribute('data-i18n-author-title'),
            authorImageSrc: cardElement.getAttribute('data-author-image-src')
        };

        if (window.i18next && window.i18next.isInitialized) {
            new TestimonialCardComponent(cardElement, options);
        } else if (window.i18next) {
            window.i18next.on('initialized', () => {
                 new TestimonialCardComponent(cardElement, options);
            });
        } else {
            console.warn("i18next n'est pas détecté, initialisation de TestimonialCardComponent sans support de traduction dynamique initial.");
            new TestimonialCardComponent(cardElement, options);
        }
    });
});