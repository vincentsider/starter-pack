// public/js/components/tooltip.js

// Assurez-vous que Popper.js est chargé avant ce script.
// <script src="https://unpkg.com/@popperjs/core@2"></script>

const DefaultTooltipOptions = {
    title: '', // String ou Function
    placement: 'top', // top, bottom, left, right, auto
    trigger: 'hover focus', // hover, focus, click, manual. Peut être une liste séparée par des espaces.
    delay: 0, // { show: 0, hide: 0 } ou nombre unique
    html: false, // Permettre le HTML dans le tooltip
    selector: false, // Pour la délégation d'événements
    template: `
        <div class="tooltip" role="tooltip">
            <div class="tooltip-arrow"></div>
            <div class="tooltip-inner"></div>
        </div>
    `,
    customClass: '', // Classe(s) CSS personnalisée(s) à ajouter au tooltip
    offset: [0, 8], // [skidding, distance] par rapport à l'élément cible
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents', // Ou un élément DOM
    popperConfig: {}, // Configuration personnalisée pour Popper.js
    allowList: { // Éléments et attributs HTML autorisés si html: true (similaire à sanitizeFn de Bootstrap)
        '*': ['class', 'dir', 'id', 'lang', 'role', /^aria-[\w-]*$/i],
        a: ['target', 'href', 'title', 'rel'],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
        // ... ajouter d'autres éléments et attributs si nécessaire
    },
    sanitizeFn: null // Fonction de nettoyage personnalisée (si html: true)
};

class Tooltip {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        if (!this.element) {
            throw new Error('Tooltip target element not found');
        }
        this.config = this._getConfig(options);
        this.tooltipElement = null;
        this.popperInstance = null;
        this._timeout = null;
        this._isShown = false;
        this._isTransitioning = false;

        this._setEventListeners();

