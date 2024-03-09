// ../api/creators.ts
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import bodyParser from 'body-parser';

export const router = express.Router();

router.use(bodyParser.json());


router.post('/sertCreator', async (req, res) => {
    try {
        const receivedData = req.body;
        const creators = receivedData;

        const sql = "INSERT INTO `creators` (`movie_id`, `person_id`) VALUES (?,?)";
        const result = await queryAsync(sql, [
            creators.movie_id,
            creators.person_id
        ]);

        console.log('Inserted person data:', {
            movie_id: creators.movie_id,
            person_id: creators.person_id

        });

        res.status(200).json({ message: 'Data received successfully' });
    } catch (error:any) {
        console.error('Error processing the request:', error);

        res.status(500).json({ error:  'Internal server error', details: error.message });
    }
});



router.delete('/:creator_id', async (req, res) => {
    try {
      const creatorId = req.params.creator_id;
  
      const sql = "DELETE FROM `creators` WHERE `creator_id` = ?";
      const result = await queryAsync(sql, [creatorId]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Creators deleted successfully' });
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    } catch (error:any) {
      console.error('Error processing the request:', error);
  
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
  
  
