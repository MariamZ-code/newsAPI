const express=  require("express");
const newsRouter= require ("./router/news");
const reportersRouter= require ("./router/reporters");


require("./db/mongoose");

const app= express();

app.use(express.json());

app.use(reportersRouter);
app.use(newsRouter);

const port=3000
app.listen(port ,()=>{console.log(" server is running")})
 