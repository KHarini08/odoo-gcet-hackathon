{
    'name': 'StockSense IMS',
    'version': '1.0',
    'category': 'Inventory',
    'summary': 'Modular Inventory Management System',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/menu.xml',
        'views/product_views.xml',
        'views/operation_views.xml',
    ],
    'installable': True,
    'application': True,
}
