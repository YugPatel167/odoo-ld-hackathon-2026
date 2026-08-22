# -*- coding: utf-8 -*-
# pyrefly: ignore [missing-import]
from odoo import models, fields

class GlobeTrotterActivity(models.Model):
    _name = 'globetrotter.activity'
    _description = 'GlobeTrotter Destination Activity'
    _order = 'city_id, name asc'

    name = fields.Char(
        string='Activity Name',
        required=True
    )
    activity_type = fields.Selection([
        ('sightseeing', 'Sightseeing'),
        ('food', 'Food & Culinary'),
        ('adventure', 'Adventure & Outdoors'),
        ('culture', 'Culture & History'),
        ('leisure', 'Leisure & Relaxation')
    ], string='Category', default='sightseeing', required=True)

    cost = fields.Float(
        string='Estimated Cost ($)',
        default=0.0,
        help='Estimated cost per person in USD'
    )
    duration_hours = fields.Float(
        string='Duration (Hours)',
        default=2.0,
        help='Estimated duration in hours'
    )
    city_id = fields.Many2one(
        'globetrotter.city',
        string='City',
        required=True,
        ondelete='cascade',
        index=True
    )
    description = fields.Text(
        string='Description'
    )
