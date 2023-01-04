async function clientConfig(client) {
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    }
    ;
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
    if (userDb) {
        watched = undefined;
    }

    await collection.findOneAndUpdate(
        {_id: user.email},
        {
            $set: {
                ...user,
                watched
            }
        },
        {upsert: true, ignoreUndefined: true},
        (error, result) => {
            if (error) {
                console.log(error);
                throw error;
            } else {
                return result
            }
        }
    );
}

async function getMovies(client, email) {
    const collectionMovies = client.db("drumre").collection("movies");
    const collectionUsers = client.db("drumre").collection("users");
    if (email) {
        console.log("heloo!");
        const user = await collectionUsers.findOne({
            _id: email
        })
        const watchedArr = user.watched.map(m =>
            m.movieId
        )

        return await collectionMovies.find({_id: {$in: watchedArr}}).toArray()
    }
    return await collectionMovies.find().limit(20).toArray()
}

async function getCategories(client) {
    const collectionCategories = client.db("drumre").collection("genres");
    return await collectionCategories.find().toArray()
}

async function getMoviesForTimeRange(client, range) {
    const collectionMovies = client.db("drumre").collection("movies");
    const collectionUsers = client.db("drumre").collection("users");
    const users = await collectionUsers.find({}).toArray();
    let currentTime = Date.now()

    let timeDiffMs;
    switch (range) {
        case 'weekly':
            timeDiffMs = 7 * 24 * 60 * 60 * 1000;
            break;
        case 'monthly':
            timeDiffMs = 30 * 24 * 60 * 60 * 1000;
            break;
        case 'yearly':
            timeDiffMs = 365 * 24 * 60 * 60 * 1000;
            break;
    }

    let watchedMovies = {}
    users.forEach((user) => {
        user.watched.filter((mov) => currentTime - mov.timestamp < timeDiffMs).forEach(curr => {
            if (curr.movieId in watchedMovies) {
                watchedMovies[curr.movieId] += 1;
            } else {
                watchedMovies[curr.movieId] = 1
            }
            console.log(watchedMovies)
        })
    })


    let moviesCount = Object.entries(watchedMovies).sort((a, b) => b[1] - a[1])
        .slice(0, 10).map(al => parseInt(al[0]))

    console.log(moviesCount)

    let dbMovies = await collectionMovies.find({_id: {$in: moviesCount}}).toArray()

    console.log(dbMovies)

    let result =  dbMovies.sort((a, b) => moviesCount.indexOf(a._id) - moviesCount.indexOf(b._id) )

    console.log(result)

    return result

}

async function saveMovie(client, movieId, user) {
    const collection = client.db("drumre").collection("users");
    await collection.findOneAndUpdate(
        {_id: user.email},
        {
            $addToSet: {
                watched: {
                    movieId: movieId,
                    timestamp: Date.now()
                }
            }
        },
        {upsert: true},
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
    saveMovie,
    getMoviesForTimeRange,
    getCategories,
}