document.addEventListener("DOMContentLoaded", async () => {
    const plantasContainer = document.getElementById("plantasContainer");
    const searchBar = document.getElementById("searchBar");
    const modal = document.getElementById("plantDetailsModal");
    const closeModal = document.querySelector(".close");
    const plantaNome = document.getElementById("plantaNome");
    const plantaImagem = document.getElementById("plantaImagem");
    const plantaDescricao = document.getElementById("plantaDescricao");
    const plantaLink = document.getElementById("plantaLink");
    const plantaEficacia = document.getElementById("plantaEficacia");
    const tipoPlantaSelect = document.getElementById("tipoPlanta");
    const eficaciaSelect = document.getElementById("eficacia");
    const filtrarButton = document.getElementById("filtrar");

    let plantas = []; // Armazenar todas as plantas aqui

    // Função para renderizar as plantas na página
    function renderPlantas(plantas) {
        plantasContainer.innerHTML = ""; // Limpa o container antes de renderizar
        plantas.forEach(planta => {
            const plantaBloco = document.createElement("div");
            plantaBloco.classList.add("planta-bloco");
            plantaBloco.innerHTML = `
                <img src="${planta.imagem}" alt="${planta.nome}">
                <h2>${planta.nome}</h2>
                <p>${planta.descricao}</p>
            `;

            plantaBloco.addEventListener("click", () => {
                plantaNome.innerText = planta.nome;
                plantaImagem.src = planta.imagem;
                plantaDescricao.innerText = planta.descricao;
                plantaEficacia.innerText = `Eficácia: ${planta.eficacia}`;
                plantaLink.href = planta.link_artigo;
                modal.style.display = "block";
            });

            plantasContainer.appendChild(plantaBloco);
        });
    }

    // Função para filtrar as plantas
    function filtrarPlantas() {
        const tipoPlanta = tipoPlantaSelect.value.toLowerCase();
        const eficacia = eficaciaSelect.value.toLowerCase();
        const searchTerm = searchBar.value.toLowerCase(); // Termo de pesquisa

        const plantasFiltradas = plantas.filter(planta => {
            const tipoMatch = tipoPlanta ? planta.tipo.toLowerCase() === tipoPlanta : true;
            const eficaciaMatch = eficacia ? planta.eficacia.toLowerCase().includes(eficacia) : true;
            const searchMatch = planta.nome.toLowerCase().includes(searchTerm); // Pesquisa pelo nome da planta

            return tipoMatch && eficaciaMatch && searchMatch; // Combine todos os filtros
        });
        console.log("Plantas filtradas:", plantasFiltradas);
        renderPlantas(plantasFiltradas);
    }

    // Adiciona evento ao botão de filtrar
    filtrarButton.addEventListener("click", filtrarPlantas);

    // Evento para pesquisar ao digitar
    searchBar.addEventListener("input", filtrarPlantas); // Filtra enquanto o usuário digita

    // Fetch das plantas do banco de dados
    async function fetchPlantas() {
        const response = await fetch('/api/plantas'); // Ajuste a rota para a sua API
        plantas = await response.json(); // Armazena as plantas para filtrar depois
        renderPlantas(plantas); // Renderiza todas as plantas inicialmente
    }

    fetchPlantas(); // Carrega as plantas ao iniciar a página

    // Fecha o modal quando o usuário clicar no botão de fechar
    closeModal.onclick = () => {
        modal.style.display = "none"; // Esconde o modal
    }

    // Fecha o modal quando o usuário clicar fora do conteúdo do modal
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none"; // Esconde o modal
        }
    }
});
