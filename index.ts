import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';

const port = 3000; // default port to listen

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req: any, res: any) => {
  res.send("This is the homepage");
});

// start the Express server
app.listen(3000, () => console.log("Server running on port 3000"));