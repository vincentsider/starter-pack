// public/js/components/footer.js

/**
 * Initialise la logique du pied de page, y compris la mise à jour de l'année en cours
 * et la gestion du formulaire d'inscription à la newsletter.
 */
function initializeFooter() {
    updateCurrentYear();
    setupNewsletterForm();
}

/**
 * Met à jour l'élément avec l'ID 'current-year' avec l'année en cours.
 */
function updateCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("L'élément avec l'ID 'current-year' n'a pas été trouvé dans le DOM pour le pied de page.");
    }
}

/**
 * Configure la gestion de la soumission du formulaire d'inscription à la newsletter.
 */
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmailInput = document.getElementById('newsletter-email');
    const newsletterMessageDiv = document.getElementById('newsletter-message');

    if (!newsletterForm || !newsletterEmailInput || !newsletterMessageDiv) {
        console.warn("Un ou plusieurs éléments du formulaire de newsletter sont manquants dans le DOM.");
        return;
    }

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission standard du formulaire

        const email = newsletterEmailInput.value.trim();

        // Validation simple de l'email
        if (!isValidEmail(email)) {
            displayNewsletterMessage('Veuillez entrer une adresse email valide.', 'error', newsletterMessageDiv);
            newsletterEmailInput.focus();
            return;
        }

        // Simuler une soumission de formulaire (remplacer par une vraie requête API si nécessaire)
        displayNewsletterMessage('Inscription en cours...', 'info', newsletterMessageDiv);

        // Simulation d'une réponse de l'API après un délai
        setTimeout(() => {
            // Dans un cas réel, vérifier ici la réponse du serveur
            // Pour la simulation, on considère que c'est toujours un succès.
            displayNewsletterMessage(`Merci de vous être inscrit avec ${email} !`, 'success', newsletterMessageDiv);
            newsletterForm.reset(); // Réinitialiser le formulaire après succès
        }, 1500); // Simule un délai réseau de 1.5 secondes
    });
}

/**
 * Vérifie si une chaîne de caractères est une adresse email valide.
 * @param {string} email L'adresse email à valider.
 * @returns {boolean} True si l'email est valide, false sinon.
 */
function isValidEmail(email) {
    // Expression régulière simple pour la validation d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Affiche un message dans la zone de message de la newsletter.
 * @param {string} message Le message à afficher.
 * @param {'success'|'error'|'info'} type Le type de message (pour le style).
 * @param {HTMLElement} messageDiv L'élément où afficher le message.
 */
function displayNewsletterMessage(message, type, messageDiv) {
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `newsletter-message ${type}`; // Appliquer la classe pour le style
        // Rendre le message visible et s'assurer qu'il est lu par les lecteurs d'écran
        messageDiv.style.display = 'block'; 
    }
}

// Initialiser le pied de page lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', initializeFooter);