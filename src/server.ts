import express from 'express';
import 'reflect-metadata';

import uploadConfig from './config/upload';
import routes from './routes';

import './database';

const app = express();

app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));

app.listen(3333, () => console.log('Server is running in the port 3333...'));
