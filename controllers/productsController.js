const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const productsFilePath = path.join(__dirname, "../data/products.json");

async function readProductsFile() {
  const data = await fs.readFile(productsFilePath, "utf8");
  return JSON.parse(data);
}

async function writeProductsFile(data) {
  await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2), "utf8");
}

async function getAllProducts(req, res) {
  try {
    const products = await readProductsFile();
    res.json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getProductById(req, res) {
  try {
    const products = await readProductsFile();
    const product = products.find((p) => p.id === req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function addProduct(req, res) {
  try {
    const products = await readProductsFile();
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    await writeProductsFile(products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function updateProduct(req, res) {
  try {
    const products = await readProductsFile();
    const index = products.findIndex((p) => p.id === req.params.pid);
    if (index === -1) {
      return res.status(404).send("Product not found");
    }
    products[index] = { ...products[index], ...req.body };
    await writeProductsFile(products);
    res.json(products[index]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deleteProduct(req, res) {
  try {
    let products = await readProductsFile();
    products = products.filter((p) => p.id !== req.params.pid);
    await writeProductsFile(products);
    res.send("Product deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
