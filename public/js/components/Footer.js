// public/js/components/Footer.js

/**
 * Charge et affiche le footer.
 * Insère le HTML du footer dans l'élément <footer> de la page.
 * Met à jour les textes traduisibles du footer.
 */
export async function displayFooter() {
    const footerElement = document.querySelector('footer#app-footer');
    if (!footerElement) {
        console.error("L'élément footer#app-footer est introuvable dans le DOM.");
        return;
    }

    const currentYear = new Date().getFullYear();

    footerElement.innerHTML = `
        <div class="container footer-container">
            <div class="footer-links">
                <a href="#" data-page-link="privacy" data-i18n="footer.links.privacy">Politique de confidentialité</a>
                <a href="#" data-page-link="terms" data-i18n="footer.links.terms">Conditions d'utilisation</a>
                <a href="#" data-page-link="legal" data-i18n="footer.links.legal">Mentions légales</a>
            </div>
            <div class="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-i18n-aria-label="footer.social.facebook">
                    <img src="assets/icons/facebook.svg" alt="Facebook" class="social-icon">
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" data-i18n-aria-label="footer.social.twitter">
                    <img src="assets/icons/twitter.svg" alt="Twitter" class="social-icon">
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-i18n-aria-label="footer.social.linkedin">
                    <img src="assets/icons/linkedin.svg" alt="LinkedIn" class="social-icon">
                </a>
            </div>
            <div class="footer-copyright">
                <p data-i18n="footer.copyright" data-i18n-variables='{"year": "${currentYear}"}'>
                    &copy; ${currentYear} FilterGuard. Tous droits réservés.
                </p>
            </div>
        </div>
    `;

    updateFooterTranslations();
}

/**
 * Met à jour les textes traduisibles du footer.
 * Doit être appelée après le chargement des traductions si le footer est déjà affiché,
 * ou après l'affichage du footer.
 */
export function updateFooterTranslations() {
    const i18nInstance = window.i18n;
    if (i18nInstance) {
        // Mettre à jour les éléments spécifiques au footer
        // La plupart des textes sont dans le innerHTML et seront mis à jour par i18n.updateContent() globalement.
        // Cependant, les aria-label et les variables ont besoin d'une attention particulière si i18n.updateContent ne les gère pas.
        i18nInstance.updateContent(); // Ceci devrait mettre à jour tous les data-i18n
    }
}

// Note: Les liens data-page-link="privacy", "terms", "legal" devront être gérés
// par le routeur dans app.js pour afficher les pages correspondantes (mentions-legales.html, etc.).
// Les icônes sociales (assets/icons/) doivent être ajoutées au projet.