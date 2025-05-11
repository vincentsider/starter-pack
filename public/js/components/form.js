// public/js/components/form.js

/**
 * Crée un élément de formulaire HTML basé sur les options fournies.
 *
 * @param {object} options - Options de configuration du formulaire.
 * @param {string} [options.id=''] - ID du formulaire.
 * @param {string[]} [options.customClasses=[]] - Classes CSS personnalisées pour le formulaire.
 * @param {string} [options.action=''] - URL d'action du formulaire.
 * @param {string} [options.method='POST'] - Méthode HTTP du formulaire.
 * @param {boolean} [options.novalidate=false] - Si true, désactive la validation native du navigateur.
 * @param {object[]} options.fields - Tableau des champs du formulaire.
 * @param {string} options.fields[].type - Type de champ (text, email, password, textarea, select, checkbox, radio, submit, button, hidden, file, etc.).
 * @param {string} options.fields[].name - Nom du champ.
 * @param {string} [options.fields[].id] - ID du champ.
 * @param {string} [options.fields[].label] - Label du champ.
 * @param {string} [options.fields[].placeholder] - Placeholder pour les champs texte.
 * @param {string} [options.fields[].value] - Valeur par défaut du champ.
 * @param {boolean} [options.fields[].required] - Si le champ est requis.
 * @param {string[]} [options.fields[].classes=[]] - Classes CSS pour l'élément input/select/textarea.
 * @param {string[]} [options.fields[].labelClasses=[]] - Classes CSS pour le label.
 * @param {string[]} [options.fields[].groupClasses=[]] - Classes CSS pour le div.form-group.
 * @param {object[]} [options.fields[].options] - Options pour les champs select, radio-group.
 * @param {string} options.fields[].options[].value - Valeur de l'option.
 * @param {string} options.fields[].options[].text - Texte de l'option.
 * @param {boolean} [options.fields[].options[].selected] - Si l'option est sélectionnée par défaut (pour select).
 * @param {boolean} [options.fields[].options[].checked] - Si l'option est cochée par défaut (pour radio).
 * @param {string} [options.fields[].validationMessage] - Message de validation personnalisé.
 * @param {object} [options.fields[].attributes] - Attributs HTML supplémentaires.
 * @returns {HTMLFormElement} L'élément de formulaire.
 */
