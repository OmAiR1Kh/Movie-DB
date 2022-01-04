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

app.get('/movies/update', (req,res)=>{
    res.send('update movies')
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

app.get("/movies/read/id/:id", (req, res) => {
    if (req.params.id >= '0' && req.params.id < movies.length) {
        res.status(200).json({
            status: 200,
            data: movies[req.params.id]
        })
    } else {
        res.status(404)
        res.send({
            status: 404,
            error: true,
            message: `the movie ${req.params.id} does not exist`
        })
    }

})

app.post('/movies/add' , (req, res) => {

    if(!req.query.title){
        if(!req.query.year){
            res.status(403).json({status:403, error:true, message:'you cannot create a movie without providing a title and a year'})
        }
        else{
            res.status(403).json({status:403, error:true, message:'you cannot create a movie without providing a title'})
        }
    }
    
    else if(!req.query.year) {
        res.status(403).json({status:403, error:true, message:'you cannot create a movie without providing a year'})
    }
    
    else if(req.query.year.length != 4 || isNaN(req.query.year)){
        if(isNaN(req.query.year)){
            res.status(403).json({status:403, error:true, message:'The year provided is not a number'})
        }
        else{
            res.status(403).json({status:403, error:true, message:'The year provided is not of 4 digits'})
        }
    }
    else if(req.query.year > new Date().getFullYear() || req.query.year < 1895 ){
        res.status(403).json({status:403, error:true, message:'The year provided is not valid'})
    }
    
    else if(req.query.rating && (req.query.rating > 10 || req.query.rating < 0) ){
        res.status(403).json({status:403, error:true, message:'The rating provided is not valid'})
    }
    
    else {
        let newMovie = {
            title: req.query.title,
            year: req.query.year,
            rating: `${req.query.rating || 4}`
        }
        movies.push(newMovie);
        res.status(200).json({status:200, data: movies})
    }
    
})
app.delete(['/movies/delete/:id','/movies/delete' ] , (req, res) => {
    if(req.params.id){

        if(Number(req.params.id) >= 0 && req.params.id < movies.length){
            movies.splice(req.params.id, 1);
            res.status(200).json({status:200, data: movies})
        }
        else{
            res.status(404).json({status:404, error:true, message:`The movie ${req.params.id} does not exist`})
        }
    }
    else{
        res.status(404).json({status:404, error:true, message:`Enter the id of the movie`})
    }
})

app.put(['/movies/update', '/movies/update/:id'] , (req, res) => {

    if(req.params.id){

        if(Number(req.params.id) >= 0 && req.params.id < movies.length){
            if(!req.query.title && !req.query.year && !req.query.rating){
                res.status(404).json({status:404, error:true, message:`Enter the data you want to update`})
            }
            else if(req.query.year && ( req.query.year > new Date().getFullYear() || req.query.year < 1895 || req.query.year.length != 4 || isNaN(req.query.year) )){
                res.status(403).json({status:403, error:true, message:'The year provided is not valid'})
            }
            
            else if(req.query.rating && (isNaN(req.query.rating) || req.query.rating >10 || req.query.rating < 0)){
                res.status(403).json({status:403, error:true, message:'The rating provided is not valid'})
            }
            else{
                let editedMovie={
                    title : `${req.query.title || movies[req.params.id].title }`,
                    year : `${req.query.year || movies[req.params.id].year}`,
                    rating : `${req.query.rating || movies[req.params.id].rating}`
                }
                movies.splice(req.params.id, 1, editedMovie)
    
    
                res.status(200).json({status:200, data: movies[req.params.id]})
            
            }
        }
        else{
            res.status(404).json({status:404, error:true, message:`The movie ${req.params.id} does not exist`})
        }
    }
    else{
        res.status(404).json({status:404, error:true, message:`Enter the id of the movie`})
    }

})

/*
Listening on PORT
*/
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Application is listed and working on port ${PORT}`)
})