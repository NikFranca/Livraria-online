fetch("http://localhost:3000/historico")
    .then(res => res.json())
    .then(data => {
        console.log("Dados do histórico:", data);  
        const container = document.getElementById("historico");
        container.innerHTML = "<h2>Histórico de Empréstimos</h2>";

        data.forEach(item => {
            console.log("ID do empréstimo:", item.id);//Verifique se o id está sendo capturado

            const div = document.createElement("div");
            div.classList.add("registro");

            div.innerHTML = `
                <strong>Usuário:</strong> ${item.usuario} <br>
                <strong>Livro:</strong> ${item.titulo} <br>
                <strong>Data:</strong> ${new Date(item.data_emprestimo).toLocaleDateString("pt-BR")}
                ${new Date(item.data_emprestimo).toLocaleTimeString("pt-BR")} <br>
                <button class="btn-devolver" data-id="${item.id}" data-titulo="${item.titulo}">Devolver</button>
                <hr>
            `;

            container.appendChild(div);
        });

        //Adiciona eventos aos botões de devolução
        document.querySelectorAll(".btn-devolver").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                const tituloLivro = button.getAttribute("data-titulo"); // pega o título do livro
                console.log("ID do empréstimo a ser devolvido:", id);//Verifique se o id está sendo capturado
                if (!id) {
                    alert("ID inválido para devolução!");
                    return;
                }

                fetch("http://localhost:3000/devolver", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: Number(id) })
                })
                .then(res => res.json())
                .then(data => {
                    console.log("Resposta do servidor:", data);
                    if (data.message === "Livro devolvido com sucesso!") {
                        button.disabled = true;
                        button.textContent = "Devolvido";

                        // Agora abre o formulário de avaliação com id e título
                        abrirFormularioAvaliacao(id, tituloLivro);
                    }
                    showToast(data.message);// Exibe a mensagem de sucesso
                })
                .catch(err => {
                    console.error("Erro ao devolver:", err);
                    showToast("Erro ao comunicar com o servidor.");
                });
            });
        });
    })
    .catch(err => {
        console.error("Erro ao carregar histórico:", err);
    });

// Função para abrir formulário de avaliação
function abrirFormularioAvaliacao(emprestimoId, tituloLivro) {
    const nota = prompt(`Avalie o livro "${tituloLivro}" de 1 a 5:`);
    const comentario = prompt("Deixe um comentário (opcional):");

    if (nota && !isNaN(nota) && nota >= 1 && nota <= 5) {
        fetch("http://localhost:3000/avaliar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                emprestimo_id: emprestimoId,
                nota: Number(nota),
                comentario: comentario || ""
            })
        })
        .then(res => res.json())
        .then(data => {
            alert("Avaliação enviada com sucesso!");
        })
        .catch(err => {
            alert("Erro ao enviar avaliação.");
            console.error(err);
        });
    } else {
        alert("Avaliação inválida. Por favor, insira um número entre 1 e 5.");
    }
}
