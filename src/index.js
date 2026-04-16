const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const postsRouter = require("./routes/posts");
const prisma = require("./lib/prisma");

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());
// everything under /api/posts
app.use("/api/posts", postsRouter);

app.use((req, res) => {
    res.json({msg: "Not found"});

});
// Hello World route
// app.get('/', (req, res) => {
// res.json({ message: 'Hello, World!' });
// });

// Health check route

// app.get('/health', (req, res) => {
// res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// Start the server

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
