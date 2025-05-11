// public/js/components/contact_form_validation.js

/**
 * Gère la validation du formulaire de contact.
 */
export function initContactFormValidation() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêcher la soumission par défaut

            let isValid = true;
            const errors = [];

            // Récupérer les champs du formulaire
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const consentCheckbox = document.getElementById('consent'); // Ajout pour le consentement

            // Réinitialiser les messages d'erreur précédents
            clearErrorMessages(this);

            // Validation du nom
            if (!nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Le nom est requis.');
                errors.push('Nom requis');
            }

            // Validation de l'email
            if (!emailInput.value.trim()) {
                isValid = false;
                showError(emailInput, 'L\'adresse e-mail est requise.');
                errors.push('Email requis');
            } else if (!isValidEmail(emailInput.value.trim())) {
                isValid = false;
                showError(emailInput, 'Veuillez entrer une adresse e-mail valide.');
                errors.push('Email invalide');
            }

            // Validation du sujet (optionnel, mais si présent, non vide)
            if (subjectInput.value.trim() === "" && subjectInput.hasAttribute('required')) { // Vérifier si le champ est marqué comme requis
                isValid = false;
                showError(subjectInput, 'Le sujet est requis.');
                errors.push('Sujet requis');
            }


            // Validation du message
            if (!messageInput.value.trim()) {
                isValid = false;
                showError(messageInput, 'Le message est requis.');
                errors.push('Message requis');
            } else if (messageInput.value.trim().length < 10) {
                isValid = false;
                showError(messageInput, 'Le message doit contenir au moins 10 caractères.');
                errors.push('Message trop court');
            }

            // Validation du consentement
            if (consentCheckbox && !consentCheckbox.checked) {
                isValid = false;
                showError(consentCheckbox.parentElement, 'Vous devez accepter les conditions.'); // Afficher l'erreur près du parent pour la case à cocher
                errors.push('Consentement requis');
            }


            if (isValid) {
                // Si le formulaire est valide, vous pouvez le soumettre ici (par exemple, via AJAX)
                console.log('Formulaire valide, soumission...');
                // Simuler une soumission réussie
                displayFormSubmissionStatus(true, 'Votre message a été envoyé avec succès !');
                contactForm.reset(); // Réinitialiser le formulaire après soumission
            } else {
                console.log('Formulaire invalide :', errors);
                // Afficher un message d'erreur global si nécessaire, ou se concentrer sur les erreurs de champ individuelles
                displayFormSubmissionStatus(false, 'Veuillez corriger les erreurs dans le formulaire.');
            }
        });
        console.log("Validation du formulaire de contact initialisée.");
    } else {
        console.warn("Formulaire de contact non trouvé. La validation ne fonctionnera pas.");
    }
}

/**
 * Affiche un message d'erreur pour un champ donné.
 * @param {HTMLElement} inputElement - L'élément de champ.
 * @param {string} message - Le message d'erreur.
 */
function showError(inputElement, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    // Placer le message d'erreur après le champ ou son parent (utile pour les cases à cocher/radios)
    if (inputElement.parentNode.classList.contains('form-group') || inputElement.type === 'checkbox' || inputElement.type === 'radio') {
         inputElement.parentNode.appendChild(errorElement);
    } else {
        inputElement.insertAdjacentElement('afterend', errorElement);
    }
    inputElement.classList.add('is-invalid');
}

/**
 * Supprime tous les messages d'erreur du formulaire.
 * @param {HTMLFormElement} formElement - L'élément formulaire.
 */
function clearErrorMessages(formElement) {
    const errorMessages = formElement.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());

    const invalidFields = formElement.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => field.classList.remove('is-invalid'));
}

/**
 * Vérifie si une adresse e-mail est valide.
 * @param {string} email - L'adresse e-mail à valider.
 * @returns {boolean} - True si l'email est valide, sinon false.
 */
function isValidEmail(email) {
    // Expression régulière simple pour la validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Affiche le statut de la soumission du formulaire.
 * @param {boolean} success - Indique si la soumission a réussi.
 * @param {string} message - Le message à afficher.
 */
function displayFormSubmissionStatus(success, message) {
    const formStatusElement = document.getElementById('form-status-message');
    if (formStatusElement) {
        formStatusElement.textContent = message;
        formStatusElement.className = success ? 'status-success' : 'status-error';
        formStatusElement.style.display = 'block';

        // Cacher le message après quelques secondes
        setTimeout(() => {
            formStatusElement.style.display = 'none';
            formStatusElement.textContent = '';
        }, 5000);
    }
}