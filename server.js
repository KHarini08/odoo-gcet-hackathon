const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'models', 'inventory.json');

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = { products: [], operations: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/inventory', (req, res) => {
    res.json(readData());
});

app.get('/api/products', (req, res) => {
    res.json(readData().products);
});

app.post('/api/products', (req, res) => {
    const { name, sku, category, uom, stock, initialStock } = req.body;
    const data = readData();
    const newProduct = {
        id: Date.now(),
        name,
        sku,
        category,
        uom,
        stock: parseInt(stock !== undefined ? stock : initialStock) || 0
    };
    data.products.push(newProduct);
    writeData(data);
    res.json({ success: true, product: newProduct });
});

app.post('/api/receipts', (req, res) => {
    const { supplier, sku, qty, quantity } = req.body;
    const data = readData();
    const product = data.products.find(p => p.sku === sku);
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product SKU not found' });
    }
    const addQty = parseInt(qty !== undefined ? qty : quantity);
    product.stock += addQty;
    data.operations.push({
        id: Date.now(),
        type: 'Receipt',
        supplier,
        sku,
        quantity: addQty,
        timestamp: new Date().toISOString()
    });
    writeData(data);
    res.json({ success: true, message: 'Stock updated', product });
});

app.listen(PORT, () => {
    console.log('StockSense server running on http://localhost:' + PORT);
});