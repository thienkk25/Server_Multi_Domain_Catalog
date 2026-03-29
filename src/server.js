import app from "./app.js"

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
})