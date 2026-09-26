const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'models', 'inventory.json');

// Helper to read data
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = { products: [], operations: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API: Get Inventory Snapshot & Products
app.get('/api/inventory', (req, res) => {
    const data = readData();
    res.json(data);
});

// API: Add Product
app.post('/api/products', (req, res) => {
    const { name, sku, category, uom, initialStock } = req.body;
    const data = readData();
    
    const newProduct = {
        id: Date.now(),
        name,
        sku,
        category,
        uom,
        stock: parseInt(initialStock) || 0
    };
    
    data.products.push(newProduct);
    writeData(data);
    res.json({ success: true, product: newProduct });
});

// API: Process Receipt (Incoming Goods - increases stock)
app.post('/api/receipts', (req, res) => {
    const { supplier, sku, quantity } = req.body;
    const data = readData();
    
    const product = data.products.find(p => p.sku === sku);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product SKU not found" });
    }

    product.stock += parseInt(quantity);
    
    data.operations.push({
        id: Date.now(),
        type: 'Receipt',
        supplier,
        sku,
        quantity: parseInt(quantity),
        timestamp: new Date().toISOString()
    });

    writeData(data);
    res.json({ success: true, message: `Successfully received ${quantity} units of ${product.name}`, product });
});

app.listen(PORT, () => {
    console.log(`StockSense server running on http://localhost:${PORT}`);
});