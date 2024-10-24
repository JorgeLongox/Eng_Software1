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

    textEmail.textContent = "";
    textPassword.textContent = "";

    const usuario = {
      email: email.value,
      senha: password.value,
    };
    fetch("http://localhost:9000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();  // Se a resposta for bem-sucedida e for JSON, parseia
      } else {
        // Tente capturar um erro de resposta JSON, caso contrário, exiba a resposta de erro em HTML
        return response.json().then((data) => {
          throw new Error(data.error);
        }).catch(() => {
          throw new Error("Erro inesperado no servidor. Verifique os detalhes do login.");
        });
      }
    })
    .then((data) => {
      // Se o login for bem-sucedido, redirecione
      if (data.success) {
        window.location.href = "../views/home.html";
      } else {
        textForm.textContent = data.message || "Erro no login.";
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      textForm.textContent = error.message || "Ocorreu um erro ao fazer login.";
    });
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

function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  fetch("http://localhost:9000/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: response.credential }),
  })
  .then((res) => res.json())
  .then((data) => {
      if (data.error) {
          textForm.textContent = data.error;
      } else if (data.success) {
          // Se o login for bem-sucedido, redirecionar para a home
          window.location.href = "../views/home.html";
      } else {
          // Se o usuário não existir, redirecionar para a página de cadastro com dados pré-preenchidos
          window.location.href = `../views/cadastro.html?email=${encodeURIComponent(data.email)}&nome=${encodeURIComponent(data.name)}`;
      }
  })
  .catch((error) => {
      console.error("Erro durante a autenticação:", error);
      textForm.textContent = "Ocorreu um erro ao fazer login com Google.";
  });
}

