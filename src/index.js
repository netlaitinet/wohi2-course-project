const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const questionsRouter = require("./routes/posts");
const prisma = require("./lib/prisma");
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/posts", questionsRouter);

app.use((req, res) => {
    res.status(404).json({msg: "Not found"});
    // res.json({msg: "Not found"});

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();

    process.exit(0);

});

process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);

});
