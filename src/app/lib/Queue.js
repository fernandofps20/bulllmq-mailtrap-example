import { Queue, Worker } from "bullmq";
import redisConfig from '../../config/redis';
import * as jobs from '../jobs';

const queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, redisConfig),
    name: job.key,
    handle: job.handle,
    options: job.options
}));

export default {
    queues,
    add(name, data) {
        const queue = this.queues.find(queue => queue.name === name)
        return queue.bull.add(name, data, queue.options);
    },
    process() {
        return this.queues.forEach(queue =>{
            const worker = new Worker(queue.name, queue.handle, redisConfig);
            
            worker.on('completed', job => {
                console.log(`${job.id} ${queue.name} has completed!`);
            });
            
            worker.on('failed', (job, err) => {
                console.log(`${job.id} ${queue.name} has failed with ${err.message}`);
            });
        }) 
    }
}