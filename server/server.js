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
});

async function findById(id) {
    const data = await fs.readFile('./data.json', 'utf8');
    const { artifacts } = JSON.parse(data);
    const artifactID = id;
    const artifact = artifacts.find((artifact) => artifact.id === artifactID);
    return artifact;
}

app.get('/api/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const artifact=await findById(id);
    if (artifact) {
        return res.send(artifact);
    } else {
        return res.status(404).send('Product not found');
    };
});

async function addOneProductToJson(file,product) {
    const data = await fs.readFile(`./${file}`, "utf8");
    const artifacts = JSON.parse(data);

    artifacts.artifacts.push(product);

    await fs.writeFile(`./${file}`,JSON.stringify(artifacts),'utf8');

    return artifacts.artifacts.length;

}

app.post('/cart/:id',async (req,res) => {
    const id = parseInt(req.params.id);
    const artifact=await findById(id);
    const productCount=await addOneProductToJson('cart.json',artifact);
    res.send(`${productCount}`);
})

app.get('/artifact', (req, res ) => {
    res.sendFile(path.join(__dirname, "../client/public.html"));
});

app.listen(PORT, () => {
    console.log(`Open this link in your browser: http://127.0.0.1:${PORT}`);
  });
