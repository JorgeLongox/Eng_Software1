// Selecionando elementos do DOM
let nome = document.getElementById("nome");
let email = document.getElementById("email");
let password = document.getElementById("senha");
let dataNasc = document.getElementById("data-nasc");
let genero = document.getElementById("genero");
let tipoConta = document.getElementById("tipo-conta");
let form = document.getElementById("cadastroForm");
let message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Verifica se todos os campos foram preenchidos
    if (
        nome.value === "" || 
        email.value === "" || 
        password.value === "" || 
        dataNasc.value === "" || 
        genero.value === "" || 
        tipoConta.value === ""
    ) {
        message.textContent = "Você precisa preencher todos os campos!";
        message.style.color = "red";
    } else if (validarEmail(email.value) && validarPassword(password.value)) {
        message.textContent = "";
        
        // Criar o objeto do usuário
        const usuario = {
            nome: nome.value,
            email: email.value,
            senha: password.value,
            data_nascimento: dataNasc.value,
            genero: genero.value,
            tipo_conta: tipoConta.value
        };

        // Enviar os dados para o servidor
        try {
            const response = await fetch("http://localhost:9000/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                throw new Error("Erro na requisição");
            }

            // Redirecionar para a tela de login
            window.location.href = "/views/login.html";
        } catch (error) {
            console.error('Erro:', error);
            message.textContent = "Erro ao cadastrar usuário!";
            message.style.color = "red";
        }
    } else {
        message.textContent = "Verifique os campos e tente novamente!";
        message.style.color = "red";
    }
});

// Validações

email.addEventListener("keyup", () => {
    const emailError = document.querySelector("#email-error"); // Aqui você usa o id no HTML
    if (!validarEmail(email.value)) {
        emailError.textContent = "*O formato do email deve ser, ex: name@abc.com";
        emailError.style.display = "block"; // Torna a mensagem visível
    } else {
        emailError.style.display = "none"; // Esconde a mensagem de erro
    }
});


password.addEventListener("keyup", () => {
    const passwordError = document.querySelector("#password-error"); // Aqui você usa o id no HTML
    if (!validarPassword(password.value)) {
        passwordError.textContent = "*Senha deve conter entre 6 e 16 caracteres, incluindo pelo menos 1 letra e 1 número.";
        passwordError.style.display = "block"; // Torna a mensagem visível
    } else {
        passwordError.style.display = "none"; // Esconde a mensagem de erro
    }
});

function validarEmail(email) {
    let emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailPattern.test(email);
}

function validarPassword(password) {
    let passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}$/;
    return passwordPattern.test(password);
}

// Função para obter parâmetros da URL
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let m;
    while (m = regex.exec(queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return params;
}

// Preencher os campos se os parâmetros estiverem presentes
document.addEventListener("DOMContentLoaded", () => {
    const params = getQueryParams();
    if (params.email) {
        email.value = params.email;  // Preencher o campo de e-mail
    }
    if (params.nome) {
        nome.value = params.nome;  // Preencher o campo de nome
    }
});
