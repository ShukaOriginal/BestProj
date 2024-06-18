
document.addEventListener('DOMContentLoaded', () => {
    const messengerBtn = document.querySelector('.messenger-btn');
    const messengerLinks = document.getElementById('messenger-links');

    messengerBtn.addEventListener('click', () => {
        messengerLinks.classList.toggle('show');
    });
});
