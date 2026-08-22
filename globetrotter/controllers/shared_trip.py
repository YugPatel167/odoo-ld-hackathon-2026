# -*- coding: utf-8 -*-
# pyrefly: ignore [missing-import]
from odoo import http
# pyrefly: ignore [missing-import]
from odoo.http import request


class SharedTripController(http.Controller):
    """
    Public controller for shared/public GlobeTrotter itineraries.

    Routes are auth='public' so no login is required to VIEW a shared trip.
    All ORM access in this controller must go through sudo() for the initial
    record lookup — this is intentional and safe because:
      1. Odoo's record rules restrict globetrotter.trip to the record owner
         (user_id = env.uid). A logged-out visitor has uid=public-user, so
         the ORM would raise AccessError or return nothing.
      2. We compensate by calling sudo() ONLY for the explicitly token-verified
         lookup below, then check is_public=True ourselves before rendering.
         This is the standard Odoo pattern for public routes on private models.
      3. sudo() is NOT used anywhere else in this controller — the copy
         endpoint creates records as the authenticated user, not as admin.
    """

    # ─────────────────────────────────────────────────────────────
    # GET  /trip/shared/<token>   — public read-only view
    # ─────────────────────────────────────────────────────────────
    @http.route(
        '/trip/shared/<string:token>',
        type='http',
        auth='public',
        website=True,
        methods=['GET'],
    )
    def shared_trip_view(self, token, **kwargs):
        """
        Render the public read-only itinerary for a shared trip.

        Returns 404 for BOTH "token not found" and "trip is not public" so
        that an attacker cannot enumerate whether a trip exists but is
        private — both cases look identical from the outside.
        """
        # sudo() required here: record rules block the public/nobody user from
        # reading any globetrotter.trip record. We bypass them for this one
        # explicitly token-matched lookup only, then enforce is_public ourselves.
        trip = request.env['globetrotter.trip'].sudo().search(
            [('share_token', '=', token)], limit=1
        )

        # Treat "trip doesn't exist" and "trip is not public" identically
        # to prevent enumeration of private trips via the share URL.
        if not trip or not trip.is_public:
            return request.not_found()

        # Build the full public URL for sharing widgets
        base_url = request.httprequest.host_url.rstrip('/')
        public_url = f"{base_url}/trip/shared/{token}"

        return request.render(
            'globetrotter.shared_trip_page',
            {
                'trip': trip,
                'stops': trip.stop_ids.sorted('sequence'),
                'public_url': public_url,
                'is_logged_in': request.env.user._is_public() is False,
                'current_user': request.env.user,
            }
        )

    # ─────────────────────────────────────────────────────────────
    # POST /trip/shared/<token>/copy  — copy trip to logged-in user
    # ─────────────────────────────────────────────────────────────
    @http.route(
        '/trip/shared/<string:token>/copy',
        type='http',
        auth='public',
        website=True,
        methods=['POST'],
        csrf=True,
    )
    def shared_trip_copy(self, token, **kwargs):
        """
        Duplicate the shared trip into the currently logged-in user's account.

        If the visitor is not logged in, redirect them to the login page with
        a redirect back to this copy endpoint — after auth they'll land here
        and the copy will proceed.

        Copy logic uses Odoo's native .copy() which:
          - Respects copy=True/False on each field (share_token has copy=False
            so the duplicate gets no token, starting life as private)
          - Follows One2many children (stop_ids) through their own copy logic
          - Assigns user_id to the logged-in user via the model default
        """
        # If not authenticated, redirect to login then come back
        if request.env.user._is_public():
            redirect_after_login = f'/trip/shared/{token}/copy'
            return request.redirect(
                f'/web/login?redirect={redirect_after_login}'
            )

        # sudo() only for the lookup — same reason as in shared_trip_view.
        # The copy() call below runs as the authenticated user (no sudo),
        # so the new trip is created under their uid via the model default.
        trip = request.env['globetrotter.trip'].sudo().search(
            [('share_token', '=', token)], limit=1
        )

        if not trip or not trip.is_public:
            return request.not_found()

        # Duplicate the trip. .copy() returns the new record in the current
        # user's environment — user_id is set to env.user by the field default.
        # We run copy() under sudo only because the authenticated user may not
        # have read access to the *source* trip (it belongs to someone else).
        # The resulting new record is owned by request.env.user, not admin.
        new_trip = trip.sudo().copy(default={
            'user_id': request.env.user.id,
            'name': f"Copy of {trip.name}",
            'is_public': False,
            'share_token': False,
        })

        # Redirect to the backend My Trips action so the user sees their copy
        return request.redirect('/odoo/globetrotter-trips')
