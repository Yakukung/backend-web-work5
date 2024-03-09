import express from "express";
import { conn, queryAsync } from "../dbconnect";
import bodyParser from 'body-parser';
import { movie } from "../model/movie";
import axios from "axios";
export const router = express.Router();


router.post("/", (req, res) => {
  conn.query('select * from movies', (err, result, fields)=>{
    res.json(result);
    console.log(result);
  });
});


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


// router.post("/movie-list", (req, res) => {
//   conn.query('select * from movies', (err, result, fields)=>{
//     res.json(result);
//     console.log(result);
//   });
// });


// router.post("/movie-edit", (req, res) => {
  
//   const movieId = req.query.movie_id;
//   console.log('Received movie_id:', movieId);
//   const movieQuery = `
//     SELECT *
//     FROM movies
//     WHERE movies.movie_id = ?
//   `;

//   const personQuery = `
//     SELECT DISTINCT
//       person.person_id,
//       person.name,
//       person.birthdate,
//       person.preson_type
//     FROM person
//     LEFT JOIN creators ON person.person_id = creators.person_id
//     LEFT JOIN stars ON person.person_id = stars.person_id
//     INNER JOIN movies ON creators.movie_id = movies.movie_id OR stars.movie_id = movies.movie_id
//     WHERE (creators.movie_id = ? OR stars.movie_id = ?) AND person.person_id
//   `;

//   conn.query(movieQuery, [movieId], (errMovie, resultMovie, fieldsMovie) => {
//     if (errMovie) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     if (resultMovie.length === 0) {
//       return res.status(404).json({ error: "Movie not found" });
//     }

//     conn.query(personQuery, [movieId, movieId], (errPerson, resultPerson, fieldsPerson) => {
//       if (errPerson) {
//         return res.status(500).json({ error: "Internal Server Error" });
//       }

//       const movieDetails = {
//         movie: resultMovie,
//         person: resultPerson,
//       };
//       console.log('Returning movie details:', movieDetails);
//       return res.json(movieDetails);
//     });
//   });
// });


router.post('/sertMovie', async (req, res) => {
  try {
    const receivedData = req.body;
    const movie: movie = receivedData;

    const sql = "INSERT INTO `movies` (`movie_name`, `plot`, `poster`, `genre`) VALUES (?,?,?,?)";
    const result = await queryAsync(sql, [
      movie.movie_name,
      movie.plot,
      movie.poster,
      movie.genre,
    ]);
    console.log('Inserted movie data:', {
      movie_name: movie.movie_name,
      plot: movie.plot,
      poster: movie.poster,
      genre: movie.genre,
    });

    res.status(200).json({ message: 'Data received successfully' });
  } catch (error :any) {
    console.error('Error processing the request:', error);

    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.delete('/:movie_id', async (req, res) => {
  try {
    const movieId = req.params.movie_id;

    const sql = "DELETE FROM `movies` WHERE `movie_id` = ?";
    const result = await queryAsync(sql, [movieId]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Movie deleted successfully' });
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error:any) {
    console.error('Error processing the request:', error);

    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});