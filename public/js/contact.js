// public/js/contact.js

/**
 * Initialise la page de contact.
 * Charge les composants communs (header, footer) et met en place la logique du formulaire de contact.
 */
async function initializeContactPage() {
    // Charger le header et le footer
    if (window.siteComponents && typeof window.siteComponents.loadCommonComponents === 'function') {
        await window.siteComponents.loadCommonComponents();
    } else {
        console.error("La librairie de composants (siteComponents) n'est pas chargée. Le header et le footer ne peuvent pas être injectés.");
        const headerPlaceholder = document.getElementById('site-header-placeholder');
        const footerPlaceholder = document.getElementById('site-footer-placeholder');
        if (headerPlaceholder) headerPlaceholder.innerHTML = "<p style='color:red;'>Erreur: Impossible de charger l'en-tête.</p>";
        if (footerPlaceholder) footerPlaceholder.innerHTML = "<p style='color:red;'>Erreur: Impossible de charger le pied de page.</p>";
        return;
    }

    console.log("Page de contact initialisée et composants communs chargés.");

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form'); // ID du formulaire dans contact.html
    const formStatus = document.getElementById('contact-form-status'); // Pour afficher les messages de succès/erreur

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Empêcher la soumission standard du formulaire
            formStatus.textContent = 'Envoi en cours...';
            formStatus.className = 'status-message pending'; // Classe CSS pour le style

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Validation simple côté client
            if (!name || !email || !subject || !message) {
                formStatus.textContent = 'Veuillez remplir tous les champs obligatoires.';
                formStatus.className = 'status-message error';
                return;
            }
            if (!isValidEmail(email)) {
                formStatus.textContent = 'Veuillez fournir une adresse e-mail valide.';
                formStatus.className = 'status-message error';
                return;
            }

            // Simulation d'un envoi de formulaire (remplacer par un vrai appel API si nécessaire)
            try {
                // Simuler un délai réseau
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Ici, vous feriez normalement un appel fetch vers votre backend
                // Exemple :
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ name, email, subject, message })
                // });
                // if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
                // const result = await response.json();

                console.log('Données du formulaire (simulation):', { name, email, subject, message });
                formStatus.textContent = 'Merci ! Votre message a été envoyé avec succès.';
                formStatus.className = 'status-message success';
                contactForm.reset(); // Réinitialiser le formulaire après succès
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
                formStatus.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
                formStatus.className = 'status-message error';
            }
        });
    } else {
        console.warn("Le formulaire de contact ou l'élément de statut n'a pas été trouvé sur la page.");
    }
}

/**
 * Valide un format d'e-mail simple.
 * @param {string} email - L'adresse e-mail à valider.
 * @returns {boolean} - True si l'e-mail est valide, sinon false.
 */
function isValidEmail(email) {
    // Expression régulière simple pour la validation d'e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * S'assure que le DOM est complètement chargé avant d'exécuter les scripts d'initialisation.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeContactPage();
});

// Si d'autres modules JS ont besoin d'accéder à des fonctions spécifiques à la page de contact,
// exportez-les ici (si vous utilisez une structure de module ES6)
// export { initializeContactPage };