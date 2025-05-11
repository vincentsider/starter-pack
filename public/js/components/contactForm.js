// public/js/components/contactForm.js

/**
 * Gère la logique du composant ContactForm.
 * Gère la validation des entrées, la soumission du formulaire (simulée) et les messages de retour.
 * Gère également les mises à jour de traduction pour les labels, placeholders et messages.
 */
class ContactFormComponent {
    /**
     * @param {HTMLFormElement} formElement L'élément formulaire HTML.
     * @param {object} options Options de configuration (actuellement non utilisées).
     */
    constructor(formElement, options = {}) {
        if (!formElement || formElement.tagName !== 'FORM') {
            console.warn('ContactFormComponent: Élément formulaire non valide fourni.');
            return;
        }
        this.formElement = formElement;
        this.options = options;

        // Trouver les champs du formulaire et le conteneur de messages
        this.nameInput = DOMUtils.find('#contact-name', this.formElement);
        this.emailInput = DOMUtils.find('#contact-email', this.formElement);
        this.subjectInput = DOMUtils.find('#contact-subject', this.formElement);
        this.messageTextarea = DOMUtils.find('#contact-message', this.formElement);
        this.submitButton = DOMUtils.find('button[type="submit"]', this.formElement);
        this.statusMessageElement = DOMUtils.find('.contact-form-status', this.formElement); // Pour afficher les messages de succès/erreur

        // Clés i18n pour les messages de validation et de statut
        this.validationMessagesKeys = {
            nameRequired: 'contact.validation.nameRequired',
            emailRequired: 'contact.validation.emailRequired',
            emailInvalid: 'contact.validation.emailInvalid',
            subjectRequired: 'contact.validation.subjectRequired',
            messageRequired: 'contact.validation.messageRequired',
            submissionSuccess: 'contact.status.submissionSuccess',
            submissionError: 'contact.status.submissionError',
        };

        this.init();
    }

    init() {
        this.formElement.addEventListener('submit', (event) => this.handleSubmit(event));
        this.updateTranslations(); // Mettre à jour les traductions des labels/placeholders au chargement initial

        if (window.i18next) {
            window.i18next.on('languageChanged', () => this.updateTranslations());
        }
        console.log('ContactFormComponent initialisé pour:', this.formElement);
    }

    /**
     * Met à jour les textes traduisibles du formulaire (labels, placeholders, bouton).
     */
    updateTranslations() {
        if (!window.i18next) return;

        // Traduire les labels (si existants et utilisant data-i18n)
        const labels = DOMUtils.findAll('label[data-i18n]', this.formElement);
        labels.forEach(label => {
            const key = label.getAttribute('data-i18n');
            const translated = window.i18next.t(key);
            if (translated !== key) label.textContent = translated;
        });

        // Traduire les placeholders des inputs/textarea
        [this.nameInput, this.emailInput, this.subjectInput, this.messageTextarea].forEach(input => {
            if (input) {
                const placeholderKey = input.getAttribute('data-i18n-placeholder');
                if (placeholderKey) {
                    const translatedPlaceholder = window.i18next.t(placeholderKey);
                    if (translatedPlaceholder !== placeholderKey) input.setAttribute('placeholder', translatedPlaceholder);
                }
            }
        });

        // Traduire le texte du bouton de soumission
        if (this.submitButton) {
            const buttonKey = this.submitButton.getAttribute('data-i18n');
            if (buttonKey) {
                const translatedText = window.i18next.t(buttonKey);
                if (translatedText !== buttonKey) this.submitButton.textContent = translatedText;
            }
        }
         // Effacer le message de statut lors du changement de langue pour éviter un message obsolète
        if (this.statusMessageElement) {
            this.statusMessageElement.textContent = '';
            this.statusMessageElement.className = 'contact-form-status'; // Réinitialiser la classe
        }
    }

    /**
     * Gère la soumission du formulaire.
     * @param {Event} event L'événement de soumission.
     */
    async handleSubmit(event) {
        event.preventDefault();
        this.clearStatusMessage();

        if (!this.validateForm()) {
            return; // La validation a échoué, les messages d'erreur sont affichés par validateForm
        }

        // Simuler une soumission de formulaire
        this.showStatusMessage(window.i18next.t(this.validationMessagesKeys.submissionSuccess), 'success');
        console.log('Formulaire soumis (simulation):', {
            name: this.nameInput.value,
            email: this.emailInput.value,
            subject: this.subjectInput.value,
            message: this.messageTextarea.value,
        });
        this.formElement.reset(); // Réinitialiser le formulaire après une soumission réussie

        // TODO: Remplacer par une véritable logique de soumission d'API (par exemple, fetch)
        // try {
        //     const response = await fetch('/api/contact', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             name: this.nameInput.value,
        //             email: this.emailInput.value,
        //             subject: this.subjectInput.value,
        //             message: this.messageTextarea.value,
        //         }),
        //     });
        //     if (response.ok) {
        //         this.showStatusMessage(window.i18next.t(this.validationMessagesKeys.submissionSuccess), 'success');
        //         this.formElement.reset();
        //     } else {
        //         const errorData = await response.json();
        //         this.showStatusMessage(errorData.message || window.i18next.t(this.validationMessagesKeys.submissionError), 'error');
        //     }
        // } catch (error) {
        //     console.error('Erreur de soumission du formulaire:', error);
        //     this.showStatusMessage(window.i18next.t(this.validationMessagesKeys.submissionError), 'error');
        // }
    }