        // Stocker l'instance sur l'élément pour un accès facile
        this.element._tooltipInstance = this;
    }

    _getConfig(options) {
        const config = {
            ...DefaultTooltipOptions,
            ...options,
            ...(this.element.dataset.bsPlacement ? { placement: this.element.dataset.bsPlacement } : {}),
            ...(this.element.dataset.bsTitle ? { title: this.element.dataset.bsTitle } : {}),
            ...(this.element.dataset.bsTrigger ? { trigger: this.element.dataset.bsTrigger } : {}),
            ...(this.element.dataset.bsHtml ? { html: this.element.dataset.bsHtml === 'true' } : {}),
            ...(this.element.dataset.bsCustomClass ? { customClass: this.element.dataset.bsCustomClass } : {}),
            ...(this.element.dataset.bsDelay ? { delay: parseInt(this.element.dataset.bsDelay, 10) } : {}),
        };

        if (typeof config.title === 'function') {
            config.title = config.title.call(this.element);
        }
        if (typeof config.delay === 'number') {
            config.delay = {
                show: config.delay,
                hide: config.delay
            };
        }
        return config;
    }

    _setEventListeners() {
        const triggers = this.config.trigger.split(' ');

        triggers.forEach(trigger => {
            if (trigger === 'hover') {
                this.element.addEventListener('mouseenter', () => this.show());
                this.element.addEventListener('mouseleave', () => this.hide());
            } else if (trigger === 'focus') {
                this.element.addEventListener('focus', () => this.show());
                this.element.addEventListener('blur', () => this.hide());
            } else if (trigger === 'click') {
                this.element.addEventListener('click', (event) => {
                    event.preventDefault(); // Empêcher le comportement par défaut si c'est un lien
                    this.toggle();
                });
            }
        });
    }

    _createTooltipElement() {
        const div = document.createElement('div');
        div.innerHTML = this.config.template.trim();
        this.tooltipElement = div.firstChild;

        if (this.config.customClass) {
            this.tooltipElement.classList.add(...this.config.customClass.split(' '));
        }
        document.body.appendChild(this.tooltipElement);
        this._setContent();
    }

    _setContent() {
        const tooltipInner = this.tooltipElement.querySelector('.tooltip-inner');
        if (!tooltipInner) return;

        const title = this._getTitle();

        if (this.config.html) {
            if (this.config.sanitizeFn) {
                tooltipInner.innerHTML = this.config.sanitizeFn(title);
            } else {
                // Simple sanitize (basé sur allowList, pour démo)
                const template = document.createElement('template');
                template.innerHTML = title;
                this._sanitizeHtml(template.content, this.config.allowList);
                tooltipInner.innerHTML = ''; // Clear
                tooltipInner.appendChild(template.content);
            }
        } else {
            tooltipInner.textContent = title;
        }
    }

    _getTitle() {
        let title = this.config.title;
        if (typeof title === 'function') {
            title = title.call(this.element);
        }
        return title || this.element.getAttribute('title') || this.element.dataset.bsOriginalTitle || '';
    }

    _sanitizeHtml(node, allowList) {
        // Implémentation basique pour la démo. Utiliser une lib comme DOMPurify en prod.
        const el = node.firstChild;
        if (el && el.nodeType === Node.ELEMENT_NODE) {
            const elName = el.nodeName.toLowerCase();
            if (!allowList[elName] && !allowList['*']) {
                el.parentNode.removeChild(el);
                return;
            }

            const allowedAttributes = (allowList[elName] || []).concat(allowList['*'] || []);
            for (let i = el.attributes.length - 1; i >= 0; i--) {
                const attr = el.attributes[i];
                let allowed = false;
                for (const rule of allowedAttributes) {
                    if (typeof rule === 'string' && rule.toLowerCase() === attr.name.toLowerCase()) {
                        allowed = true;
                        break;
                    }
                    if (rule instanceof RegExp && rule.test(attr.name)) {
                        allowed = true;
                        break;
                    }
                }
                if (!allowed) {
                    el.removeAttribute(attr.name);
                }
            }
        }
        if (el && el.childNodes && el.childNodes.length > 0) {
            for (let i = el.childNodes.length - 1; i >= 0; i--) {
                this._sanitizeHtml(el.childNodes[i], allowList);
            }
        }
    }


    show() {
        if (this._isShown || this._isTransitioning || !this._getTitle()) return;
        
        clearTimeout(this._timeout);
        this._isTransitioning = true;

        this._timeout = setTimeout(() => {
            if (this._isShown) return; // Déjà visible ou en cours d'affichage par une autre action

            if (!this.tooltipElement) {
                this._createTooltipElement();
            }

            this.tooltipElement.style.display = 'block'; // Popper.js a besoin qu'il soit visible pour le calcul
            
            // Création de l'instance Popper
            const popperOptions = {
                placement: this.config.placement,
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: this.config.offset,
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            boundary: this.config.boundary,
                        },
                    },
                    {
                        name: 'flip',
                        options: {
                            fallbackPlacements: this.config.fallbackPlacements,
                        },
                    },
                    { // Ajout de la flèche
                        name: 'arrow',
                        options: { element: this.tooltipElement.querySelector('.tooltip-arrow') }
                    }
                ],
                ...this.config.popperConfig,
            };

            if (typeof Popper === 'undefined') {
                console.error('Popper.js is required for Tooltip to work correctly.');
                this._isTransitioning = false;
                return;
            }

            this.popperInstance = Popper.createPopper(this.element, this.tooltipElement, popperOptions);

            // Afficher le tooltip
            this.tooltipElement.classList.add('show');
            this._isShown = true;
            
            const transitionDuration = this._getTransitionDuration(this.tooltipElement);
            setTimeout(() => {
                this._isTransitioning = false;
            }, transitionDuration);

        }, this.config.delay.show);
    }

    hide() {
        if (!this._isShown || this._isTransitioning) return;

        clearTimeout(this._timeout);
        this._isTransitioning = true;

        this._timeout = setTimeout(() => {
            if (!this._isShown) return; // Déjà caché

            this.tooltipElement.classList.remove('show');
            
            const transitionDuration = this._getTransitionDuration(this.tooltipElement);
            setTimeout(() => {
                if (this.popperInstance) {
                    this.popperInstance.destroy();
                    this.popperInstance = null;
                }
                if (this.tooltipElement && this.tooltipElement.parentNode) {
                    this.tooltipElement.parentNode.removeChild(this.tooltipElement);
                    this.tooltipElement = null;
                }
                this._isShown = false;
                this._isTransitioning = false;
            }, transitionDuration);

        }, this.config.delay.hide);
    }

    toggle() {
        this._isShown ? this.hide() : this.show();
    }

    dispose() {
        clearTimeout(this._timeout);
        if (this.popperInstance) {
            this.popperInstance.destroy();
        }
        if (this.tooltipElement && this.tooltipElement.parentNode) {
            this.tooltipElement.parentNode.removeChild(this.tooltipElement);
        }
        // Supprimer les écouteurs d'événements (plus complexe sans stocker les références)
        this.element.removeEventListener('mouseenter', this.show);
        this.element.removeEventListener('mouseleave', this.hide);
        this.element.removeEventListener('focus', this.show);
        this.element.removeEventListener('blur', this.hide);
        this.element.removeEventListener('click', this.toggle);

        delete this.element._tooltipInstance;
        this.element = null;
        this.config = null;
        this.tooltipElement = null;
        this.popperInstance = null;
    }

    _getTransitionDuration(element) {
        if (!element) return 0;
        const duration = window.getComputedStyle(element).transitionDuration;
        const floatDuration = parseFloat(duration);
        if (!floatDuration) return 0;
        return duration.includes("ms") ? floatDuration : floatDuration * 1000;
    }

    // --- Static Methods ---
    static getInstance(element) {
        return (typeof element === 'string' ? document.querySelector(element) : element)._tooltipInstance || null;
    }

    static getOrCreateInstance(element, config = {}) {
        return Tooltip.getInstance(element) || new Tooltip(element, config);
    }

    static autoInit(selector = '[data-bs-toggle="tooltip"]') {
        document.querySelectorAll(selector).forEach(el => {
            Tooltip.getOrCreateInstance(el);
        });
    }
}

// Initialisation automatique pour les éléments avec data-bs-toggle="tooltip"
// document.addEventListener('DOMContentLoaded', () => {
//     Tooltip.autoInit();

//     // Exemple d'utilisation programmatique
//     const programmaticTooltipElem = document.getElementById('myProgrammaticTooltip');
//     if (programmaticTooltipElem) {
//         const tooltip = new Tooltip(programmaticTooltipElem, {
//             title: 'Tooltip programmé !',
//             placement: 'right',
//             trigger: 'click'
//         });
//     }
// });

// Exporter la classe si on utilise des modules ES6
// export default Tooltip;