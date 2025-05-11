// public/js/home.js
document.addEventListener('DOMContentLoaded', () => {
    // Charger le CTA Button pour la section Héros
    loadComponent(
        'hero-cta-placeholder',
        'components/cta-button.html',
        () => {
            const heroCta = document.querySelector('#hero-cta-placeholder button');
            if (heroCta) {
                heroCta.setAttribute('data-i18n', 'home.hero.cta');
                heroCta.textContent = i18n.t('home.hero.cta');
                heroCta.onclick = () => { window.location.href = 'tarifs.html'; };
            }
        },
        { textKey: 'home.hero.cta', href: 'tarifs.html', isPrimary: true }
    );

    // Charger le CTA Button pour "Découvrir toutes les fonctionnalités"
    loadComponent(
        'features-link-placeholder',
        'components/cta-button.html',
        () => {
            const featuresCta = document.querySelector('.features-link-placeholder button');
            if (featuresCta) {
                featuresCta.setAttribute('data-i18n', 'home.keyFeatures.seeAllFeatures');
                featuresCta.textContent = i18n.t('home.keyFeatures.seeAllFeatures');
                featuresCta.onclick = () => { window.location.href = 'fonctionnalites.html'; };
            }
        },
        { textKey: 'home.keyFeatures.seeAllFeatures', href: 'fonctionnalites.html' }
    );


    // Charger les témoignages
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
        const testimonialsData = [
            {
                id: 'testimonial-1',
                quoteKey: 'home.testimonials.user1.quote',
                authorKey: 'home.testimonials.user1.author',
                image: 'assets/images/avatar-1.png'
            },
            {
                id: 'testimonial-2',
                quoteKey: 'home.testimonials.user2.quote',
                authorKey: 'home.testimonials.user2.author',
                image: 'assets/images/avatar-2.png'
            },
            {
                id: 'testimonial-3',
                quoteKey: 'home.testimonials.user3.quote',
                authorKey: 'home.testimonials.user3.author',
                image: 'assets/images/avatar-3.png'
            }
        ];

        testimonialsData.forEach(testimonial => {
            const testimonialDiv = document.createElement('div');
            testimonialDiv.id = `testimonial-card-${testimonial.id}-placeholder`;
            testimonialsContainer.appendChild(testimonialDiv);
            loadComponent(
                testimonialDiv.id,
                'components/testimonial-card.html',
                null,
                testimonial
            );
        });
    }

    // Charger le CTA Button pour la section CTA Final
    loadComponent(
        'final-cta-button-placeholder',
        'components/cta-button.html',
        () => {
            const finalCta = document.querySelector('#final-cta-button-placeholder button');
            if (finalCta) {
                finalCta.setAttribute('data-i18n', 'home.finalCta.cta');
                finalCta.textContent = i18n.t('home.finalCta.cta');
                finalCta.onclick = () => { window.location.href = 'tarifs.html'; }; // Ou 'inscription.html' si disponible
            }
        },
        { textKey: 'home.finalCta.cta', href: 'tarifs.html', isPrimary: true }
    );
});