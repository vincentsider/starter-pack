// public/js/components/card.js

/**
 * Crée et retourne un élément carte (card) HTML.
 * Une carte peut contenir une image, un en-tête, un corps et un pied de page.
 *
 * @param {object} options - Les options pour configurer la carte.
 * @param {string} [options.id=''] - L'ID de la carte.
 * @param {Array<string>} [options.classes=[]] - Un tableau de classes CSS à appliquer à la carte. La classe 'card' est ajoutée par défaut.
 * @param {string} [options.imageUrl=''] - L'URL de l'image à afficher en haut de la carte.
 * @param {string} [options.imageAlt='Card image'] - Le texte alternatif pour l'image de la carte.
 * @param {string} [options.title=''] - Le titre de la carte, affiché dans l'en-tête de la carte ou au début du corps.
 * @param {string} [options.titleTag='h5'] - La balise HTML à utiliser pour le titre (ex: 'h3', 'h5').
 * @param {string} [options.contentHtml=''] - Le contenu HTML principal de la carte.
 * @param {string} [options.footerHtml=''] - Le contenu HTML pour le pied de page de la carte.
 * @param {Array<object>} [options.actions=[]] - Un tableau d'objets pour créer des boutons ou des liens dans la carte (souvent dans le pied de page ou le corps).
 *                                              Chaque objet action doit être compatible avec les options de `createButton` ou être un simple lien.
 *                                              Ex: [{ text: 'En savoir plus', classes: ['btn-primary'], onClick: () => {} }]
 *                                              Ex: [{ text: 'Lien externe', href: 'https://example.com', classes: ['card-link'] }]
 * @param {object} [options.attributes={}] - Un objet d'attributs supplémentaires à ajouter à l'élément principal de la carte.
 * @returns {HTMLElement} L'élément carte (div.card) créé.
 */
function createCard({
    id = '',
    classes = [],
    imageUrl = '',
    imageAlt = 'Card image',
    title = '',
    titleTag = 'h5',
    contentHtml = '',
    footerHtml = '',
    actions = [],
    attributes = {}
}) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card'; // Classe de base
    classes.forEach(cls => cardElement.classList.add(cls));

    if (id) {
        cardElement.id = id;
    }

    for (const attr in attributes) {
        if (Object.hasOwnProperty.call(attributes, attr)) {
            cardElement.setAttribute(attr, attributes[attr]);
        }
    }

    // Image de la carte (optionnelle)
    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = imageAlt;
        img.className = 'card-img-top'; // Classe Bootstrap standard pour l'image en haut
        cardElement.appendChild(img);
    }

    // Corps de la carte (toujours présent pour contenir le titre et le contenu)
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Titre de la carte (optionnel, dans le corps)
    if (title) {
        const titleEl = document.createElement(titleTag);
        titleEl.className = 'card-title';
        titleEl.textContent = title;
        cardBody.appendChild(titleEl);
    }

    // Contenu de la carte (optionnel, dans le corps)
    if (contentHtml) {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'card-text'; // Bootstrap utilise .card-text pour le contenu principal
        contentDiv.innerHTML = contentHtml; // Permet d'insérer du HTML
        cardBody.appendChild(contentDiv);
    }

    // Actions (boutons/liens, dans le corps)
    if (actions.length > 0) {
        actions.forEach(action => {
            if (action.href) { // C'est un lien
                const link = document.createElement('a');
                link.href = action.href;
                link.textContent = action.text;
                if(action.classes) link.classList.add(...action.classes, 'card-link'); else link.classList.add('card-link');
                if(action.target) link.target = action.target;
                cardBody.appendChild(link);
            } else { // C'est un bouton (nécessite la fonction createButton)
                if (typeof createButton === 'function') {
                    const button = createButton(action);
                    cardBody.appendChild(button);
                } else {
                    console.warn('createButton function is not defined. Cannot create button for card action.');
                }
            }
        });
    }

    cardElement.appendChild(cardBody);

    // Pied de page de la carte (optionnel)
    if (footerHtml) {
        const cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer';
        cardFooter.innerHTML = footerHtml; // Permet d'insérer du HTML
        cardElement.appendChild(cardFooter);
    }

    return cardElement;
}

// Exemple d'utilisation (peut être retiré ou commenté en production)
/*
document.addEventListener('DOMContentLoaded', () => {
    const examplesContainer = document.getElementById('card-examples'); // Assurez-vous d'avoir un conteneur avec cet ID

    if (examplesContainer && typeof createButton === 'function') { // Vérifie aussi createButton
        // Carte simple avec titre et contenu
        const simpleCard = createCard({
            title: 'Titre de la Carte',
            contentHtml: '<p>Un contenu simple pour cette carte.</p>',
            actions: [{ text: 'Action', classes: ['btn-sm', 'btn-outline-primary'], onClick: () => alert('Carte action cliquée!') }]
        });
        examplesContainer.appendChild(simpleCard);

        // Carte avec image, titre, contenu et pied de page
        const fullCard = createCard({
            imageUrl: 'https://via.placeholder.com/300x200.png?text=Image',
            imageAlt: 'Placeholder Image',
            title: 'Carte Complète',
            titleTag: 'h4',
            contentHtml: '<strong>Contenu important</strong> et <a href="#">un lien interne</a>.',
            footerHtml: '<small class="text-muted">Dernière mise à jour il y a 3 mins</small>',
            classes: ['mb-3', 'shadow-sm'], // Ajout de classes pour marge et ombre
            actions: [
                { text: 'Lire Plus', href: '#', classes: ['btn-primary'] },
                { text: 'Partager', classes:['btn-secondary', 'btn-sm', 'ms-2'], onClick: () => console.log("Partagé!") }
            ]
        });
        examplesContainer.appendChild(fullCard);

        // Carte sans image, juste du contenu
        const noImageCard = createCard({
            title: 'Autre Titre',
            contentHtml: 'Cette carte n\'a pas d\'image, mais elle a plusieurs actions.',
            actions: [
                { text: 'Détails', href: '#details', classes: ['btn-info', 'text-white'] },
                { text: 'Un autre lien', href: '#other', classes: ['card-link'] }
            ]
        });
        examplesContainer.appendChild(noImageCard);
    } else if (examplesContainer) {
        examplesContainer.textContent = "Erreur: createButton n'est pas défini, les exemples de cartes ne peuvent pas être affichés correctement.";
    }
});
*/

// Rendre la fonction accessible globalement ou l'exporter si vous utilisez des modules ES6
// window.createCard = createCard; // Pour une portée globale simple
// export { createCard }; // Pour les modules ES6 (nécessiterait <script type="module">)