let email = document.getElementById("email");
let password = document.getElementById("senha");
let form = document.querySelector("form");
let textForm = document.getElementById("textForm");
let textEmail = document.getElementById("textEmail");
let textPassword = document.getElementById("textSenha");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (email.value == "" || password.value == "") {
    textForm.textContent = "Você precisa preencher todos os campos!";
  } else if (
    validatorEmail(email.value) === true &&
    validatorPassword(password.value) === true
  ) {
    console.log(email.value);
    console.log(password.value);
    textForm.textContent = "";
    textEmail.textContent = "";
    textPassword.textContent = "";

    const usuario = {
      email: email.value,
      senha: password.value,
    };

    // Enviar os dados ao servidor
    fetch("http://localhost:9000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          textForm.textContent = data.error;
        } else {
          textForm.textContent = data.message;
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        textForm.textContent = "Ocorreu um erro ao fazer login.";
      });
  } else {
    console.log("Requisição não atendida");
  }
});


      

email.addEventListener("keyup", () => {
  if (validatorEmail(email.value) !== true) {
    textEmail.textContent = "*O formato do email deve ser, ex: name@abc.com";
  } else {
    textEmail.textContent = "";
  }
});

password.addEventListener("keyup", () => {
  if (validatorPassword(password.value) !== true) {
    textPassword.textContent =
      "*Senha deve conter: Minino 6 caracteres, 1 letra maiuscula ou minuscula, 1 numero.";
  } else {
    textPassword.textContent = "";
  }
});

function validatorEmail(email) {
  let emailPattern =
    /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  return emailPattern.test(email);
}

function validatorPassword(password) {
  let passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}$/;
  return passwordPattern.test(password);
}

      // Função de callback para lidar com a resposta do Google Sign-In
function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

        // Enviar o token JWT para o backend para autenticação
  fetch("http://localhost:9000/google-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: response.credential }),
  })
  .then((res) => res.json())
  .then((data) => {
  if (data.error) {
    textForm.textContent = data.error;
  } else {
    // Se o login for bem-sucedido, redirecionar para a home
    window.location.href = "../views/home.html";
  }
  })
  .catch((error) => {
    console.error("Erro durante a autenticação:", error);
    textForm.textContent = "Ocorreu um erro ao fazer login com Google.";
})
}
