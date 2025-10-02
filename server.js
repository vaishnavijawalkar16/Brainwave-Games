const express = require("express");
const app = express();
const path = require("path");
const port = 8080;

const games = [
            { 
                name: "Simon Says",
                description: "Simon Says is a memory and pattern recognition game. It challenges your working memory by making you remember sequences of colors or sounds. It improves focus, attention, and short-term memory.",
                rules: `Watch carefully as the game shows you a sequence of colors (or sounds).
                        Your task is to repeat the same sequence in the correct order.
                        After every correct attempt, the sequence gets longer.
                        If you make a mistake, the game ends.Goal: Remember and follow as long a sequence as possible.`,
                link: "simon_says"
            },
            {
                name: "Hit the Mole",
                description: "Hit the Mole is a fast reaction game that trains your hand-eye coordination and reflexes. It improves attention, response speed, and motor skills, keeping your brain alert.",
                rules: `The game board will have several holes.
                        Moles will pop up randomly from these holes.
                        Click/tap the mole quickly before it disappears.
                        Each successful hit gives you points.
                        As levels increase, moles appear and disappear faster.
                        Goal: Test your reflexes and score as high as you can.`,
                link: "hit_the_mole"
            },
            {
                name: "Match the Cards",
                description: "Match the Cards is a memory game that strengthens visual memory and concentration. By remembering positions of cards, it enhances short-term memory and pattern recognition.",
                rules: `All cards are placed face down on the board.
                        Flip two cards at a time to reveal them.
                        If the two cards match, they remain face up.
                        If they don’t match, they flip back down.
                        Continue until all pairs are matched.
                        Goal: Use memory to match all the cards in the fewest moves.`,
                link: "match_the_cards"
            },
            {
                name: "Word Recall",
                description: "Word Recall is a word memory game that tests your ability to memorize and recall words. It improves memory retention, attention to detail, and cognitive processing speed.",
                rules: `You will see a list of words on the screen for a short time.
                        Try to memorize as many words as possible.
                        After the words disappear, recall and type them correctly.
                        You get points for each correct word recalled.
                        Goal: Improve memory retention and recall speed.`,
                link: "word_recall"
            }
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "index.html"));
});

app.get('/instructions/:game', (req, res) => {
    const { game } = req.params;
    const data = games.find(g => g.link === game);
    if (data) {
        res.render('instruction', { data });
    } else {
        res.status(404).send('Game not found');
    }
});

app.get("/simon_says",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "simon_says.html"));
});
app.get("/match_the_cards",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "match_the_cards.html"));
});
app.get("/hit_the_mole",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "hit_the_mole.html"));
});
app.get("/word_recall",(req,res)=>{
    res.sendFile(path.join(__dirname, "public/html", "word_recall.html"));
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});