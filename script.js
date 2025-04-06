document.getElementById("cadastroForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const genero = document.getElementById("genero").value;

    console.log("Enviando:", { titulo, autor, genero });

    fetch("http://127.0.0.1:3000/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, autor, genero })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro na resposta do servidor");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("msg").innerText = data.message;
        document.getElementById("cadastroForm").reset();
    })
    .catch(error => {
        console.error("Erro ao cadastrar:", error);
        document.getElementById("msg").innerText = "Erro ao cadastrar livro.";
    });

    console.log("Formulário enviado com sucesso");
});
