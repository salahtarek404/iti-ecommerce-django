const contactForm = document.getElementById('contact-form');
const messageBox = document.getElementById('message');
const messageCount = document.getElementById('message-count');

if (messageBox && messageCount) {
    messageBox.maxLength = 300;
    messageBox.addEventListener('input', () => {
        messageCount.textContent = messageBox.value.length;
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        if (messageCount) messageCount.textContent = '0';
    });
}
