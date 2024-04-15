function updateUIAfterLogin() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (window.getComputedStyle(loginForm).display === 'block') {
        loginForm.style.visibility = 'hidden';
    } else if (window.getComputedStyle(registerForm).display === 'block') {
        registerForm.style.visibility = 'hidden';
    }
}



function google_login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('uzytkownik zalogowany:', user);
            updateUIAfterLogin();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('blad podczas logowania:', errorCode, errorMessage);
        });
}




function register() {
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const registerForm = document.getElementById('register-form');

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Użytkownik zarejestrowany:', user);
            updateUIAfterLogin();
        })
        .catch((error) => {
            const errorMessage = handleRegisterError(error);
            console.error('Błąd podczas rejestracji:', errorMessage);
            showErrorMessage(registerForm, errorMessage);
        });
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginForm = document.getElementById('login-form');

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Zalogowano:', user);
            updateUIAfterLogin();
        })
        .catch((error) => {
            const errorMessage = handleLoginError(error);
            console.error('Błąd podczas logowania:', errorMessage);
            showErrorMessage(loginForm, errorMessage);
        });
}


function showErrorMessage(container, message) {
 
    container.querySelectorAll('.error-message').forEach(element => {
        element.remove();
    });

    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = message;
    errorMessageElement.classList.add('error-message'); 
    errorMessageElement.style.color = '#801818'
    errorMessageElement.style.marginBottom = '0';  
    container.appendChild(errorMessageElement);
}




function toggleForm() {
    var loginForm = document.getElementById('login-form');
    var registerForm = document.getElementById('register-form');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}


function handleLoginError(error) {
    const errorCode = error.code;
    let errorMessage = error.message;

    switch (errorCode) {
        case 'auth/invalid-email':
            errorMessage = 'Nieprawidłowy adres email.';
            break;
        case 'auth/user-not-found':
            errorMessage = 'Nie znaleziono użytkownika o podanym adresie email.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Nieprawidłowe hasło.';
            break;
        default:
            errorMessage = 'Wystąpił błąd podczas logowania.';
    }

    return errorMessage;
}

function handleRegisterError(error) {
    const errorCode = error.code;
    let errorMessage = error.message;

    switch (errorCode) {
        case 'auth/email-already-in-use':
            errorMessage = 'Adres email jest już używany przez inne konto.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Nieprawidłowy adres email.';
            break;
        case 'auth/weak-password':
            errorMessage = 'Hasło musi zawierać co najmniej 6 znaków.';
            break;
        default:
            errorMessage = 'Wystąpił błąd podczas rejestracji.';
    }

    return errorMessage;
}
