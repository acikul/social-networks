const { MongoClient } = require('mongodb');
const express = require("express");
const bodyParser = require("body-parser")
const { clientConfig, listDatabases, saveUser, getMovies, saveMovie, getMoviesForTimeRange } = require("./mongo.js")
const dotenv = require('dotenv');
const e = require("express");
dotenv.config();
const app = express();
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.MONGO_USER}@cluster0.dyjsocr.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri);
clientConfig(client);
listDatabases(client);


//___________________________________________________________________________________________________________

app.post("/api/save-user", (req, res) => {
    try {
        let result = saveUser(client, req.body)
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/movies/popular/:range', async (req, res) => {
    let genreId = req.query.genreId || "all"

    try {
        result = await getMoviesForTimeRange(client, req.params.range, genreId)
        res.json(result)
    } catch (error) {
        res.json(error)
    }
})


app.get("/api/movies/:user", async (req, res) => {
    try {
        result = await getMovies(client, req.params.user)
        console.log(result);
        res.json(result)
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/api/save-movie", (req, res) => {
    try {
        let result = saveMovie(client, req.body.movie, req.body.user)
        res.status(200).send()
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/api/movies",async (req,res)=>{
    res.json(await getMovies(client,null))
})


app.listen(8080, () => {
    console.log("Backend server listening on port 8080");
});
