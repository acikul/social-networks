const recommend = require('collaborative-filter');


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

async function getRecommendations(client, email){
    const collectionUsers = client.db("drumre").collection("users");
    const collectionMovies = client.db("drumre").collection("movies");

    const user = await collectionUsers.findOne({
        _id: email
    })

    const allUsers = await collectionUsers.find({_id: { $ne: email }, "watched.0" : {$exists:true}}).toArray();

    const userMovies = user.watched.map(mov=>mov.movieId);
    console.log(userMovies);
    if(userMovies.length==0){
        return []; // TODO call API for recommended or get most popular
    }
    const similarUsers = [user]
    allUsers.forEach(otherUser=>{
        const otherUserMovies = otherUser.watched.map(mov=>mov.movieId);
        const diff = userMovies.filter(x=> {
            return otherUserMovies.indexOf(x) < 0;
        });
        if(diff.length>0){
            similarUsers.push(otherUser);
        }
    })

    console.log(similarUsers.map(user=>user.watched))
    console.log(similarUsers.length)

    const moviesCandidatesToRecommend = [...new Set(similarUsers.map(user=>user.watched.map(movie=>movie.movieId)).flat())];


    //TODO ADD CALL TO API FOR ADDITIONAL RECOMMENDATIONS IN ORDER TO AVOID COLD BOOT PROBLEMS

    const ratings = []
    similarUsers.forEach(user=>ratings.push(createRatingArray(user.watched.map(mov=>mov.movieId), moviesCandidatesToRecommend)))
    console.log(moviesCandidatesToRecommend)
    console.log("AYYYYYYYYYYY")
    console.log(ratings)
    const result = recommend.cFilter(ratings, 0);

    const moviesToRecommend = moviesCandidatesToRecommend.filter((movie,index)=>result.includes(index))

    return await collectionMovies.find({_id: {$in: moviesToRecommend}}).toArray();
}

function createRatingArray(userMovies,movies){
    const userRatings = []
    movies.forEach(movie=>{
        if(userMovies.includes(movie)){
            userRatings.push(1);
        }else{
            userRatings.push(0);
        }
    })
    return userRatings;
}

module.exports = {
    clientConfig,
    listDatabases,
    saveUser,
    getMovies,
    saveMovie,
    getMoviesForTimeRange,
    getRecommendations,
    getCategories
}