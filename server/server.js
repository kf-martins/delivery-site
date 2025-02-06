const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/api/products', (req, res) => {
    res.sendFile(path.join(__dirname, './products.json'));//Futuramente: fetch no banco de dados e retornar
});

app.post('/api/orders', (req, res) => {
    /***
     * TODO:    Fazer autentticação, verificação e validação dos dados recebidos.
     *          Fazer verificação da quantidade dos pedidos e valores. 
     */
    
    console.log(`Pedidos recebidos: `);
    console.log(req.body);
    res.status(200).send(200);
});

app.listen(PORT, () => {
    console.log(`Server rodando em: http://localhost:${PORT}/`);
    
})