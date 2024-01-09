import express from "express";

const app = express();
const PORT=4000;

app.use(express.json());

app.get('/' ,(req,res) => {
    res.send('WebShop');
});

app.listen(PORT, () => {
    console.log(`Open this link in your browser: http://127.0.0.1:${PORT}`);
  });
