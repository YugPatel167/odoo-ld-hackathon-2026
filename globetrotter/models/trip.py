# -*- coding: utf-8 -*-
import uuid
# pyrefly: ignore [missing-import]
from odoo import models, fields, api, _
# pyrefly: ignore [missing-import]
from odoo.exceptions import ValidationError

class GlobeTrotterTrip(models.Model):
    _name = 'globetrotter.trip'
    _description = 'GlobeTrotter Trip Plan'
    _order = 'start_date desc, id desc'

    name = fields.Char(
        string='Trip Name',
        required=True,
        help='Name or title of your trip (e.g., Summer EuroTrip 2026)'
    )
    user_id = fields.Many2one(
        'res.users',
        string='Traveler',
        default=lambda self: self.env.user,
        required=True,
        index=True
    )
    start_date = fields.Date(
        string='Start Date',
        required=True,
        default=fields.Date.context_today
    )
    end_date = fields.Date(
        string='End Date',
        required=True,
        default=fields.Date.context_today
    )
    duration_days = fields.Integer(
        string='Duration (Days)',
        compute='_compute_duration_days',
        store=True
    )
    destination_count = fields.Integer(
        string='Destinations',
        compute='_compute_destination_count',
        store=True
    )
    stop_ids = fields.One2many(
        'globetrotter.trip.stop',
        'trip_id',
        string='Itinerary Stops'
    )
    description = fields.Html(
        string='Trip Description',
        help='Overview, personal notes, or goals for this journey'
    )
    cover_photo = fields.Binary(
        string='Cover Photo',
        attachment=True,
        help='Optional cover photo or banner image for the trip'
    )
    state = fields.Selection([
        ('draft', 'Planning'),
        ('confirmed', 'Confirmed'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], string='Status', default='draft', required=True)

    # ── Sharing fields ───────────────────────────────────────────────────────
    is_public = fields.Boolean(
        string='Publicly Shared',
        default=False,
        help='When enabled, anyone with the share link can view this trip.'
    )
    share_token = fields.Char(
        string='Share Token',
        readonly=True,
        copy=False,          # Duplicated trips must NOT inherit a live share link
        index=True,
        help='Unique token used in the public share URL. Auto-generated on first share.'
    )

    @api.depends('start_date', 'end_date')
    def _compute_duration_days(self):
        for trip in self:
            if trip.start_date and trip.end_date:
                delta = (trip.end_date - trip.start_date).days + 1
                trip.duration_days = max(delta, 1)
            else:
                trip.duration_days = 0

    @api.depends('stop_ids')
    def _compute_destination_count(self):
        for trip in self:
            trip.destination_count = len(trip.stop_ids)

    @api.constrains('start_date', 'end_date')
    def _check_dates(self):
        for trip in self:
            if trip.start_date and trip.end_date and trip.end_date < trip.start_date:
                raise ValidationError(_('End Date cannot be earlier than Start Date.'))

    def action_view_itinerary(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_window',
            'name': _('Itinerary: %s') % self.name,
            'res_model': 'globetrotter.trip.stop',
            'view_mode': 'calendar,tree,form',
            'domain': [('trip_id', '=', self.id)],
            'context': {'default_trip_id': self.id},
        }

    def action_generate_share_link(self):
        """Enable public sharing for this trip.

        Generates a UUID share_token if one doesn't exist yet, sets
        is_public=True, then returns a client notification containing
        the public URL so the user can copy it immediately.
        """
        self.ensure_one()

        # Generate token only once — never overwrite an existing one
        # so that previously shared links keep working.
        if not self.share_token:
            self.share_token = str(uuid.uuid4())

        self.is_public = True

        # Build the absolute public URL using the configured base URL
        base_url = self.env['ir.config_parameter'].sudo().get_param(
            'web.base.url', default='http://localhost:8069'
        )
        public_url = f"{base_url}/trip/shared/{self.share_token}"

        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _('Trip Shared!'),
                'message': _('Public link: %s') % public_url,
                'sticky': True,
                'type': 'success',
            },
        }

    def action_disable_sharing(self):
        """Disable public sharing. The share_token is kept so the owner
        can re-enable sharing later with the same URL if they wish."""
        self.ensure_one()
        self.is_public = False
        return {
            'type': 'ir.actions.client',
            'tag': 'display_notification',
            'params': {
                'title': _('Sharing Disabled'),
                'message': _('The public link for "%s" is now inactive.') % self.name,
                'sticky': False,
                'type': 'warning',
            },
        }
