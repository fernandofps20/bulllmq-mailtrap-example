import 'dotenv/config';
import express from 'express';
import UserController from './app/controllers/UserController';
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
import { ExpressAdapter } from '@bull-board/express';
import Queue from './app/lib/Queue';

const serverAdapter = new ExpressAdapter();

createBullBoard({
    queues: Queue.queues.map(queue => new BullMQAdapter(queue.bull)),
    serverAdapter: serverAdapter,
});

const app = express();
app.use(express.json());

app.post('/users', UserController.store);
serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(3333, () => {
    console.log('Server running on localhost:3333');
})