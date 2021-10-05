const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
        select * from movie;
    `;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const movieQuery = `
        insert into movie (directorId,
        movieName,leadActor) values(${directorId},'${movieName}',
        '${leadActor}');
    `;
  const movie = await db.run(movieQuery);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
            select * from movie where movie_id=${movieId};
        `;
  const movieDetails = await db.all(getMovieQuery);
  response.send(movieDetails);
});

app.post("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const movieQuery = `
        update movie set (director_id=${directorId},movie_name='${movieName}',
        lead_actor='${leadActor} where movie_id=${movieId}');
    `;
  const movie = await db.run(movieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
            delete from movie where movie_id=${movieId};
        `;
  const movieDetails = await db.all(deleteMovieQuery);
  response.send(movieRemoved);
});

app.get("/directors/", async (request, response) => {
  const getMoviesQuery = `
        select * from director;
    `;
  const directorsArray = await db.all(getMoviesQuery);
  response.send(directorsArray);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMovieQuery = `
            select * from director where director_id=${directorId};
        `;
  const movieDetails = await db.all(getMovieQuery);
  response.send(movieDetails);
});

module.exports = app;