    /**
     * Valide les champs du formulaire.
     * @returns {boolean} True si le formulaire est valide, sinon False.
     */
    validateForm() {
        let isValid = true;
        this.clearAllValidationMessages();

        // Validation du nom
        if (!this.nameInput.value.trim()) {
            this.showValidationMessage(this.nameInput, window.i18next.t(this.validationMessagesKeys.nameRequired));
            isValid = false;
        }

        // Validation de l'email
        if (!this.emailInput.value.trim()) {
            this.showValidationMessage(this.emailInput, window.i18next.t(this.validationMessagesKeys.emailRequired));
            isValid = false;
        } else if (!this.isValidEmail(this.emailInput.value.trim())) {
            this.showValidationMessage(this.emailInput, window.i18next.t(this.validationMessagesKeys.emailInvalid));
            isValid = false;
        }

        // Validation du sujet
        if (!this.subjectInput.value.trim()) {
            this.showValidationMessage(this.subjectInput, window.i18next.t(this.validationMessagesKeys.subjectRequired));
            isValid = false;
        }

        // Validation du message
        if (!this.messageTextarea.value.trim()) {
            this.showValidationMessage(this.messageTextarea, window.i18next.t(this.validationMessagesKeys.messageRequired));
            isValid = false;
        }

        return isValid;
    }

    /**
     * Vérifie si une chaîne est une adresse email valide.
     * @param {string} email L'email à valider.
     * @returns {boolean} True si l'email est valide.
     */
    isValidEmail(email) {
        // Expression régulière simple pour la validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Affiche un message de validation pour un champ spécifique.
     * @param {HTMLInputElement|HTMLTextAreaElement} inputElement L'élément de champ.
     * @param {string} message Le message de validation.
     */
    showValidationMessage(inputElement, message) {
        inputElement.classList.add('is-invalid');
        let messageElement = inputElement.nextElementSibling;
        if (!messageElement || !messageElement.classList.contains('invalid-feedback')) {
            messageElement = document.createElement('div');
            messageElement.className = 'invalid-feedback';
            inputElement.parentNode.insertBefore(messageElement, inputElement.nextSibling);
        }
        messageElement.textContent = message;
        messageElement.style.display = 'block'; // S'assurer qu'il est visible
    }

    /**
     * Efface tous les messages de validation et supprime les classes d'erreur.
     */
    clearAllValidationMessages() {
        const invalidInputs = DOMUtils.findAll('.is-invalid', this.formElement);
        invalidInputs.forEach(input => input.classList.remove('is-invalid'));

        const feedbackMessages = DOMUtils.findAll('.invalid-feedback', this.formElement);
        feedbackMessages.forEach(msg => msg.style.display = 'none');
    }

    /**
     * Affiche un message de statut (succès/erreur) pour le formulaire.
     * @param {string} message Le message à afficher.
     * @param {'success'|'error'} type Le type de message.
     */
    showStatusMessage(message, type) {
        if (this.statusMessageElement) {
            this.statusMessageElement.textContent = message;
            this.statusMessageElement.className = `contact-form-status form-${type}`; // ex: form-success, form-error
            this.statusMessageElement.style.display = 'block';
        }
    }

    /**
     * Efface le message de statut du formulaire.
     */
    clearStatusMessage() {
        if (this.statusMessageElement) {
            this.statusMessageElement.textContent = '';
            this.statusMessageElement.style.display = 'none';
            this.statusMessageElement.className = 'contact-form-status';
        }
    }
}

// Initialisation automatique du formulaire de contact ayant l'attribut data-component="contact-form"
document.addEventListener('DOMContentLoaded', () => {
    const contactFormElement = DOMUtils.find('[data-component="contact-form"]');
    if (contactFormElement) {
        if (window.i18next && window.i18next.isInitialized) {
            new ContactFormComponent(contactFormElement);
        } else if (window.i18next) {
            window.i18next.on('initialized', () => {
                 new ContactFormComponent(contactFormElement);
            });
        } else {
            console.warn("i18next n'est pas détecté, initialisation de ContactFormComponent sans support de traduction dynamique initial.");
            new ContactFormComponent(contactFormElement);
        }
    }
});