require('dotenv').config();
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const PORT = process.env.PORT || 3001;

// טוען את קובץ ה-Swagger
const swaggerDocument = YAML.load('./swagger.yaml');

// הגדרת Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// נתיב ראשי ריק
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.get('/apps', async (req, res) => {
    try {
        const response = await axios.get('https://api.render.com/v1/services?includePreviews=true&limit=20', {
            headers: {
                'accept': 'application/json',
                'authorization': `Bearer ${process.env.RENDER_API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching apps:', error.message);
        res.status(500).json({ error: 'Failed to fetch apps' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
