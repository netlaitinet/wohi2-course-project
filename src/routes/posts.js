const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");
// const posts = require("../data/posts");
function formatPost(post) {
    return {
	...post,
	date: post.date.toISOString().split("T")[0],
	keywords: post.keywords.map((k) => k.name),
    };
}

router.use(authenticate);

// GET /posts
// List all posts
router.get("/", async (req, res) => {
    const { keyword } = req.query;

    const where = keyword
	? { keywords: { some: { name: keyword } } }

	: {};

    const posts = await prisma.post.findMany({
	where,
	include: { keywords: true },

	orderBy: { id: "asc" },

    });

    res.json(posts.map(formatPost));

});
 

// GET /posts/:postld
// Show a specific post
router.get("/:postId", async (req, res) => {
    const postId = Number(req.params.postId);
    const post = await prisma.post.findUnique({ // note to self, linter corrected posts -> post
	where:{ id: postId},
	include: { keywords: true},
    });
    if (!post) {
	return res.status(404).json({ message: "Post not found" });
    }

    res.json(formatPost(post));

});

// POST /posts
// Create a new post
router.post("/", async (req, res) => {
    const { title, date, content, keywords } = req.body;

    if (!title || !date || !content) {
	return res.status(400).json({
	    message: "title, date, and content are mandatory"
	});
    }

    const keywordsArray = Array.isArray(keywords) ? keywords : [];    


    const newPost = await prisma.post.create({
	data: {
	    title, date: new Date(date), content,
	    userId: req.user.userId,
	    keywords: {
		connectOrCreate: keywordsArray.map((kw) => ({
		    where: { name: kw}, create: { name: kw},
		})), },
	},
	include: { keywords: true },
    });
    res.status(201).json(formatPost(newPost));

});

// PUT /posts/:postld
router.put("/:postId", isOwner, async (req, res) => {
    const postId = Number(req.params.postId);
    const { title, date, content, keywords } = req.body;
    const existingPost = await prisma.post.findUnique({ where: { id: postId } });
    if (!existingPost) {
	return res.status(404).json({ message: "Post not found" });

    }
    if (!title || !date || !content) {
	return res.status(400).json({ msg: "title, date and content are mandatory" });
    }
    const keywordsArray = Array.isArray(keywords) ? keywords : [];

    const updatedPost = await prisma.post.update({
	where: { id: postId },

	data: {
	    title, date: new Date(date), content,
	    keywords: {
		set: [],

		connectOrCreate: keywordsArray.map((kw) => ({
		    where: { name: kw },
		    create: { name: kw },
		})),
	    },
	},
	include: { keywords: true },
    });
    res.json(formatPost(updatedPost));
});


// DELETE /posts/:postId
// Delete a post
router.delete("/:postId", isOwner, async (req, res) => {
const postId =

Number(req.params.postId);

const post = await prisma.post.findUnique({
where: { id: postId },
include: { keywords: true },

});

if (!post) {
return res.status(404).json({ message: "Post not found" });
}

await prisma.post.delete({ where: { id: postId } });

res.json({

message: "Post deleted successfully",
post: formatPost(post),
    });
});


module.exports = router;
