/*Imports*/
const { response } = require('express')
const express = require('express')
const app =express()
const date = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
/*
DB connection
*/

/*
Routes
*/

app.get('/', (req,res)=>{
    res.send('ok')
})
app.get('/test', (req,res)=>{
    res.status(200).json({
        status:200,
        message:"ok"
    })
})
app.get('/time', (req,res)=>{
    res.status(200).json({
        status:200,
        message:date
    })
})

app.get('/Hello/:id', (req,res)=>{
    let :id = undefined;
    res.status(200).json({
        status:200,
        message: `Hello ${req.params.id}`,
    })
})

app.get('/search',(req,res) => {
    const search = req.query.s;

    if (typeof search != 'undefined') {
        // Search string applied
        const response = {
            status:200, message:"ok", data: search
        };

        res.send(response);
    }
    else {
        const response = {
            status:500, error:true, message: "you have to provide a search"
        };


        res.status(500);
        res.send(response);
    }
});

app.get('/movies/read', (req,res)=>{
    res.status(200).json({
        status:200,
        message:movies
    })
})

app.get('/movies/create', (req,res)=>{
    res.send('create movies')
})
app.get('/movies/update', (req,res)=>{
    res.send('update movies')
})
app.get('/movies/delete', (req,res)=>{
    res.send('delete movies')
})

app.get("/movies/read/by-date", (req, res) => {
    let moviesByDate = movies.slice().sort(function (x, y) { return y.year - x.year })
    res.send({
        status: 200,
        data: moviesByDate
    })
})

app.get("/movies/read/by-rating", (req, res) => {
    let moviesByRating = movies.slice().sort(function (x, y) { return y.rating - x.rating })
    res.send({
        status: 200,
        data: moviesByRating
    })
})

app.get("/movies/read/by-title", (req, res) => {
    let moviesByTitle = movies.slice().sort(function (x, y) { return (x.title > y.title) ? 1 : ((x.title < y.title) ? -1 : 0) })
    res.send({
        status: 200,
        data: moviesByTitle
    })
})

/*
Listening on PORT
*/
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Application is listed and working on port ${PORT}`)
})