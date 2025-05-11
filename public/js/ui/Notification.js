// public/js/ui/Notification.js

/**
 * Classe pour gérer l'affichage des notifications.
 *
 * Utilisation :
 * 1. HTML (Optionnel, le container est créé dynamiquement si non trouvé) :
 *    <div id="notification-container" class="notification-container"></div>
 *
 * 2. JavaScript :
 *    Notification.show({
 *        title: 'Succès!',
 *        message: 'Votre action a été effectuée avec succès.',
 *        type: 'success', // 'default', 'primary', 'success', 'danger', 'warning', 'info'
 *        duration: 5000, // en ms, 0 pour persistent
 *        canClose: true, // si l'utilisateur peut fermer la notif
 *        onClose: () => { console.log('Notification fermée'); }
 *    });
 *
 *    // Pour une notification persistante :
 *    const persistentNotif = Notification.show({
 *        title: 'Info Importante',
 *        message: 'Ceci est une information persistante.',
 *        type: 'info',
 *        duration: 0
 *    });
 *    // Pour la fermer manuellement plus tard :
 *    // persistentNotif.close();
 */
class Notification {
    constructor(options = {}) {
        this.options = {
            title: '',
            message: '',
            type: 'default', // 'default', 'primary', 'success', 'danger', 'warning', 'info'
            duration: 5000, // en millisecondes, 0 pour une notification persistante
            canClose: true, // si l'utilisateur peut fermer la notification
            containerId: 'notification-container',
            onOpen: () => {},
            onClose: () => {},
            ...options,
        };

        this.notificationElement = null;
        this.containerElement = null;
        this._timeoutId = null;

        this._createNotificationElement();
        this._addToContainer();
    }

    _createNotificationElement() {
        this.notificationElement = document.createElement('div');
        this.notificationElement.classList.add('notification', `notification-${this.options.type}`);

        let innerHTML = '';
        if (this.options.title) {
            innerHTML += `<div class="notification-header">`;
            innerHTML += `<h5 class="notification-title">${this.options.title}</h5>`;
            if (this.options.canClose) {
                innerHTML += `<button type="button" class="notification-close-btn" aria-label="Close">&times;</button>`;
            }
            innerHTML += `</div>`;
            innerHTML += `<div class="notification-body">${this.options.message}</div>`;
        } else {
            // Si pas de titre, le message prend tout l'espace, et le bouton de fermeture est à droite
            innerHTML += `<div class="notification-body" style="display: flex; justify-content: space-between; align-items: center;">`;
            innerHTML += `<span>${this.options.message}</span>`;
            if (this.options.canClose) {
                innerHTML += `<button type="button" class="notification-close-btn" aria-label="Close" style="margin-left: 10px;">&times;</button>`;
            }
            innerHTML += `</div>`;
        }


        this.notificationElement.innerHTML = innerHTML;

        if (this.options.canClose) {
            const closeButton = this.notificationElement.querySelector('.notification-close-btn');
            if (closeButton) {
                closeButton.addEventListener('click', () => this.close());
            }
        }
    }

    _getOrCreateContainer() {
        let container = document.getElementById(this.options.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.options.containerId;
            container.classList.add('notification-container'); // Assurez-vous que la classe CSS est ajoutée
            document.body.appendChild(container);
        }
        return container;
    }

    _addToContainer() {
        this.containerElement = this._getOrCreateContainer();
        this.containerElement.appendChild(this.notificationElement);
    }

    show() {
        // Forcer un reflow pour l'animation
        // eslint-disable-next-line no-unused-expressions
        this.notificationElement.offsetHeight;
        this.notificationElement.classList.add('show');

        if (typeof this.options.onOpen === 'function') {
            this.options.onOpen(this);
        }

        if (this.options.duration > 0) {
            this._timeoutId = setTimeout(() => this.close(), this.options.duration);
        }
        return this; // Pour permettre le chaînage ou la sauvegarde de l'instance
    }

    close() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }

        this.notificationElement.classList.remove('show');
        this.notificationElement.classList.add('fade-out'); // Ajoute la classe pour l'animation de sortie

        // Supprimer l'élément du DOM après la transition
        const transitionDuration = parseFloat(getComputedStyle(this.notificationElement).transitionDuration) * 1000 || 350;
        setTimeout(() => {
            if (this.notificationElement.parentNode) {
                this.notificationElement.parentNode.removeChild(this.notificationElement);
            }
            if (typeof this.options.onClose === 'function') {
                this.options.onClose(this);
            }
        }, transitionDuration);
    }

    // Méthode statique pour afficher facilement une notification
    static show(options) {
        const notificationInstance = new Notification(options);
        // Léger délai pour s'assurer que l'élément est dans le DOM avant l'animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notificationInstance.show();
            });
        });
        return notificationInstance;
    }
}

// Exporter pour une utilisation en tant que module si le projet évolue
// export default Notification;

// Rendre accessible globalement pour un usage simple sans module
// window.Notification = Notification;

// Exemple d'utilisation (peut être commenté ou retiré pour la production)
/*
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Notification.show({ title: 'Bienvenue!', message: 'Le système de notification est prêt.', type: 'info', duration: 3000 });
        // Notification.show({ message: 'Ceci est une notification simple.', type: 'default', duration: 4000 });

        // const testBtn = document.getElementById('test-notification-btn'); // Assurez-vous d'avoir un bouton avec cet ID
        // if (testBtn) {
        //     testBtn.addEventListener('click', () => {
        //         Notification.show({
        //             title: 'Test manuel',
        //             message: 'Notification déclenchée par un clic.',
        //             type: 'success',
        //             duration: 5000
        //         });
        //     });
        // }
    });
}
*/