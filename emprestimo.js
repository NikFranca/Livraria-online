// Preencher a lista de livros
fetch("http://localhost:3000/livros")
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("livro");
        data.forEach(livro => {
            const option = document.createElement("option");
            option.value = livro.id;
            option.textContent = livro.titulo;
            select.appendChild(option);
        });
    })
    .catch(err => console.error("Erro ao carregar livros:", err));

// Enviar dados do formulário
document.getElementById("emprestimoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const livro_id = document.getElementById("livro").value;
    const usuario = document.getElementById("usuario").value;

    fetch("http://localhost:3000/emprestar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ livro_id, usuario })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("msg").innerText = data.message;
        document.getElementById("emprestimoForm").reset();
    })
    .catch(err => {
        console.error("Erro ao registrar empréstimo:", err);
        document.getElementById("msg").innerText = "Erro ao registrar empréstimo.";
    });
});
