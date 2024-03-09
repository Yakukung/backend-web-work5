// ../api/stars.ts
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import bodyParser from 'body-parser';

export const router = express.Router();

router.use(bodyParser.json());


router.post('/sertStar', async (req, res) => {
    try {
        const receivedData = req.body;
        const stars = receivedData;

        const sql = "INSERT INTO `stars` (`movie_id`, `person_id`) VALUES (?,?)";
        const result = await queryAsync(sql, [
            stars.movie_id,
            stars.person_id
        ]);

        console.log('Inserted person data:', {
            movie_id: stars.movie_id,
            person_id: stars.person_id

        });

        res.status(200).json({ message: 'Data received successfully' });
    } catch (error:any) {
        console.error('Error processing the request:', error);

        res.status(500).json({ error:  'Internal server error', details: error.message });
    }
});


router.delete('/:star_id', async (req, res) => {
    try {
      const starId = req.params.star_id;
  
      const sql = "DELETE FROM `stars` WHERE `star_id` = ?";
      const result = await queryAsync(sql, [ starId ]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Star deleted successfully' });
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    } catch (error:any) {
      console.error('Error processing the request:', error);
  
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });