import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';

import { Requester } from './src';

const app = express();
const requester = new Requester()
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req: any, res: any) => {
    const data = requester.getProductInfo('product-1').then((value) => {
        
        console.log('value:', value)
        
    })
    
    res.send("This is the homepage");
});

// start the Express server
app.listen(3000, () => console.log("Server running on port 3000"));