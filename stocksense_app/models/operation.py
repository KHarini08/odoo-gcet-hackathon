from odoo import models, fields

class StockSenseOperation(models.Model):
    _name = 'stocksense.operation'
    _description = 'Inventory Operations'

    name = fields.Char('Reference', required=True)
    operation_type = fields.Selection[
        ('receipt', 'Receipt'),
        ('delivery', 'Delivery Order'),
        ('internal', 'Internal Transfer'),
        ('adjustment', 'Stock Adjustment')
    ], string='Document Type', required=Trueecho     status = fields.Selection[
        ('draft', 'Draft'),
        ('ready', 'Ready'),
        ('done', 'Done'),
        ('canceled', 'Canceled')
    ], string='Status', default='draft'echo     product_id = fields.Many2one('stocksense.product', string='Product')
    quantity = fields.Integer('Quantity')
