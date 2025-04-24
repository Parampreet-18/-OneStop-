// const container = document.getElementById('container');
// const registerBtn = document.getElementById('register');
// const loginBtn = document.getElementById('login');

// registerBtn.addEventListener('click', () => {
//     container.classList.add("active");
// });

// loginBtn.addEventListener('click', () => {
//     container.classList.remove("active");
// });

// const signInBtn = document.getElementById('signIn');

// signInBtn.addEventListener('click', () => {
//     window.location.href = 'index.html';
// });


const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signInBtn = document.getElementById('signIn');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

signInBtn.addEventListener('click', (e) => {
    e.preventDefault(); // 👈 This stops the form from submitting
    window.location.href = 'index.html'; // 👈 Redirects to index.html
});
