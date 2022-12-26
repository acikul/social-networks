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
    const userDb = await collection.findOne({_id: user.email})
    let watched = [];
    if(userDb){
        watched = undefined;
    }

    await collection.findOneAndUpdate(
        { _id: user.email },
        {
            $set: {
                ...user,
                watched
            }
        },
        { upsert: true , ignoreUndefined: true},
        (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                // console.log("Success saving user:");
                // console.log(result);
                return result
            }
        }
    );
}

async function getMovies(client, email) {
    const collectionMovies = client.db("drumre").collection("movies");
    const collectionUsers = client.db("drumre").collection("users");
    if(email){
        const usersMovies = await collectionUsers.findOne({
            _id: email
        })
        return await collectionMovies.find({_id:{$in:usersMovies.watched}}).toArray()

        // return await collectionUsers.find({
        //     user: user
        // }).toArray()
    }
    return await collectionMovies.find().toArray()

}

async function saveMovie(client, movieId, user) {
    const collection = client.db("drumre").collection("users");
    await collection.findOneAndUpdate(
        { _id: user.email },
        {
            $addToSet: {
                watched:movieId
            }
        },
        { upsert: true },
        (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                // console.log("Success saving movie:");
                // console.log(result);
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