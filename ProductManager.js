const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.init();
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error(
          "El archivo no existe. Se inicializará un arreglo vacío."
        );
        this.products = [];
      } else {
        throw error;
      }
    }
    this.idCounter =
      this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
  }

  async addProduct(product) {
    const requiredFields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    for (let field of requiredFields) {
      if (!product[field]) {
        console.error(`El campo ${field} es obligatorio.`);
        return;
      }
    }

    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      console.error("El código del producto ya existe.");
      return;
    }

    this.idCounter++;
    product.id = this.idCounter;

    this.products.push(product);
    await this.writeJSONFile(this.products);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Not found");
      return null;
    }
    return product;
  }

  async updateProduct(id, updatedProduct) {
    let index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      console.error("Producto no encontrado");
      return;
    }

    this.products[index] = { ...this.products[index], ...updatedProduct, id };
    await this.writeJSONFile(this.products);
  }

  async deleteProduct(id) {
    this.products = this.products.filter((p) => p.id !== id);
    await this.writeJSONFile(this.products);
  }

  async readJSONFile() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error("El archivo no existe. Se creará un nuevo archivo.");
        return [];
      } else {
        throw error;
      }
    }
  }

  async writeJSONFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf8");
  }
}

module.exports = ProductManager;
