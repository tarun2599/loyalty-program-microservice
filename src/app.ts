// src/app.ts
import express from 'express';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import rateLimiter  from './middleware/rateLimiter';
import loggerMiddleware from './middleware/loggerMiddleware';


const app = express();
app.use(rateLimiter);
app.use(loggerMiddleware);
const swaggerDocument = YAML.load('./src/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json()); // Parse JSON request bodies
const axios = require('axios');

app.use('/api/v1', userRoutes);

app.get('/', async(req, res) => {
    const apiurl = "https://portal.itscredible.com/api/v1/edulocker/user/tarun@yopmail.com";
    try{
        const response = await axios.get(apiurl);
        res.status(200).json({
            message: 'Data fetched successfully',
            data: response.data,
        });
    } catch(err){
        res.status(400);
    }
    // res.send('Welcome to the Loyalty Program API!');
});

export default app;
