const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  
  repositories.push(newRepository);
  
  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({error: "id does not exist"})
  }
  
  repositories[repositorieIndex] = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  }

  return response.status(200).json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  

  if (repositorieIndex < 0 ) {
    return response.status(400).json({error: "id does not exist"})
  }

  repositories.splice(repositorieIndex, 1);
  
  return response.status(204).json({message:"Repositorie Deleted"});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({error: "id does not exist"})
  }
  
  repositories[repositorieIndex].likes = repositories[repositorieIndex].likes + 1;
  
  return response.status(200).json({likes: repositories[repositorieIndex].likes});
});

module.exports = app;
