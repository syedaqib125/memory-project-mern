import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'; // by the new version of node we use this structure of import by adding type in pakage.json
import dotenv from 'dotenv';

import postRoutes from './routes/postsRouter.js';
import userRoutes from './routes/usersRoutes.js';


const app = express();
dotenv.config()

app.use(bodyParser.json({ limit: "300mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user',userRoutes);


app.get('/', (req, res) => {
    res.send('Hello to memories API')
})

// const CONNECTION_URL = 'mongodb+srv://memory_project:memory_project123@cluster0.24khi.mongodb.net/memoryProject?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
  
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch((error) => console.log(error))

// mongoose.set('useFindAndModify', false); noo need of this line on new version

