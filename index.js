const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cors = require("cors")
const PORT = process.env.PORT 

//Connect to database
connectDB()
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

//Routes
app.use('/api/volunteer',require('./routes/volunteerRoutes'))
app.use('/api/admin',require('./routes/adminRoutes'))
app.use('/api/ngos',require('./routes/ngoRoutes'))
app.use('/api/requirement',require('./routes/requirementRoutes'))
app.use('/api/counsellor',require('./routes/counsellorRoutes'))
app.use('/api/case',require('./routes/caseRoutes'))

app.use(errorHandler)

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`))