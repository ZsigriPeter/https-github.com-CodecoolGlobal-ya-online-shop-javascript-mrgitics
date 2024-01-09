import express from "express";
import fs from "fs/promises";
import path from "path";
import url from "url";

const app = express();
const PORT=4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataRoute = path.join(__dirname, './data.json');

app.use(express.static(path.join(__dirname, "../client")));

app.get('/' ,(req,res) => {
    res.send('WebShop');
});

app.get('/api', async (req, res) => {
    const data = await fs.readFile("./data.json", "utf8");
    const artifacts = JSON.parse(data).artifacts;

    return res.json(artifacts)
})

app.get('/artifact', (req, res ) => {
    res.sendFile(path.join(__dirname, "../client/public.html"));
});

app.listen(PORT, () => {
    console.log(`Open this link in your browser: http://127.0.0.1:${PORT}`);
  });
