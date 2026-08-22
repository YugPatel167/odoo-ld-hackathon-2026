# -*- coding: utf-8 -*-
# pyrefly: ignore [missing-import]
from odoo import models, fields, api, _
# pyrefly: ignore [missing-import]
from odoo.exceptions import ValidationError

class GlobeTrotterTripStop(models.Model):
    _name = 'globetrotter.trip.stop'
    _description = 'GlobeTrotter Trip Stop'
    _order = 'sequence, start_date asc, id asc'

    sequence = fields.Integer(
        string='Sequence',
        default=10
    )
    trip_id = fields.Many2one(
        'globetrotter.trip',
        string='Trip',
        required=True,
        ondelete='cascade',
        index=True
    )
    city_id = fields.Many2one(
        'globetrotter.city',
        string='Destination City',
        required=True,
        index=True
    )
    start_date = fields.Date(
        string='Arrival Date',
        required=True
    )
    end_date = fields.Date(
        string='Departure Date',
        required=True
    )
    duration_days = fields.Integer(
        string='Stay (Days)',
        compute='_compute_duration_days',
        store=True
    )
    activity_ids = fields.Many2many(
        'globetrotter.activity',
        'globetrotter_trip_stop_activity_rel',
        'stop_id',
        'activity_id',
        string='Planned Activities',
        domain="[('city_id', '=', city_id)]"
    )
    total_cost = fields.Float(
        string='Stop Cost ($)',
        compute='_compute_total_cost',
        store=True
    )

    @api.depends('start_date', 'end_date')
    def _compute_duration_days(self):
        for stop in self:
            if stop.start_date and stop.end_date:
                delta = (stop.end_date - stop.start_date).days + 1
                stop.duration_days = max(delta, 1)
            else:
                stop.duration_days = 1

    @api.depends('activity_ids.cost')
    def _compute_total_cost(self):
        for stop in self:
            stop.total_cost = sum(act.cost for act in stop.activity_ids)

    @api.constrains('start_date', 'end_date')
    def _check_stop_dates(self):
        for stop in self:
            if stop.start_date and stop.end_date and stop.end_date < stop.start_date:
                raise ValidationError(_('Departure Date cannot be earlier than Arrival Date for %s.') % stop.city_id.name)
