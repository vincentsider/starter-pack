// public/js/components/notification.js

/**
 * Gère l'affichage des notifications (toasts).
 * Nécessite Bootstrap 5 Toasts pour fonctionner correctement.
 * Assurez-vous que Bootstrap JS est inclus dans votre page.
 */
const NotificationManager = {
    container: null,

    /**
     * Initialise le conteneur de notifications.
     * Devrait être appelé une fois au chargement de la page.
     */
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container position-fixed top-0 end-0 p-3';
            this.container.style.zIndex = '1090'; // S'assurer qu'il est au-dessus de la plupart des éléments
            document.body.appendChild(this.container);
        }
    },

    /**
     * Affiche une notification.
     * @param {Object} options - Options de la notification.
     * @param {string} [options.title='Notification'] - Titre de la notification. Requis si showHeader est true.
     * @param {string} options.message - Message de la notification. Requis.
     * @param {string} [options.type='info'] - Type de notification ('info', 'success', 'warning', 'error').
     * @param {number} [options.delay=5000] - Délai avant la disparition automatique (ms). Mettre à 0 ou false pour persistante.
     * @param {boolean} [options.autohide=true] - Si la notification doit se cacher automatiquement.
     * @param {boolean} [options.showHeader=true] - Si l'en-tête de la notification doit être affiché.
     * @param {string} [options.iconClass=''] - Classe pour une icône personnalisée dans l'en-tête (ex: 'bi bi-info-circle-fill').
     * @param {string} [options.customClasses=''] - Classes CSS personnalisées à ajouter au toast.
     * @param {function} [options.onClose=() => {}] - Callback lorsque la notification est fermée.
     */
    show(options = {}) {
        if (!this.container) {
            this.init();
        }

        if (!options.message) {
            console.error('Notification message is required.');
            return;
        }

        const {
            title = 'Notification',
            message,
            type = 'info', // 'info', 'success', 'warning', 'error'
            delay = 5000,
            autohide = true,
            showHeader = true,
            iconClass = '', //  Ex: 'bi bi-check-circle-fill'
            customClasses = '',
            onClose = () => {}
        } = options;

        const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const toastElement = document.createElement('div');
        toastElement.id = toastId;
        toastElement.className = `toast ${customClasses}`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        let toastHeaderHtml = '';
        if (showHeader) {
            let iconHtml = '';
            let effectiveIconClass = iconClass;
            if (!effectiveIconClass) { // Icônes par défaut basées sur le type
                switch (type) {
                    case 'success':
                        effectiveIconClass = 'bi bi-check-circle-fill text-success';
                        break;
                    case 'error':
                        effectiveIconClass = 'bi bi-x-octagon-fill text-danger';
                        break;
                    case 'warning':
                        effectiveIconClass = 'bi bi-exclamation-triangle-fill text-warning';
                        break;
                    case 'info':
                    default:
                        effectiveIconClass = 'bi bi-info-circle-fill text-info';
                        break;
                }
            }
            if (effectiveIconClass) {
                iconHtml = `<i class="${effectiveIconClass} me-2"></i>`;
            }

            toastHeaderHtml = `
                <div class="toast-header">
                    ${iconHtml}
                    <strong class="me-auto">${title}</strong>
                    <small class="text-muted">maintenant</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
        }

        // Appliquer une couleur de bordure basée sur le type, si pas d'en-tête pour le montrer
        let borderClass = '';
        if (!showHeader) {
            switch (type) {
                case 'success':
                    borderClass = 'border-success border-2 border-start';
                    break;
                case 'error':
                    borderClass = 'border-danger border-2 border-start';
                    break;
                case 'warning':
                    borderClass = 'border-warning border-2 border-start';
                    break;
                case 'info':
                default:
                    borderClass = 'border-info border-2 border-start';
                    break;
            }
            toastElement.classList.add(borderClass);
        }


        const toastBodyHtml = `<div class="toast-body">${message}</div>`;

        toastElement.innerHTML = toastHeaderHtml + toastBodyHtml;

        this.container.appendChild(toastElement);

        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const toastInstance = new bootstrap.Toast(toastElement, {
                animation: true,
                autohide: autohide,
                delay: autohide ? delay : undefined // delay n'a de sens que si autohide est true
            });

            toastElement.addEventListener('hidden.bs.toast', () => {
                onClose();
                toastElement.remove(); // Nettoyer le DOM après la fermeture
            });

            toastInstance.show();
        } else {
            console.warn('Bootstrap Toast JS not found. Notifications will have limited functionality and styling.');
            // Fallback simple si Bootstrap n'est pas là (ne disparaîtra pas automatiquement)
            if (!showHeader) { // Si pas d'en-tête, ajouter un bouton de fermeture au corps
                const closeButton = document.createElement('button');
                closeButton.type = 'button';
                closeButton.className = 'btn-close float-end'; // Style basique
                closeButton.setAttribute('aria-label', 'Close');
                closeButton.onclick = () => {
                    onClose();
                    toastElement.remove();
                };
                toastElement.querySelector('.toast-body').appendChild(closeButton);
            }
            toastElement.classList.add('show'); // Afficher manuellement
        }
    },

    /**
     * Raccourcis pour les types de notifications courants.
     */
    success(message, title = 'Succès', options = {}) {
        this.show({ title, message, type: 'success', ...options });
    },
    error(message, title = 'Erreur', options = {}) {
        this.show({ title, message, type: 'error', autohide: false, ...options }); // Les erreurs sont persistantes par défaut
    },
    warning(message, title = 'Avertissement', options = {}) {
        this.show({ title, message, type: 'warning', ...options });
    },
    info(message, title = 'Information', options = {}) {
        this.show({ title, message, type: 'info', ...options });
    }
};

// Initialiser le gestionnaire au chargement du script
// Il est préférable d'appeler init() explicitement dans votre script principal après le chargement du DOM.
// NotificationManager.init(); // Déplacé pour permettre un contrôle plus fin

// Exemple d'utilisation (à placer dans votre script principal après chargement du DOM)
/*
document.addEventListener('DOMContentLoaded', () => {
    NotificationManager.init(); // Important: initialiser le conteneur

    // Boutons d'exemple
    const showSuccess = document.getElementById('showSuccessToast');
    const showError = document.getElementById('showErrorToast');
    const showWarning = document.getElementById('showWarningToast');
    const showInfo = document.getElementById('showInfoToast');
    const showCustom = document.getElementById('showCustomToast');

    if (showSuccess) {
        showSuccess.addEventListener('click', () => {
            NotificationManager.success('Opération réussie avec succès !');
        });
    }
    if (showError) {
        showError.addEventListener('click', () => {
            NotificationManager.error('Une erreur est survenue. Veuillez réessayer.', 'Échec critique', { delay: 10000 });
        });
    }
    if (showWarning) {
        showWarning.addEventListener('click', () => {
            NotificationManager.warning('Attention, certaines données pourraient être incorrectes.', 'Alerte', { autohide: false });
        });
    }
    if (showInfo) {
        showInfo.addEventListener('click', () => {
            NotificationManager.info('Ceci est une notification d\'information générale.', 'Info');
        });
    }
    if (showCustom) {
        showCustom.addEventListener('click', () => {
            NotificationManager.show({
                title: 'Notification Très Personnalisée',
                message: 'Avec une <strong>icône FontAwesome</strong> et une durée plus longue.',
                type: 'info',
                delay: 7000,
                iconClass: 'fas fa-rocket', // Assurez-vous que FontAwesome est chargé
                customClasses: 'my-custom-toast-class',
                showHeader: true,
                onClose: () => console.log('Toast personnalisé fermé.')
            });
        });
    }
});
*/