import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
// app.use(cors({ origin: 'http://localhost:5173' })); // for development
app.use(cors({ origin: 'https://ks-sportspedia-frontend.vercel.app/'})) // for deployment
app.use(express.json());

app.get('/api/ping', async (_req: Request, res: Response): Promise<void> => {
    try {
        res.send('pong');
    } catch {
        // idk what goes here, probably error messages lol
    }
});

app.get('/articles', async (_req: Request, res: Response): Promise<void> => {
    try {
        const allArticles = await prisma.articles.findMany();
        //console.log("first try");
        //console.log(await prisma.articles.findMany());
        res.json(allArticles); // send a request to all articles lol. i.e SELECT * FROM Articles
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});

app.get('/articles/:id', async (_req: Request, res: Response): Promise<void> => {
    try {
        const article = await prisma.articles.findUnique({
            where: {
                article_id: Number(_req.params.id),
            },
        });
        res.json(article); // SELECT * FROM Articles WHERE id={id}
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});

app.post('/articles/', async (_req: Request, res: Response): Promise<void> => {
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
        })
        res.json(article); // make a new article. 
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching articles');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
