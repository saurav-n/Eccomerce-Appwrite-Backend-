import { connection } from "../redis/index.js";
import { Queue, Worker, QueueEvents } from 'bullmq';
import axios from "axios";
import Order from "../../models/order.js";

const paymentQueue = new Queue('paymentQueue', {
  connection,
  defaultJobOptions:{
    attempts:5,
    backoff:{
      type:'exponential',
      delay:1000
    }
  }
});

const paymentWorker = new Worker('paymentQueue', async (job) => {
    console.log('job',job)
    const {pidx}=job.data
    const lookUpResponse=await axios.post('https://dev.khalti.com/api/v2/epayment/lookup/',{
        pidx
    },{
        headers:{
            'Content-Type':'application/json',
            'Authorization':`key ${process.env.KHALTI_KEY}`
        }
    })
    if(lookUpResponse.data.status==='Completed'){
        const order=await Order.findOne({pidx})
        if(order){
            order.paymentStatus='success'
            order.status='confirmed'
            await order.save()

            return {
                success:true,
                message:'Payment successful'
            }
        }
    }

    if(job.attemptsMade===4){
        paymentQueue.add('paymentQueue',{pidx})
    }

    throw new Error('Payment failed')
},{
    connection,
})

export default paymentQueue
