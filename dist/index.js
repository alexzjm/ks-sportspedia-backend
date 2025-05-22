"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../generated/prisma");
dotenv_1.default.config();
const prisma = new prisma_1.PrismaClient();
const app = (0, express_1.default)();
// app.use(cors({ origin: 'http://localhost:5173' })); // for development
app.use((0, cors_1.default)({ origin: 'https://ks-sportspedia-frontend.vercel.app/' })); // for deployment
app.use(express_1.default.json());
app.get('/api/ping', async (_req, res) => {
    try {
        res.send('pong');
    }
    catch {
        // idk what goes here, probably error messages lol
    }
});
app.get('/articles', async (_req, res) => {
    try {
        const allArticles = await prisma.articles.findMany();
        //console.log("first try");
        //console.log(await prisma.articles.findMany());
        res.json(allArticles); // send a request to all articles lol. i.e SELECT * FROM Articles
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});
app.get('/articles/:id', async (_req, res) => {
    try {
        const article = await prisma.articles.findUnique({
            where: {
                article_id: Number(_req.params.id),
            },
        });
        res.json(article); // SELECT * FROM Articles WHERE id={id}
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});
app.post('/articles/', async (_req, res) => {
    console.log("backend detected post request");
    console.log(_req.body);
    try {
        const article = await prisma.articles.create({
            data: {
                title: _req.body.articleTitle,
                author: _req.body.author,
                desc: _req.body.description,
                length_in_min: _req.body.readingTime,
                category: _req.body.category,
                date_published: _req.body.uploadDate,
                link: _req.body.articleLink,
            },
        });
        res.json(article); // make a new article. 
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
