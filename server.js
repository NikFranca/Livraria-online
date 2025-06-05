const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Permitir acesso do frontend (localhost:5500, onde você roda HTML/CSS/JS)
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Amandinha132004", // sua senha está correta aqui
    database: "livraria"
});

// Testar a conexão com o banco
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
        return;
    }
    console.log("Conectado ao banco de dados!");
});

// Rota para cadastrar livro
app.post("/cadastrar", (req, res) => {
    const { titulo, autor, genero } = req.body;
    if (!titulo || !autor || !genero) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const sql = "INSERT INTO livros (titulo, autor, genero) VALUES (?, ?, ?)";
    db.query(sql, [titulo, autor, genero], (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar livro:", err);
            return res.status(500).json({ message: "Erro ao cadastrar livro." });
        }
        res.status(200).json({ message: "Livro cadastrado com sucesso!" });
    });
});

// Rota para listar livros no select
app.get("/livros", (req, res) => {
    const sql = "SELECT id, titulo FROM livros";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar livros:", err);
            return res.status(500).json({ error: "Erro ao buscar livros" });
        }
        res.json(results);
    });
});

// Rota para registrar empréstimo
app.post("/emprestar", (req, res) => {
    const { livro_id, usuario } = req.body;
    const data_emprestimo = new Date();

    const sql = "INSERT INTO emprestimos (livro_id, usuario, data_emprestimo) VALUES (?, ?, ?)";
    db.query(sql, [livro_id, usuario, data_emprestimo], (err, result) => {
        if (err) {
            console.error("Erro ao registrar empréstimo:", err);
            return res.status(500).json({ error: "Erro ao registrar empréstimo" });
        }
        res.json({ message: "Empréstimo registrado com sucesso!" });
    });
});

// Rota para histórico de empréstimos
app.get("/historico", (req, res) => {
    const sql = `
        SELECT emprestimos.id, livros.titulo, emprestimos.usuario, emprestimos.data_emprestimo
        FROM emprestimos
        JOIN livros ON emprestimos.livro_id = livros.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar histórico:", err);
            return res.status(500).json({ error: "Erro ao buscar histórico" });
        }
        res.json(results);
    });
});

// Rota para devolver livro
app.post("/devolver", (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "ID do empréstimo é obrigatório." });
    }

    const sql = "DELETE FROM emprestimos WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao devolver livro:", err);
            return res.status(500).json({ message: "Erro ao devolver o livro." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empréstimo não encontrado." });
        }

        res.json({ message: "Livro devolvido com sucesso!" });
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
