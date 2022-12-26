async function clientConfig(client) {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    };
}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function saveUser(client, user) {
    const collection = client.db("drumre").collection("users");
    
    await collection.findOneAndUpdate(
        { _id: user.sub },
        {
            $set: {
                email: user.email,
                name: user.name
            }
        },
        { upsert: true },
        (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log("Success saving user:");
                console.log(result);
                return result
            }
        }
    );
}

async function getMovies(client, user) {
    const collection = client.db("drumre").collection("movies");
    return await collection.find({
        user: user
    }).toArray()
}

async function saveMovie(client, movie, user) {
    const collection = client.db("drumre").collection("movies");
    
    await collection.findOneAndUpdate(
        { _id: movie.id },
        {
            $set: {
                title: movie.title,
                releaseDate: movie.releaseDate,
                url: movie.url,
                user: user
            }
        },
        { upsert: true },
        (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log("Success saving movie:");
                console.log(result);
                return result
            }
        }
    );
}



module.exports = {
    clientConfig,
    listDatabases,
    saveUser,
    getMovies,
    saveMovie
}