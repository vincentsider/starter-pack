// public/js/pages/contact.js

const ContactPage = (() => {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitContactForm');
    const spinner = submitButton ? submitButton.querySelector('.spinner-border') : null;

    const init = () => {
        if (!contactForm || !submitButton || !spinner) {
            console.error('Formulaire de contact ou ses éléments non trouvés.');
            return;
        }
        addEventListeners();
    };

    const addEventListeners = () => {
        contactForm.addEventListener('submit', handleFormSubmit);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!validateForm()) {
            contactForm.classList.add('was-validated');
            showNotification(window.i18n.t('contact.form.validationError'), 'error');
            return;
        }

        // Afficher le spinner et désactiver le bouton
        setLoadingState(true);

        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Simuler l'envoi du formulaire
        try {
            // Remplacer par un appel API réel si nécessaire
            // Exemple: const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} });
            // if (!response.ok) throw new Error('Network response was not ok.');
            // const result = await response.json();

            // Simulation d'une réponse réussie après 2 secondes
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Afficher une notification de succès
            showNotification(window.i18n.t('contact.form.successMessage'), 'success');
            contactForm.reset();
            contactForm.classList.remove('was-validated'); // Réinitialiser l'état de validation
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            showNotification(window.i18n.t('contact.form.errorMessage'), 'error');
        } finally {
            // Cacher le spinner et réactiver le bouton
            setLoadingState(false);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                } else {
                    input.classList.add('is-valid');
                    input.classList.remove('is-invalid');
                }
            } else if (input.type === 'email') {
                if (!input.value.trim() || !isValidEmail(input.value.trim())) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                } else {
                    input.classList.add('is-valid');
                    input.classList.remove('is-invalid');
                }
            } else {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                } else {
                    input.classList.add('is-valid');
                    input.classList.remove('is-invalid');
                }
            }
        });
        return isValid;
    };

    const isValidEmail = (email) => {
        // Expression régulière simple pour la validation d'e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const setLoadingState = (isLoading) => {
        if (isLoading) {
            submitButton.disabled = true;
            spinner.classList.remove('d-none');
        } else {
            submitButton.disabled = false;
            spinner.classList.add('d-none');
        }
    };

    const showNotification = (message, type = 'info') => {
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.show(message, type);
        } else {
            // Fallback si NotificationManager n'est pas disponible
            alert(`${type.toUpperCase()}: ${message}`);
        }
    };

    return {
        init
    };
})();

// S'assurer que l'initialisation se fait après le chargement du DOM et de i18n
// L'appel à ContactPage.init() est fait dans contact.html après le chargement des scripts,
// y compris i18n.js qui rend window.i18n disponible.