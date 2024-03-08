import express from "express";
import { conn, queryAsync } from "../dbconnect";
import bodyParser from 'body-parser';
import { movie } from "../model/movie";
export const router = express.Router();


//แสดงข้อมูล movie ทั้งหมด
router.post("/", (req, res) => {
  conn.query('select * from movies', (err, result, fields)=>{
    res.json(result);
    console.log(result);
  });
});


//คันหาทั้งชื่อ
router.post("/search", (req, res) => {
  const movieId = req.query.movie_id;
  const movieName = req.query.movie_name;

  let movieQuery;
  let personQuery;

  if (movieId) {
    movieQuery = `
      SELECT *
      FROM movies
      WHERE movies.movie_id = ?
    `;

    personQuery = `
      SELECT DISTINCT
        person.person_id,
        person.name,
        person.birthdate,
        person.preson_type
      FROM person
      LEFT JOIN creators ON person.person_id = creators.person_id
      LEFT JOIN stars ON person.person_id = stars.person_id
      INNER JOIN movies ON creators.movie_id = movies.movie_id OR stars.movie_id = movies.movie_id
      WHERE (creators.movie_id = ? OR stars.movie_id = ?) AND person.person_id
    `;
  } else if (movieName) {
    movieQuery = `
      SELECT *
      FROM movies
      WHERE movies.movie_name LIKE ?
    `;

    personQuery = `
      SELECT DISTINCT
        person.person_id,
        person.name,
        person.birthdate,
        person.preson_type
      FROM person
      LEFT JOIN creators ON person.person_id = creators.person_id
      LEFT JOIN stars ON person.person_id = stars.person_id
      INNER JOIN movies ON creators.movie_id = movies.movie_id OR stars.movie_id = movies.movie_id
      WHERE movies.movie_name LIKE ?
    `;
  } else {
    movieQuery = `
      SELECT *
      FROM movies
    `;

    personQuery = `
      SELECT DISTINCT
        person.person_id,
        person.name,
        person.birthdate,
        person.preson_type
      FROM person
      LEFT JOIN creators ON person.person_id = creators.person_id
      LEFT JOIN stars ON person.person_id = stars.person_id
      INNER JOIN movies ON creators.movie_id = movies.movie_id OR stars.movie_id = movies.movie_id
    `;
  }

  conn.query(movieQuery, [movieId || `%${movieName}%`], (errMovie, resultMovie, fieldsMovie) => {
    if (errMovie) throw errMovie;

    conn.query(personQuery, [movieId || `%${movieName}%`, movieId || `%${movieName}%`], (errPerson, resultPerson, fieldsPerson) => {
      if (errPerson) throw errPerson;

      const combinedResult = {
        movie: resultMovie,
        person: resultPerson 
      };

      res.json(combinedResult);
    });
  });
});


router.post("/movie-details", (req, res) => {
  
  const movieId = req.query.movie_id;
  console.log('Received movie_id:', movieId);
  const movieQuery = `
    SELECT *
    FROM movies
    WHERE movies.movie_id = ?
  `;

  const personQuery = `
    SELECT DISTINCT
      person.person_id,
      person.name,
      person.birthdate,
      person.preson_type
    FROM person
    LEFT JOIN creators ON person.person_id = creators.person_id
    LEFT JOIN stars ON person.person_id = stars.person_id
    INNER JOIN movies ON creators.movie_id = movies.movie_id OR stars.movie_id = movies.movie_id
    WHERE (creators.movie_id = ? OR stars.movie_id = ?) AND person.person_id
  `;

  conn.query(movieQuery, [movieId], (errMovie, resultMovie, fieldsMovie) => {
    if (errMovie) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (resultMovie.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    conn.query(personQuery, [movieId, movieId], (errPerson, resultPerson, fieldsPerson) => {
      if (errPerson) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const movieDetails = {
        movie: resultMovie,
        person: resultPerson,
      };
      console.log('Returning movie details:', movieDetails);
      return res.json(movieDetails);
    });
  });
});


router.post("/movie-list", (req, res) => {
  conn.query('select * from movies', (err, result, fields)=>{
    res.json(result);
    console.log(result);
  });
});


router.post("/movie-edit", (req, res) => {
  
  const movieId = req.query.movie_id;
  console.log('Received movie_id:', movieId);
  const movieQuery = `
    SELECT *
    FROM movies
    WHERE movies.movie_id = ?
  `;

  const personQuery = `
    SELECT DISTINCT
      person.person_id,
      person.name,
      person.birthdate,
      person.preson_type
    FROM person
    LEFT JOIN creators ON person.person_id = creators.person_id
    LEFT JOIN stars ON person.person_id = stars.person_id
    INNER JOIN movies ON creators.movie_id = movies.movie_id OR stars.movie_id = movies.movie_id
    WHERE (creators.movie_id = ? OR stars.movie_id = ?) AND person.person_id
  `;

  conn.query(movieQuery, [movieId], (errMovie, resultMovie, fieldsMovie) => {
    if (errMovie) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (resultMovie.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    conn.query(personQuery, [movieId, movieId], (errPerson, resultPerson, fieldsPerson) => {
      if (errPerson) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const movieDetails = {
        movie: resultMovie,
        person: resultPerson,
      };
      console.log('Returning movie details:', movieDetails);
      return res.json(movieDetails);
    });
  });
});
