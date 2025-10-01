const express = require("express");
const app = express();
const path = require("path");
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "index.html"));
});
app.get("/simon_says",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "simon_says.html"));
})
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});