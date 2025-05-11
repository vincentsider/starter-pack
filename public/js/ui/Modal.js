// public/js/ui/Modal.js

/**
 * Classe pour gérer les fenêtres modales.
 * Permet d'ouvrir, de fermer et d'initialiser des modales.
 *
 * Utilisation :
 * 1. HTML :
 *    <button data-modal-target="#myModal">Ouvrir Modal</button>
 *    <div class="modal-overlay" id="myModal">
 *        <div class="modal-container">
 *            <div class="modal-header">
 *                <h5 class="modal-title">Titre du Modal</h5>
 *                <button type="button" class="modal-close-btn" data-modal-dismiss="modal">&times;</button>
 *            </div>
 *            <div class="modal-body">
 *                Contenu du modal...
 *            </div>
 *            <div class="modal-footer">
 *                <button type="button" class="btn btn-secondary" data-modal-dismiss="modal">Fermer</button>
 *                <button type="button" class="btn btn-primary">Sauvegarder</button>
 *            </div>
 *        </div>
 *    </div>
 *
 * 2. JavaScript :
 *    const myModal = new Modal(document.getElementById('myModal'));
 *    // Pour ouvrir : myModal.open();
 *    // Pour fermer : myModal.close();
 *
 *    // Initialisation automatique pour tous les modaux avec data-modal-target
 *    Modal.initializeAll();
 */
class Modal {
    constructor(modalElement, options = {}) {
        if (!modalElement) {
            console.error('Modal element not provided.');
            return;
        }
        this.modalElement = modalElement;
        this.options = {
            backdrop: true, // Si false, cliquer sur le backdrop ne ferme pas le modal
            keyboard: true, // Si false, la touche Echap ne ferme pas le modal
            onOpen: () => {},
            onClose: () => {},
            ...options,
        };

        this._isOpen = false;
        this._boundClose = this.close.bind(this);
        this._boundHandleKeydown = this._handleKeydown.bind(this);
        this._boundHandleBackdropClick = this._handleBackdropClick.bind(this);

        this._initialize();
    }

    _initialize() {
        // Boutons de fermeture dans le modal
        this.modalElement.querySelectorAll('[data-modal-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', this._boundClose);
        });
    }

    open() {
        if (this._isOpen) return;

        this.modalElement.style.display = 'flex'; // Changé pour flex pour le centrage
        document.body.classList.add('modal-open');

        // Forcer le reflow pour que la transition CSS s'applique
        // https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
        // eslint-disable-next-line no-unused-expressions
        this.modalElement.offsetHeight;


        this.modalElement.classList.add('active');
        this._isOpen = true;

        if (this.options.keyboard) {
            document.addEventListener('keydown', this._boundHandleKeydown);
        }
        if (this.options.backdrop) {
            this.modalElement.addEventListener('click', this._boundHandleBackdropClick);
        }

        // Focus sur le premier élément focusable dans le modal (si disponible)
        const focusableElements = this.modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }


        if (typeof this.options.onOpen === 'function') {
            this.options.onOpen(this);
        }
    }

    close() {
        if (!this._isOpen) return;

        this.modalElement.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Attendre la fin de la transition avant de cacher complètement
        const transitionDuration = parseFloat(getComputedStyle(this.modalElement).transitionDuration) * 1000;
        setTimeout(() => {
            this.modalElement.style.display = 'none';
            this._isOpen = false;

            if (typeof this.options.onClose === 'function') {
                this.options.onClose(this);
            }
        }, transitionDuration);


        if (this.options.keyboard) {
            document.removeEventListener('keydown', this._boundHandleKeydown);
        }
        if (this.options.backdrop) {
            this.modalElement.removeEventListener('click', this._boundHandleBackdropClick);
        }
    }

    toggle() {
        if (this._isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    get isOpen() {
        return this._isOpen;
    }

    _handleKeydown(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    _handleBackdropClick(event) {
        if (event.target === this.modalElement) { // Clique sur le .modal-overlay lui-même
            this.close();
        }
    }

    // Méthode statique pour initialiser tous les modaux déclenchés par des boutons
    static initializeAll() {
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        modalTriggers.forEach(trigger => {
            const modalId = trigger.getAttribute('data-modal-target');
            const targetModalElement = document.querySelector(modalId);
            if (targetModalElement) {
                const modalInstance = new Modal(targetModalElement);
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    modalInstance.open();
                });
            } else {
                console.warn(`Modal target element with ID "${modalId}" not found.`);
            }
        });
    }
}

// Initialisation automatique à charger après le DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Modal.initializeAll);
} else {
    Modal.initializeAll(); // Appeler directement si le DOM est déjà chargé
}

// Rendre la classe Modal accessible globalement si nécessaire (par exemple, pour une utilisation dans la console)
// window.Modal = Modal;

// Exporter pour une utilisation en tant que module si le projet évolue
// export default Modal;