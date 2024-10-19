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
    if (!validarEmail(email.value)) {
        message.textContent = "*O formato do email deve ser, ex: name@abc.com";
        message.style.color = "red";
    } else {
        message.textContent = "";
    }
});

password.addEventListener("keyup", () => {
    if (!validarPassword(password.value)) {
        message.textContent = "*Senha deve conter entre 6 e 16 caracteres, incluindo pelo menos 1 letra e 1 número.";
        message.style.color = "red";
    } else {
        message.textContent = "";
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
