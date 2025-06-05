fetch("http://localhost:3000/avaliacoes")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("avaliacoesContainer");

    if (data.length === 0) {
      container.innerHTML = "<p>Nenhuma avaliação encontrada.</p>";
      return;
    }

    data.forEach(avaliacao => {
      const div = document.createElement("div");
      div.classList.add("avaliacao");

      const estrelas = "★".repeat(avaliacao.nota) + "☆".repeat(5 - avaliacao.nota);

      div.innerHTML = `
        <p><strong>Livro:</strong> ${avaliacao.titulo}</p>
        <p><strong>Usuário:</strong> ${avaliacao.usuario}</p>
        <p><strong>Nota:</strong> <span style="color: gold;">${estrelas}</span> (${avaliacao.nota})</p>
        <p><strong>Comentário:</strong> ${avaliacao.comentario || "Nenhum comentário."}</p>
        <p><em>${new Date(avaliacao.data_avaliacao).toLocaleString("pt-BR")}</em></p>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Erro ao buscar avaliações:", err);
  });