function createForm({
    id = '',
    customClasses = [],
    action = '',
    method = 'POST',
    novalidate = false,
    fields = []
} = {}) {
    const formElement = document.createElement('form');
    if (id) formElement.id = id;
    formElement.classList.add(...customClasses);
    if (action) formElement.action = action;
    formElement.method = method;
    if (novalidate) formElement.noValidate = true;

    fields.forEach(fieldConfig => {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('form-group', ...(fieldConfig.groupClasses || []));

        let fieldElement;
        let labelElement;

        if (fieldConfig.label) {
            labelElement = document.createElement('label');
            labelElement.textContent = fieldConfig.label;
            if (fieldConfig.id || fieldConfig.name) {
                labelElement.htmlFor = fieldConfig.id || fieldConfig.name;
            }
            labelElement.classList.add('form-label', ...(fieldConfig.labelClasses || []));
            groupDiv.appendChild(labelElement);
        }

        switch (fieldConfig.type) {
            case 'textarea':
                fieldElement = document.createElement('textarea');
                if (fieldConfig.placeholder) fieldElement.placeholder = fieldConfig.placeholder;
                if (fieldConfig.value) fieldElement.value = fieldConfig.value;
                break;
            case 'select':
                fieldElement = document.createElement('select');
                if (fieldConfig.options && Array.isArray(fieldConfig.options)) {
                    fieldConfig.options.forEach(opt => {
                        const optionElement = document.createElement('option');
                        optionElement.value = opt.value;
                        optionElement.textContent = opt.text;
                        if (opt.selected) optionElement.selected = true;
                        fieldElement.appendChild(optionElement);
                    });
                }
                break;
            case 'checkbox':
            case 'radio':
                // Pour un checkbox/radio unique, le label est souvent après.
                // Si c'est un groupe, la logique serait plus complexe (non gérée ici pour un champ unique)
                groupDiv.classList.remove('form-group'); // Souvent, les checkbox/radio utilisent .form-check
                groupDiv.classList.add('form-check');

                fieldElement = document.createElement('input');
                fieldElement.type = fieldConfig.type;
                if (fieldConfig.value) fieldElement.value = fieldConfig.value;
                if (fieldConfig.checked) fieldElement.checked = true;

                // Le label pour checkbox/radio est structuré différemment
                // On retire le label global et on en crée un spécifique.
                if (labelElement) groupDiv.removeChild(labelElement);

                groupDiv.appendChild(fieldElement); // Input d'abord

                if (fieldConfig.label) {
                    labelElement = document.createElement('label');
                    labelElement.textContent = fieldConfig.label;
                    labelElement.htmlFor = fieldConfig.id || fieldConfig.name;
                    labelElement.classList.add('form-check-label', ...(fieldConfig.labelClasses || []));
                    groupDiv.appendChild(labelElement); // Puis label
                }
                break;
            case 'radio-group': // Type personnalisé pour un groupe de radios
                fieldConfig.options.forEach(opt => {
                    const radioGroupDiv = document.createElement('div');
                    radioGroupDiv.classList.add('form-check', ...(fieldConfig.itemClasses || []));

                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = fieldConfig.name;
                    radioInput.value = opt.value;
                    radioInput.id = opt.id || `${fieldConfig.name}-${opt.value}`;
                    if (opt.checked) radioInput.checked = true;
                    radioInput.classList.add('form-check-input', ...(fieldConfig.inputClasses || []));
                    if (fieldConfig.required) radioInput.required = true;


                    const radioLabel = document.createElement('label');
                    radioLabel.textContent = opt.text;
                    radioLabel.htmlFor = radioInput.id;
                    radioLabel.classList.add('form-check-label', ...(fieldConfig.labelClasses || []));

                    radioGroupDiv.appendChild(radioInput);
                    radioGroupDiv.appendChild(radioLabel);
                    groupDiv.appendChild(radioGroupDiv);
                });
                fieldElement = null; // Le fieldElement est le groupe lui-même, pas un input unique.
                break;
            case 'submit':
            case 'button':
            case 'reset':
                fieldElement = document.createElement('button');
                fieldElement.type = fieldConfig.type;
                fieldElement.textContent = fieldConfig.label || fieldConfig.value || 'Submit'; // Label devient le texte du bouton
                if (labelElement) groupDiv.removeChild(labelElement); // Les boutons n'ont pas de label <label> séparé
                break;
            default: // text, email, password, number, date, hidden, file, etc.
                fieldElement = document.createElement('input');
                fieldElement.type = fieldConfig.type;
                if (fieldConfig.placeholder) fieldElement.placeholder = fieldConfig.placeholder;
                if (fieldConfig.value) fieldElement.value = fieldConfig.value;
                break;
        }

        if (fieldElement) {
            fieldElement.name = fieldConfig.name;
            if (fieldConfig.id) fieldElement.id = fieldConfig.id;
            else if (fieldConfig.name) fieldElement.id = fieldConfig.name; // Fallback ID to name

            if (fieldConfig.required) fieldElement.required = true;

            const controlClasses = (fieldConfig.type === 'checkbox' || fieldConfig.type === 'radio') ? 'form-check-input' : 'form-control';
            fieldElement.classList.add(controlClasses, ...(fieldConfig.classes || []));


            if (fieldConfig.attributes) {
                for (const attr in fieldConfig.attributes) {
                    fieldElement.setAttribute(attr, fieldConfig.attributes[attr]);
                }
            }
            if (fieldConfig.type !== 'checkbox' && fieldConfig.type !== 'radio') {
                 groupDiv.appendChild(fieldElement);
            }
        }


        if (fieldConfig.validationMessage && fieldElement) { // Message pour ce champ spécifique
            const feedbackDiv = document.createElement('div');
            feedbackDiv.classList.add('invalid-feedback');
            feedbackDiv.textContent = fieldConfig.validationMessage;
            groupDiv.appendChild(feedbackDiv);
        }
        
        if(fieldConfig.type !== 'radio-group' || fieldElement) { // Ne pas ajouter groupDiv si c'est un groupe de radios et pas de fieldElement principal
             formElement.appendChild(groupDiv);
        } else if (fieldConfig.type === 'radio-group') {
            // Pour radio-group, le groupDiv contient déjà les form-check, on l'ajoute directement
            // et le label principal est ajouté avant la boucle des options.
            const mainLabel = document.createElement('p'); // ou div
            mainLabel.textContent = fieldConfig.label;
            mainLabel.classList.add('form-label', ...(fieldConfig.labelClasses || []));
            formElement.appendChild(mainLabel);
            formElement.appendChild(groupDiv); // groupDiv contient tous les radios
        }


    });

    return formElement;
}

/**
 * Initialise la validation Bootstrap standard pour un formulaire.
 * @param {HTMLFormElement | string} formElementOrSelector - L'élément de formulaire ou un sélecteur CSS.
 */
function initializeFormValidation(formElementOrSelector) {
    const form = typeof formElementOrSelector === 'string'
        ? document.querySelector(formElementOrSelector)
        : formElementOrSelector;

    if (!form) {
        console.error('Formulaire non trouvé pour initialisation de la validation.');
        return;
    }

    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        form.classList.add('was-validated');
    }, false);
}


// Exemple d'utilisation (peut être déplacé dans un script de page spécifique)
/*
document.addEventListener('DOMContentLoaded', () => {
    const contactFormFields = [
        { type: 'text', name: 'name', label: 'Nom complet', required: true, placeholder: 'Jean Dupont', validationMessage: 'Veuillez entrer votre nom.' },
        { type: 'email', name: 'email', label: 'Adresse e-mail', required: true, placeholder: 'email@example.com', validationMessage: 'Veuillez entrer une adresse e-mail valide.' },
        { type: 'textarea', name: 'message', label: 'Votre message', required: true, placeholder: 'Écrivez votre message ici...', validationMessage: 'Veuillez entrer un message.' },
        { type: 'submit', value: 'Envoyer', classes: ['btn', 'btn-primary'] }
    ];

    const myForm = createForm({
        id: 'contactForm',
        action: '/submit-contact',
        method: 'POST',
        novalidate: true, // Important pour la validation personnalisée
        fields: contactFormFields,
        customClasses: ['needs-validation']
    });

    const formContainer = document.getElementById('form-container'); // Supposons qu'un conteneur existe
    if (formContainer) {
        formContainer.appendChild(myForm);
        initializeFormValidation(myForm);
    }
});
*/

// Exporter les fonctions si on utilise des modules
// export { createForm, initializeFormValidation };