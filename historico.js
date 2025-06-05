// Carrega o histórico de empréstimos
fetch("http://localhost:3000/historico")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("historico");
        container.innerHTML = "<h2>Histórico de Empréstimos</h2>";

        data.forEach(item => {
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

        document.querySelectorAll(".btn-devolver").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                const tituloLivro = button.getAttribute("data-titulo");

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
                        if (data.message === "Livro devolvido com sucesso!") {
                            button.disabled = true;
                            button.textContent = "Devolvido";
                            abrirFormularioAvaliacao(id, tituloLivro);
                        }
                        showToast(data.message);
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

// Mostra um toast simples
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.visibility = "visible";
    setTimeout(() => {
        toast.style.visibility = "hidden";
    }, 3000);
}

// Cria e exibe o modal de avaliação
function abrirFormularioAvaliacao(id, tituloLivro) {
    const modal = document.createElement("div");
    modal.id = "avaliacaoModal";
    modal.style = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(0,0,0,0.5);
        display: flex; align-items: center; justify-content: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; width: 90%;">
            <h3>Avaliação do livro: "${tituloLivro}"</h3>
            <div class="estrelas" style="font-size: 24px; margin: 10px 0;">
                <span class="estrela" data-value="1">☆</span>
                <span class="estrela" data-value="2">☆</span>
                <span class="estrela" data-value="3">☆</span>
                <span class="estrela" data-value="4">☆</span>
                <span class="estrela" data-value="5">☆</span>
            </div>
            <input type="hidden" id="notaSelecionada" value="0">
            <textarea id="comentarioAvaliacao" rows="7" style="width: 100%; height: 120px;" placeholder="Deixe seu comentário..."></textarea>
            <br><br>
            <button onclick="enviarAvaliacao(${id})">Enviar Avaliação</button>
            <button onclick="fecharModalAvaliacao()" style="margin-left: 10px;">Cancelar</button>
        </div>
    `;

    document.body.appendChild(modal);
    adicionarEventosEstrelas();
}

// Remove o modal da tela
function fecharModalAvaliacao() {
    const modal = document.getElementById("avaliacaoModal");
    if (modal) {
        modal.remove();
    }
}

// Adiciona eventos às estrelas
function adicionarEventosEstrelas() {
    const estrelas = document.querySelectorAll("#avaliacaoModal .estrela");
    const inputNota = document.getElementById("notaSelecionada");

    estrelas.forEach(estrela => {
        estrela.addEventListener("click", () => {
            const valor = parseInt(estrela.getAttribute("data-value"));
            inputNota.value = valor;

            estrelas.forEach(e => {
                const v = parseInt(e.getAttribute("data-value"));
                e.textContent = v <= valor ? "★" : "☆";
            });
            fecharModal();
        });
    });
}
function fecharModal() {
    const modal = document.getElementById("avaliacaoModal");
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
}

// Envia a avaliação
function enviarAvaliacao(emprestimoId) {
    const nota = parseInt(document.getElementById("notaSelecionada").value);
    const comentario = document.getElementById("comentarioAvaliacao").value;

    if (!nota || nota < 1 || nota > 5) {
        alert("Por favor, selecione uma nota de 1 a 5.");
        return;
    }

    fetch("http://localhost:3000/avaliar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emprestimo_id: emprestimoId,
            nota: nota,
            comentario: comentario
        })
    })
        .then(res => res.json())
        .then(data => {
            showToast("Avaliação enviada com sucesso!");
            
            fecharModal();
        })
        
        .catch(err => {
            console.error("Erro ao enviar avaliação:", err);
            showToast("Erro ao enviar avaliação.");
        });
}
