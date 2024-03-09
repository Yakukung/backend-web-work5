// ../api/persons.ts
import express from "express";
import { conn, queryAsync } from "../dbconnect";
import bodyParser from 'body-parser';
import { person } from "../model/person";

export const router = express.Router();

router.use(bodyParser.json());

router.post("/person-list", async (req, res) => {
  try {
    const result = await queryAsync('SELECT * FROM person');

    const formattedResult = result.map((person: { birthdate: any; }) => ({
      ...person,
      birthdate: formatDate(person.birthdate),
    }));

    res.json(formattedResult);
    console.log(formattedResult);
  } catch (error) {
    console.error('Error fetching person list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/sertPerson', async (req, res) => {
    try {
        const receivedData = req.body;
        const person = receivedData;

        const sql = "INSERT INTO `person` (`person_img`,`name`, `birthdate`, `preson_type`) VALUES (?,?,?,?)";
        const result = await queryAsync(sql, [
            person.person_img,
            person.name,
            person.birthdate,
            person.preson_type
        ]);

        console.log('Inserted person data:', {
            person_img: person.person_img,
            name: person.name,
            birthdate: person.birthdate,
            preson_type: person.preson_type
        });

        res.status(200).json({ message: 'Data received successfully' });
    } catch (error:any) {
        console.error('Error processing the request:', error);

        res.status(500).json({ error:  'Internal server error', details: error.message });
    }
});


router.delete('/:person_id', async (req, res) => {
    try {
      const personId = req.params.person_id;
  
      const sql = "DELETE FROM `person` WHERE `person_id` = ?";
      const result = await queryAsync(sql, [personId]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Person deleted successfully' });
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    } catch (error:any) {
      console.error('Error processing the request:', error);
  
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });



function formatDate(dateString: string | string | string) {
    const originalDate = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as Intl.DateTimeFormatOptions;
    return originalDate.toLocaleDateString('en-GB', options).split('/').reverse().join('/');
  }
  
  
