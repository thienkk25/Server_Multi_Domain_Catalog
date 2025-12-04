import app from "./app.js"

app.listen(process.env.SERVER_PORT, function () {
    console.log(`Server run http://localhost:${process.env.SERVER_PORT}`)
})