const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const prisma = require("./lib/prisma");

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

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
