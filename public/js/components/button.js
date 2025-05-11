// public/js/components/button.js

/**
 * Crée et retourne un élément bouton HTML.
 * @param {object} options - Les options pour configurer le bouton.
 * @param {string} options.text - Le texte à afficher sur le bouton.
 * @param {string} [options.id=''] - L'ID du bouton.
 * @param {Array<string>} [options.classes=[]] - Un tableau de classes CSS à appliquer au bouton. La classe 'btn' est ajoutée par défaut.
 * @param {string} [options.type='button'] - Le type de bouton (ex: 'button', 'submit', 'reset').
 * @param {string} [options.iconClass=''] - Classe pour une icône à afficher avant le texte (ex: Font Awesome).
 * @param {function} [options.onClick=null] - La fonction à exécuter lors du clic sur le bouton.
 * @param {object} [options.attributes={}] - Un objet d'attributs supplémentaires à ajouter au bouton (ex: {'data-target': '#modal'}).
 * @returns {HTMLButtonElement} L'élément bouton créé.
 */
function createButton({
    text,
    id = '',
    classes = [],
    type = 'button',
    iconClass = '',
    onClick = null,
    attributes = {}
}) {
    const button = document.createElement('button');
    button.setAttribute('type', type);
    button.textContent = text;

    if (id) {
        button.id = id;
    }

    // Ajoute la classe 'btn' par défaut et les classes personnalisées
    const allClasses = ['btn', ...classes];
    allClasses.forEach(cls => button.classList.add(cls));

    if (iconClass) {
        const icon = document.createElement('i');
        icon.className = iconClass; // ex: "fas fa-plus"
        button.prepend(icon); // Ajoute l'icône avant le texte
        if (text) { // Ajoute un espace si du texte est présent
            const space = document.createTextNode(' ');
            button.insertBefore(space, button.childNodes[1]);
        }
    }

    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }

    for (const attr in attributes) {
        if (Object.hasOwnProperty.call(attributes, attr)) {
            button.setAttribute(attr, attributes[attr]);
        }
    }

    return button;
}

// Exemple d'utilisation (peut être retiré ou commenté en production)
/*
document.addEventListener('DOMContentLoaded', () => {
    const examplesContainer = document.getElementById('button-examples'); // Assurez-vous d'avoir un conteneur avec cet ID dans votre HTML pour tester

    if (examplesContainer) {
        // Bouton simple
        const simpleButton = createButton({ text: 'Click Me' });
        examplesContainer.appendChild(simpleButton);

        // Bouton primaire avec icône et action
        const primaryButton = createButton({
            text: 'Submit Form',
            classes: ['btn-primary'],
            type: 'submit',
            iconClass: 'fas fa-paper-plane', // Assurez-vous que Font Awesome est chargé
            onClick: () => alert('Form Submitted!'),
            attributes: { 'data-custom': 'value123' }
        });
        examplesContainer.appendChild(primaryButton);

        // Bouton secondaire
        const secondaryButton = createButton({
            text: 'Learn More',
            classes: ['btn-secondary'],
            onClick: () => console.log('Secondary button clicked')
        });
        examplesContainer.appendChild(secondaryButton);

        // Bouton avec seulement une icône
        const iconOnlyButton = createButton({
            text: '', // Pas de texte
            classes: ['btn-icon-only'],
            iconClass: 'fas fa-cog', // Exemple d'icône
            onClick: () => alert('Settings clicked!'),
            attributes: { 'aria-label': 'Settings' }
        });
        examplesContainer.appendChild(iconOnlyButton);
    }
});
*/

// Rendre la fonction accessible globalement ou l'exporter si vous utilisez des modules ES6
// window.createButton = createButton; // Pour une portée globale simple
// export { createButton }; // Pour les modules ES6 (nécessiterait <script type="module">)