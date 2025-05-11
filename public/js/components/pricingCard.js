// public/js/components/pricingCard.js

/**
 * Gère la logique du composant PricingCard.
 * Affiche le nom du plan, le prix, une liste de fonctionnalités et un bouton CTA.
 * Gère également les mises à jour de traduction.
 */
class PricingCardComponent {
    /**
     * @param {HTMLElement} element L'élément HTML de la carte de tarification.
     * @param {object} options Options de configuration.
     * @param {string} [options.planNameKey] Clé i18next pour le nom du plan.
     * @param {string} [options.priceKey] Clé i18next pour le prix.
     * @param {string} [options.frequencyKey] Clé i18next pour la fréquence de facturation (par mois, par an).
     * @param {Array<string>} [options.featuresKeys] Liste des clés i18next pour les fonctionnalités.
     * @param {string} [options.ctaButtonKey] Clé i18next pour le bouton CTA.
     * @param {string} [options.ctaButtonLink] URL pour le bouton CTA.
     */
    constructor(element, options = {}) {
        if (!element) {
            console.warn('PricingCardComponent: Élément non fourni.');
            return;
        }
        this.element = element;
        this.options = options;

        // Trouver les éléments internes de la carte
        this.planNameElement = DOMUtils.find('.pricing-plan-name', this.element);
        this.priceElement = DOMUtils.find('.pricing-price', this.element);
        this.frequencyElement = DOMUtils.find('.pricing-frequency', this.element);
        this.featuresListElement = DOMUtils.find('.pricing-features-list', this.element);
        this.ctaButtonElement = DOMUtils.find('.pricing-cta-button', this.element); // Peut être <a> ou <button>

        this.init();
    }

    init() {
        this.applyInitialOptions();
        this.updateTranslations(); // Mettre à jour les traductions au chargement initial

        if (window.i18next) {
            window.i18next.on('languageChanged', () => this.updateTranslations());
        }
        console.log('PricingCardComponent initialisé pour:', this.element);
    }

    /**
     * Applique les options initiales (par exemple, lien du bouton CTA).
     */
    applyInitialOptions() {
        if (this.options.ctaButtonLink && this.ctaButtonElement && this.ctaButtonElement.tagName === 'A') {
            this.ctaButtonElement.setAttribute('href', this.options.ctaButtonLink);
        }
    }

    /**
     * Met à jour les textes traduisibles de la carte.
     */
    updateTranslations() {
        if (!window.i18next) return;

        // Nom du plan
        if (this.planNameElement) {
            const planNameKey = this.options.planNameKey || this.planNameElement.getAttribute('data-i18n');
            if (planNameKey) {
                const translated = window.i18next.t(planNameKey);
                if (translated !== planNameKey) this.planNameElement.textContent = translated;
            }
        }

        // Prix
        if (this.priceElement) {
            const priceKey = this.options.priceKey || this.priceElement.getAttribute('data-i18n');
            if (priceKey) {
                 // Le prix peut contenir des variables, comme {{currency}} ou {{amount}}
                // Supposons pour l'instant une traduction simple. Si des variables sont nécessaires,
                // i18next.t peut prendre un deuxième argument avec les valeurs des variables.
                // Par exemple: window.i18next.t(priceKey, { amount: '10', currency: '$' });
                // Pour cela, il faudrait que les options initiales ou les data-attributes
                // contiennent ces valeurs.
                const translated = window.i18next.t(priceKey);
                if (translated !== priceKey) this.priceElement.textContent = translated;
            }
        }

        // Fréquence
        if (this.frequencyElement) {
            const frequencyKey = this.options.frequencyKey || this.frequencyElement.getAttribute('data-i18n');
            if (frequencyKey) {
                const translated = window.i18next.t(frequencyKey);
                if (translated !== frequencyKey) this.frequencyElement.textContent = translated;
            }
        }

        // Liste des fonctionnalités
        if (this.featuresListElement) {
            // Si les clés sont passées via options, reconstruire la liste
            if (this.options.featuresKeys && Array.isArray(this.options.featuresKeys)) {
                this.featuresListElement.innerHTML = ''; // Vider la liste existante
                this.options.featuresKeys.forEach(key => {
                    const li = document.createElement('li');
                    li.setAttribute('data-i18n', key); // Utile si on veut cibler plus tard
                    const translated = window.i18next.t(key);
                    li.textContent = (translated !== key) ? translated : key;
                    this.featuresListElement.appendChild(li);
                });
            } else {
                // Sinon, traduire les <li> existants avec data-i18n
                const featureItems = DOMUtils.findAll('li[data-i18n]', this.featuresListElement);
                featureItems.forEach(item => {
                    const key = item.getAttribute('data-i18n');
                    const translated = window.i18next.t(key);
                    if (translated !== key) item.textContent = translated;
                });
            }
        }

        // Bouton CTA
        if (this.ctaButtonElement) {
            const ctaButtonKey = this.options.ctaButtonKey || this.ctaButtonElement.getAttribute('data-i18n');
            if (ctaButtonKey) {
                const translated = window.i18next.t(ctaButtonKey);
                if (translated !== ctaButtonKey) this.ctaButtonElement.textContent = translated;
            }
        }
    }
}

// Initialisation automatique des cartes de tarification ayant l'attribut data-component="pricing-card"
document.addEventListener('DOMContentLoaded', () => {
    const pricingCardElements = DOMUtils.findAll('[data-component="pricing-card"]');
    pricingCardElements.forEach(cardElement => {
        const featuresKeysAttr = cardElement.getAttribute('data-features-keys');
        const options = {
            planNameKey: cardElement.getAttribute('data-i18n-plan-name'),
            priceKey: cardElement.getAttribute('data-i18n-price'),
            frequencyKey: cardElement.getAttribute('data-i18n-frequency'),
            featuresKeys: featuresKeysAttr ? featuresKeysAttr.split(',').map(k => k.trim()) : null,
            ctaButtonKey: cardElement.getAttribute('data-i18n-cta-button'),
            ctaButtonLink: cardElement.getAttribute('data-cta-link')
        };

        if (window.i18next && window.i18next.isInitialized) {
            new PricingCardComponent(cardElement, options);
        } else if (window.i18next) {
            window.i18next.on('initialized', () => {
                 new PricingCardComponent(cardElement, options);
            });
        } else {
            console.warn("i18next n'est pas détecté, initialisation de PricingCardComponent sans support de traduction dynamique initial.");
            new PricingCardComponent(cardElement, options);
        }
    });
});