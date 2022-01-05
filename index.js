/*Imports*/
const { response } = require('express')
const express = require('express')
const app = express()
const date = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const res = require('express/lib/response')

/*
DB connection
*/
mongoose.connect('mongodb://localhost:27017/movieDB')
mongoose.connection.on('connected', () => {
    console.log('DATABASE is connected successfully')
})

mongoose.connection.on('error', () => {
    console.log('an error occured')
})
/* save data to DB*/
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rating: Number
})

const Movie = mongoose.model("Movie", movieSchema)
for (let i = 0; i > 1; i++) {
    if (i = 0) {
        Movie.create({
            title: "Jaws",
            year: 1975,
            rating: 8
        })
            .then().catch(err => res.status(404).json(err))
        Movie.create({
            title: "Avatar",
            year: 2009,
            rating: 7.8
        })
            .then().catch(err => res.status(404).json(err))
        Movie.create({
            title: "brazil",
            year: 1985,
            rating: 8
        })
            .then().catch(err => res.status(404).json(err))
        Movie.create({
            title: 'الإرهاب والكباب',
            year: 1992,
            rating: 6.2
        })
            .then().catch(err => res.status(404).json(err))
        i = 1
    }
}

/*
Routes
*/

app.get('/', (req, res) => {
    res.send('ok')
})
app.get('/test', (req, res) => {
    res.status(200).json({
        status: 200,
        message: "ok"
    })
})
app.get('/time', (req, res) => {
    res.status(200).json({
        status: 200,
        message: date
    })
})

app.get('/Hello/:id', (req, res) => {
    let: id = undefined;
    res.status(200).json({
        status: 200,
        message: `Hello ${req.params.id}`,
    })
})

app.get('/search', (req, res) => {
    const search = req.query.s;

    if (typeof search != 'undefined') {
        const response = {
            status: 200, message: "ok", data: search
        };

        res.send(response);
    }
    else {
        const response = {
            status: 500, error: true, message: "you have to provide a search"
        };


        res.status(500);
        res.send(response);
    }
});

app.get('/movies/read', (req, res) => {
    Movie.find()
        .then(movies => {
            res.status(200).json({ status: 200, data: movies })
        })
        .catch(err => {
            res.status(404).json(err);
        })
})


app.get("/movies/read/by-date", (req, res) => {
    Movie.find()
        .then(movies => {
            res.status(200).json({ status: 200, data: movies.sort((a, b) => b.year - a.year) })
        })
        .catch(err => {
            res.status(404).json(err);
        })
})

app.get("/movies/read/by-rating", (req, res) => {
    Movie.find()
        .then(movies => {
            res.status(200).json({ status: 200, data: movies.sort((a, b) => b.rating - a.rating) })
        })
        .catch(err => {
            res.status(404).json(err);
        })
})

app.get("/movies/read/by-title", (req, res) => {
    Movie.find()
        .then(movies => {
            res.status(200).json({ status: 200, data: movies.sort((a, b) => a.title.localeCompare(b.title)) })
        })
        .catch(err => {
            res.status(404).json(err);
        })
})

app.get(['/movies/read/id/:id', '/movies/read/id/'], (req, res) => {
    if (req.params.id) {
        Movie.findById(req.params.id)
            .then(movie => {
                res.status(200).json({ status: 200, data: movie })
            })
            .catch(err => {
                res.status(404).json({ status: 404, error: true, message: `The movie ${req.params.id} does not exist` })
            })
    } else {
        res.status(404).json({ status: 404, error: true, message: `Enter the id of the movie` })
    }

})

app.post('/movies/add', (req, res) => {

    if (!req.query.title) {
        if (!req.query.year) {
            res.status(403).json({ status: 403, error: true, message: 'you cannot create a movie without providing a title and a year' })
        }
        else {
            res.status(403).json({ status: 403, error: true, message: 'you cannot create a movie without providing a title' })
        }
    }

    else if (!req.query.year) {
        res.status(403).json({ status: 403, error: true, message: 'you cannot create a movie without providing a year' })
    }

    else if (req.query.year.length != 4 || isNaN(req.query.year)) {
        if (isNaN(req.query.year)) {
            res.status(403).json({ status: 403, error: true, message: 'The year provided is not a number' })
        }
        else {
            res.status(403).json({ status: 403, error: true, message: 'The year provided is not of 4 digits' })
        }
    }
    else if (req.query.year > new Date().getFullYear() || req.query.year < 1895) {
        res.status(403).json({ status: 403, error: true, message: 'The year provided is not valid' })
    }

    else if (req.query.rating && (req.query.rating > 10 || req.query.rating < 0)) {
        res.status(403).json({ status: 403, error: true, message: 'The rating provided is not valid' })
    }

    else {
        Movie.create({
            title: req.query.title,
            year: req.query.year,
            rating: `${req.query.rating || 4}`
        })
            .then(movies => {
                res.status(200).json({ status: 200, data: movies })
            })
            .catch(err => res.status(404).json(err))
    }

})
app.delete(['/movies/delete/:id', '/movies/delete'], (req, res) => {
    if (req.params.id) {
        Movie.findOneAndDelete({ _id: req.params.id })
            .then(deletedMovie => {
                if (!deletedMovie) return res.status(404).json({ status: 404, error: true, message: `The movie ${req.params.id} does not exist` });
                Movie.find()
                    .then(movies => {
                        res.status(200).json({ status: 200, data: movies })
                    })
                    .catch(err => {
                        res.status(404).json(err);
                    })
            })
            .catch(err => {
                res.status(404).json(err);
            })
    }
})

app.put(['/movies/update', '/movies/update/:id'], (req, res) => {

    if (req.params.id) {
        let id = req.params.id
        if (!req.query.title && !req.query.year && !req.query.rating) {
            res.status(404).json({ status: 404, error: true, message: `Enter the data you want to update` })
        }

        else if (req.query.year && (req.query.year > new Date().getFullYear() || req.query.year < 1895 || req.query.year.length != 4 || isNaN(req.query.year))) {
            res.status(404).json({ status: 404, error: true, message: 'The year provided is not valid' })
        }

        else if (req.query.rating && (isNaN(req.query.rating) || req.query.rating > 10 || req.query.rating < 0)) {
            res.status(404).json({ status: 404, error: true, message: 'The rating provided is not valid' })
        }
        else {
            Movie.findById(id)
                .then(movie => {

                    Movie.findOneAndReplace({ _id: id }, {
                        title: `${req.query.title || movie.title}`,
                        year: `${req.query.year || movie.year}`,
                        rating: `${req.query.rating || movie.rating}`
                    })

                        .then(updatedMovie => {
                            if (!updatedMovie) return res.status(404).json();

                            Movie.find()
                                .then(movies => {
                                    res.status(200).json({ status: 200, data: movies })
                                })
                                .catch(err => {
                                    res.status(404).json(err);
                                })

                        })

                        .catch(err => {
                            res.status(404).json(err);
                        })

                })
                .catch(err => {
                    res.status(404).json({ status: 404, error: true, message: `The movie ${req.params.id} does not exist` })
                })

        }
    }

    else {
        res.status(404).json({ status: 404, error: true, message: `Enter the id of the movie` })
    }

})

/*
Listening on PORT
*/
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Application is listed and working on port ${PORT}`)
})