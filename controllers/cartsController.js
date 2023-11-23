const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const cartsFilePath = path.join(__dirname, "../data/carts.json");

async function readCartsFile() {
  const data = await fs.readFile(cartsFilePath, "utf8");
  return JSON.parse(data);
}

async function writeCartsFile(data) {
  await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2), "utf8");
}

async function createCart(req, res) {
  try {
    const carts = await readCartsFile();
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    await writeCartsFile(carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getCartById(req, res) {
  try {
    const carts = await readCartsFile();
    const cart = carts.find((c) => c.id === req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send("Cart not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function addProductToCart(req, res) {
  try {
    const carts = await readCartsFile();
    const cartIndex = carts.findIndex((c) => c.id === req.params.cid);
    if (cartIndex === -1) {
      return res.status(404).send("Cart not found");
    }
    const product = { id: req.params.pid, quantity: req.body.quantity || 1 };
    carts[cartIndex].products.push(product);
    await writeCartsFile(carts);
    res.status(201).json(carts[cartIndex]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};
