const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

//permitir acesso do front (127.0.0.1:5500)
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Franca2004",
    database: "livraria"
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
        return;
    }
    console.log("Conectado ao banco de dados!");
});

//cadastrar
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

//Inicia o servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

//aceitar todas as origens durante desenvolvimento
app.use(cors({
    origin: "http://127.0.0.1:5500"
}));



//listar todos os livros para o select
app.get("/livros", (req, res) => {
    const sql = "SELECT id, titulo FROM livros";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar livros:", err);
            res.status(500).json({ error: "Erro ao buscar livros" });
            return;
        }
        console.log(results);
        res.json(results);
    });
});


//registrar empréstimo
app.post("/emprestar", (req, res) => {
    const { livro_id, usuario } = req.body;
    const data_emprestimo = new Date();

    const sql = "INSERT INTO emprestimos (livro_id, usuario, data_emprestimo) VALUES (?, ?, ?)";
    db.query(sql, [livro_id, usuario, data_emprestimo], (err, result) => {
        if (err) {
            console.error("Erro ao registrar empréstimo:", err);
            res.status(500).json({ error: "Erro ao registrar empréstimo" });
            return;
        }
        res.json({ message: "Empréstimo registrado com sucesso!" });
    });
});


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



//Rota para devolver um livro
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
            console.log("Empréstimo não encontrado no banco de dados.");
            return res.status(404).json({ message: "Empréstimo não encontrado." });
        }

        console.log("Livro devolvido com sucesso!");
        res.json({ message: "Livro devolvido com sucesso!", deletedEmpréstimo: result });
    });
});
