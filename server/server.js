import express from "express";
import { writeFile } from "fs";
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

app.patch('/api/:id', async (req, res) =>{
   
    putPatch (req, res)
});

app.delete('/api/:id', async (req, res) => {
    const data = await fs.readFile(dataRoute, 'utf8');
    const { artifacts } = JSON.parse(data);
    const artifactId = parseInt(req.params.id);
    const artifact = artifacts.find((artifact) => artifact.id === artifactId);

    if (artifact) {
        const newInventory = artifacts.filter((x) => x.id !== artifactId);
        await fs.writeFile(dataRoute, JSON.stringify({artifacts: newInventory}), 'utf8');
        return res.send({ state: 'DONE'});
    } else {
        return res.status(404).send({ state: 'user not found'});
    }
});

app.put('/api/:id', async (req, res) =>{
   
    putPatch (req, res)
});

async function putPatch (req, res) {
    const data = await fs.readFile(dataRoute, 'utf8');
    const { artifacts } = JSON.parse(data);
    console.log(artifacts);
    const artifactId = parseInt(req.params.id);
    const artifact = artifacts.find((artifact) => artifact.id === artifactId);


    if (artifact) {
        artifact.name = req.body.name || '';
        artifact.description = req.body.description || '';
        artifact.price = req.body.price || ''
        artifact.inventory = req.body.inventory || '';
        artifact.image = req.body.image || '';


        await fs.writeFile(dataRoute, JSON.stringify({ artifacts }), 'utf8');
        return res.send({ state: "DONE"});
    } else {
        return res.status(404).send({ state: 'User not found'});
    }
}

app.post('/api', async (req, res) => {
    const data = await fs.readFile(dataRoute, 'utf8');
    const { artifacts } = JSON.parse(data);
    const artifactId = artifacts.map(artifact => artifact.id);
    const maxId = Math.max(...artifactId);

    const newItem = {
        id: maxId+1,
        name: req.body.name || "",
        description: req.body.description || '',
        price: req.body.price || '',
        inventory: req.body.inventory || '',
        image: req.body.image || '',

    };

    artifacts.push(newItem);
    await fs.writeFile(dataRoute, JSON.stringify({ artifacts }), 'utf8');
    return res.send({ state: "DONE"});
})





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
