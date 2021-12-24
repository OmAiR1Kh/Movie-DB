const express = require('express')
const app =express()

app.get('/', (req,res)=>{
    res.send('ok')
})
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Application is listed and working on port ${PORT}`)
})