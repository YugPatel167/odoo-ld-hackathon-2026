# -*- coding: utf-8 -*-
{
    'name': 'GlobeTrotter',
    'version': '17.0.1.0.0',
    'summary': 'Personalized & Collaborative Travel Planning Platform',
    'description': """
        GlobeTrotter empowers travelers to plan multi-city trips,
        manage itineraries, estimate budgets, and explore destinations.
    """,
    'author': 'GlobeTrotter Team',
    'category': 'Extra Tools',
    'depends': [
        'base',
        'web',
        'auth_signup',
        'website',
    ],
    'data': [
        'security/ir.model.access.csv',
        'security/ir.rules.xml',
        'views/auth_templates.xml',
        'views/trip_views.xml',
        'views/shared_trip_template.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'globetrotter/static/src/css/auth.css',
        ],
    },
    'installable': True,
    'application': True,
    'license': 'LGPL-3',
}
