document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Aqui você pode adicionar lógica para enviar os dados para um servidor

    // Exibir uma mensagem de sucesso
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = `Cadastro realizado com sucesso para ${nome}!`;
    messageDiv.style.color = 'green';

    // Limpar o formulário
    document.getElementById('cadastroForm').reset();
});
