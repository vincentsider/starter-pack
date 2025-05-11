import i18n from '../i18n.js'; // Assurez-vous que le chemin est correct

/**
 * Formats a date object into "DD/MM/YYYY".
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Updates the "last updated" date in legal pages.
 * It finds elements with class 'last-updated' and data-i18n attribute
 * containing 'last_updated', then replaces a {date} placeholder in their
 * translated text content with the current formatted date.
 */
function updateLastUpdatedDate() {
    const today = new Date();
    const formattedDate = formatDate(today);

    // Select elements that contain the last updated date placeholder
    // These elements should have a 'data-i18n' attribute like '*.last_updated'
    // and a class 'last-updated' for easier selection if needed, although i18next handles the text.
    const lastUpdatedElements = document.querySelectorAll('.last-updated[data-i18n$="last_updated"]');

    lastUpdatedElements.forEach(element => {
        // Get the translation key from data-i18n attribute
        const i18nKey = element.getAttribute('data-i18n');
        if (i18nKey) {
            // Get the translated string which includes {date}
            let translatedText = i18n.t(i18nKey, { date: formattedDate });
            element.textContent = translatedText;
        }
    });
}

// Ensure i18next is initialized and translations are loaded before updating the date
// The 'initialized' event is emitted by i18next when it's ready
if (i18n.isInitialized) {
    updateLastUpdatedDate();
} else {
    i18n.on('initialized', (options) => {
        updateLastUpdatedDate();
    });
}

// Also, update if the language changes, as the text content will be re-translated
i18n.on('languageChanged', (lng) => {
    updateLastUpdatedDate();
});

export { updateLastUpdatedDate, formatDate };