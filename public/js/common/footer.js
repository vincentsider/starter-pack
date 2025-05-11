// public/js/common/footer.js

/**
 * Gère l'initialisation et les interactions du composant Footer.
 * - Affichage et fonctionnalité du bouton "Retour en haut".
 * - Mise à jour de l'année en cours dans le copyright.
 * - Gestion basique du formulaire de newsletter.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Bouton "Retour en haut"
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Afficher le bouton quand l'utilisateur a fait défiler la page
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Afficher après 300px de défilement
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Remonter en haut de la page au clic
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Optionnel : Mettre le focus sur un élément en haut de la page après le scroll
            // document.querySelector('header h1 a').focus();
        });
    }

    // Mise à jour de l'année en cours pour le copyright
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Gestion du formulaire de newsletter (exemple basique)
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    const newsletterEmailInput = document.getElementById('newsletter-email');

    if (newsletterForm && newsletterMessage && newsletterEmailInput) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterEmailInput.value.trim();

            // Validation simple de l'email
            if (!email || !validateEmail(email)) {
                displayNewsletterMessage(window.i18nInstance.t('footer.newsletter.invalidEmail'), 'error');
                newsletterEmailInput.focus();
                return;
            }

            // Simuler un appel API
            displayNewsletterMessage(window.i18nInstance.t('footer.newsletter.subscribing'), 'info'); // 'info' pourrait être une classe pour un message neutre/de chargement
            newsletterForm.querySelector('button[type="submit"]').disabled = true;

            try {
                // Remplacer par un vrai appel fetch à votre endpoint de newsletter
                // const response = await fetch('/api/subscribe-newsletter', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ email: email })
                // });

                // Simulation de réponse
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simule une latence réseau
                const mockSuccess = Math.random() > 0.2; // 80% de chance de succès pour la démo

                if (mockSuccess) { // Remplacer par if (response.ok)
                    displayNewsletterMessage(window.i18nInstance.t('footer.newsletter.success'), 'success');
                    newsletterEmailInput.value = ''; // Vider le champ
                } else {
                    // const errorData = await response.json();
                    // displayNewsletterMessage(errorData.message || window.i18nInstance.t('footer.newsletter.error'), 'error');
                    displayNewsletterMessage(window.i18nInstance.t('footer.newsletter.error'), 'error'); // Message d'erreur générique simulé
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                displayNewsletterMessage(window.i18nInstance.t('footer.newsletter.error'), 'error');
            } finally {
                newsletterForm.querySelector('button[type="submit"]').disabled = false;
            }
        });
    }

    /**
     * Affiche un message pour la newsletter.
     * @param {string} message - Le message à afficher.
     * @param {'success'|'error'|'info'} type - Le type de message.
     */
    function displayNewsletterMessage(message, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = message;
            newsletterMessage.className = `newsletter-message ${type}`; // Applique la classe de style
            // Rendre le message visible pour les lecteurs d'écran immédiatement
            newsletterMessage.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

            // Optionnel : cacher le message après quelques secondes (sauf pour les erreurs persistantes)
            if (type !== 'error') {
                setTimeout(() => {
                    if (newsletterMessage.textContent === message) { // S'assure que le message n'a pas changé entre-temps
                       // newsletterMessage.textContent = '';
                       // newsletterMessage.className = 'newsletter-message';
                       // newsletterMessage.removeAttribute('aria-live');
                    }
                }, 5000); // Cacher après 5 secondes
            }
        }
    }

    /**
     * Valide un format d'email simple.
     * @param {string} email - L'email à valider.
     * @returns {boolean} - True si l'email est valide, sinon false.
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});