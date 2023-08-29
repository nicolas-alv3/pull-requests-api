const express = require('express');
const bodyParser = require('body-parser');

const index = express();
const port = process.env.PORT || 3000;

// Datos de ejemplo en memoria (reemplazar con una base de datos en producción)
const pullRequests = [];

let nextId = 1;

index.use(bodyParser.json());

// Crear un nuevo Pull Request
index.post('/pull-requests', (req, res) => {
    const { author, description, link, project } = req.body;
    const creationDate = new Date().toISOString();
    const newPullRequest = { id: nextId++, author, description, creationDate, link, project };
    pullRequests.push(newPullRequest);
    res.json(newPullRequest);
});

// Obtener todos los Pull Requests
index.get('/pull-requests', (req, res) => {
    res.json(pullRequests);
});

// Obtener un Pull Request por ID
index.get('/pull-requests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pullRequest = pullRequests.find(pr => pr.id === id);
    if (!pullRequest) {
        return res.status(404).json({ message: 'Pull Request not found' });
    }
    res.json(pullRequest);
});

// Actualizar un Pull Request por ID
index.put('/pull-requests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const index = pullRequests.findIndex(pr => pr.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Pull Request not found' });
    }
    pullRequests[index] = { ...pullRequests[index], ...updatedData };
    res.json(pullRequests[index]);
});

// Eliminar un Pull Request por ID
index.delete('/pull-requests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pullRequests.findIndex(pr => pr.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Pull Request not found' });
    }
    const deletedPullRequest = pullRequests.splice(index, 1);
    res.json(deletedPullRequest[0]);
});

// Eliminar todos los Pull Request
index.delete('/pull-requests', (req, res) => {
    pullRequests.length = 0;
    res.json({ message: 'All Pull Requests have been deleted' });
});

index.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
