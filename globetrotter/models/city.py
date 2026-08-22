# -*- coding: utf-8 -*-
# pyrefly: ignore [missing-import]
from odoo import models, fields, _
# pyrefly: ignore [missing-import]
from odoo.exceptions import UserError

class GlobeTrotterCity(models.Model):
    _name = 'globetrotter.city'
    _description = 'GlobeTrotter Destination City'
    _order = 'popularity desc, name asc'

    name = fields.Char(
        string='City Name',
        required=True,
        index=True
    )
    country_id = fields.Many2one(
        'res.country',
        string='Country',
        required=True,
        index=True
    )
    region = fields.Char(
        string='Region / Continent',
        help='Geographic region (e.g. Europe, East Asia, North America)'
    )
    cost_index = fields.Selection([
        ('budget', 'Budget ($)'),
        ('moderate', 'Moderate ($$)'),
        ('luxury', 'Luxury ($$$)')
    ], string='Cost Index', default='moderate', required=True)

    popularity = fields.Integer(
        string='Popularity Score',
        default=80,
        help='Popularity index score from 1 to 100'
    )
    description = fields.Text(
        string='Description'
    )
    image = fields.Binary(
        string='City Image',
        attachment=True
    )
    activity_ids = fields.One2many(
        'globetrotter.activity',
        'city_id',
        string='Available Activities'
    )

    def action_add_to_trip(self):
        self.ensure_one()
        trip_id = self.env.context.get('active_trip_id') or self.env.context.get('default_trip_id')
        if not trip_id:
            raise UserError(_('Please open a trip first before adding cities to it.'))

        trip = self.env['globetrotter.trip'].browse(trip_id)
        if not trip.exists():
            raise UserError(_('The specified trip could not be found.'))

        # Create new stop on the trip
        self.env['globetrotter.trip.stop'].create({
            'trip_id': trip.id,
            'city_id': self.id,
            'start_date': trip.start_date,
            'end_date': trip.end_date,
            'sequence': len(trip.stop_ids) * 10 + 10,
        })

        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _('City Added!'),
                'message': _('%s has been added to %s.') % (self.name, trip.name),
                'sticky': False,
                'type': 'success',
                'next': {'type': 'ir.actions.act_window_close'}
            }
        }
