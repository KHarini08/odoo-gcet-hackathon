from odoo import models, fields

class StockSenseProduct(models.Model):
    _name = 'stocksense.product'
    _description = 'Product Management'

    name = fields.Char('Product Name', required=True)
    sku_code = fields.Char('SKU / Code')
    category = fields.Selection[
        ('raw', 'Raw Material'),
        ('finished', 'Finished Good')
    ], string='Category'echo     uom = fields.Char('Unit of Measure', default='Units')
    stock_quantity = fields.Integer('Current Stock', default=0)
