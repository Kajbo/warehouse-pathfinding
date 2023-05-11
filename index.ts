import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';

import { Requester, PathFinder } from './src';

/**
 * TUTO zadame co hladame
 */
const productsToFind = [
    'product-1', 
    'product-2',
    'product-3',
]

const app = express();
const pathFinder = new PathFinder()


app.get("/", (req: any, res: any) => {
    
    pathFinder.findPath(productsToFind).then((result)=> {
        console.log(result)
    })
    
    
    res.send("This is the homepage");
});

// start the Express server
app.listen(3000, () => console.log("Server running on port 3000"));