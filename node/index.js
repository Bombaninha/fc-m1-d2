const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const config = {
    host: 'db-m1-d2',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}
const mysql = require('mysql')

const insertPerson = (name) => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);

        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database: ', err.stack);
                reject(err);
                return;
            }

            const sql = 'INSERT INTO people (name) VALUES (?)';
            const values = [name];

            connection.query(sql, values, (error, results, fields) => {
                if (error) {
                    console.error('Error executing insert query: ', error);
                    connection.end();
                    reject(error);
                    return;
                }

                connection.end();

                resolve(results);
            });
        });
    });
};

const queryPeople = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(config);

        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database: ', err.stack);
                reject(err);
                return;
            }

            connection.query('SELECT * FROM people', (error, results, fields) => {
                if (error) {
                    console.error('Error executing query: ', error);
                    connection.end()
                    reject(error);
                    return;
                }

                connection.end();

                resolve(results);
            });
        });
    });
};

let counter = 1;

app.get('/', async (req, res) => {
    try {
        const insertResult = await insertPerson(`Lucas Bombinhas ${counter}`);

        counter++;

        const people = await queryPeople();

        let htmlResponse = '<h1>Full Cycle Rocks!</h1>';

        htmlResponse += '<ul>';

        people.forEach((person) => {
            htmlResponse += `<li>${person.name}</li>`;
        });

        htmlResponse += '</ul>';
        res.send(htmlResponse);
    } catch (error) {
        console.error('Error handling request: ', error);
        res.status(500).send('Error retrieving data from database');
    }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
