const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
  * Tipos de parâmetros:
  * 
  * Query Params: Filtros e paginação
  * Route Params: Identificar recursos (Atualizar/Deletar)
  * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
  */

/**
 * Middleware:
 * 
 * Interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição.
 */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method} ${url}]`;

  console.time(logLabel);
  next(); // Próximo middleware
  console.timeEnd(logLabel);

}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.'});
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const result = title ?
    projects.filter(project => project.title.includes(title)) :
    projects;

  return response.json(result);
});

app.get('/projects/:id', (request, response) => {
  const { id } = request.params;

  const project = projects.find(project => project.id === id);

  if (!project) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  return response.json(project);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;
  
  const project = { id: uuid(), title, owner };
  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const index = projects.findIndex(project => project.id === id);
  
  if (index < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const project = { id, title, owner };
  projects[index] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const index = projects.findIndex(project => project.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  projects.splice(index, 1);
  
  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('🚀 Back-end started');
});