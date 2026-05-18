# Bavaria Landtag Implementation Report

## Files changed

- `source/scenes/events/bavarian_landtag_election.scene.dry`
  - Adds the Bavarian Landtag election event, results display, coalition picker, snap-election action, leader picker, government confirmation, and next-election preview.
- `source/scenes/election_algorithm.scene.dry`
  - Adds reusable Bavarian Landtag vote weighting, normalization, D’Hondt seat allocation, and coalition option calculation alongside the existing Prussian helper pattern.
- `source/scenes/post_event.scene.dry`
  - Adds save/default migration values for Bavarian election and government trackers and registers the Bavarian helper functions for ongoing saves.
- `source/scenes/root.scene.dry`
  - Adds new-game default Bavarian election/government trackers.

## New Bavarian variables

### Election date and chamber state

- `bavaria_election_month`
- `bavaria_election_year`
- `bavaria_landtag_seat_count` (forced to `128`)
- `bavaria_landtag_total_seats`
- `bavaria_landtag_seat_allocation_valid`
- `bavaria_majority_threshold`
- `bavaria_next_election_month_preview`
- `bavaria_next_election_year_preview`

### Government and leader state

- `bavaria_government`
- `bavaria_leader`
- `bavaria_majority_cabinet`
- `bavaria_current_government_name`
- `bavaria_current_government_parties`
- `bavaria_current_government_seats`
- `bavaria_current_government_status`
- `bavaria_any_majority_coalition`

### Local party/list variables

- `bavaria_parties`
- `bavaria_peasant_party_name`
- `bavaria_party_weights`

### Vote and seat variables

For each Bavarian Landtag party key (`spd`, `kpd`, `bvp_z`, `ddp`, `dvp`, `dnvp`, `nsdap`, `peasant`, `other`):

- `bavaria_<party>_votes_raw`
- `bavaria_<party>_votes`
- `bavaria_<party>_votes_disp`
- `bavaria_<party>_votes_display`
- `bavaria_<party>_result_votes`
- `bavaria_<party>_r`
- `bavaria_<party>_seats`
- `bavaria_<party>_seat_share_disp`

### Coalition variables

For each coalition key (`traffic_light`, `bvp_peasant_dnvp`, `bvp_dnvp`, `bvp_ddp_peasant`):

- `bavaria_<coalition>_coalition_name`
- `bavaria_<coalition>_coalition_parties`
- `bavaria_<coalition>_coalition_seats`
- `bavaria_<coalition>_coalition_majority`
- `bavaria_<coalition>_coalition_status`
- `bavaria_<coalition>_coalition_selectable`

## Bavarian vote-weight formula

The Bavarian calculation starts from the existing federal party vote shares, then builds a Bavaria-only party list before normalization:

- `SPD`: `spd_votes_raw * 0.77`
- `KPD`: `kpd_votes_raw * 0.76`
- `BVP/Z combined`: `(z_votes_raw + bvp_votes_raw) * 2.67`
- `DDP`: `ddp_votes_raw * 0.47`
- `DVP`: `dvp_votes_raw * 0.578`
- `DNVP`: `dnvp_votes_raw * 0.545`
- `NSDAP`: `nsdap_votes_raw * 0.834`
- `Bavarian Peasant Party`: `other_votes_raw * 0.016`
- `Other`: `other_votes_raw * 0.984`

The weighted Bavarian values are normalized to 100% after the BVP/Z combination and after splitting the Bavarian Peasant Party out of the national `other` vote. Seats are then allocated with D’Hondt for the fixed 128-seat Bavarian Landtag; the helper forces `bavaria_landtag_seat_count` to `128` so older saves or debug states cannot accidentally allocate a different chamber size.

## Coalition options implemented

- `Traffic Light`: `DDP + Peasant + SPD`
- `BVP-Peasant-DNVP`: `BVP/Z + Peasant + DNVP`
- `BVP-DNVP`: `BVP/Z + DNVP`
- `BVP-DDP-Peasant`: `BVP/Z + DDP + Peasant`

Coalitions require at least 65 of 128 seats to be selectable. If no listed coalition has a majority, the incumbent `bavaria_government` option is selectable as a minority cabinet.

## Leader options implemented

- `Kurt Vogel`
  - Available when SPD is in the Bavarian cabinet.
- `Heinrich Held`
  - Available when the combined BVP/Z list is in the Bavarian cabinet.

Selecting a leader sets `bavaria_leader`.

## How to test the Bavarian election cycle

1. Start or load a game before April 1928.
2. Advance to April 1928.
3. Confirm the Bavarian Landtag event appears.
4. Click `Count the votes`.
5. Verify the results page displays:
   - Bavarian vote shares.
   - Bavarian seats out of 128.
   - Coalition seats and majority/minority status.
   - Next election preview four years later.
6. Select any majority coalition. If no coalition has a majority, verify only the incumbent coalition is additionally selectable as a minority cabinet.
7. Select an available leader:
   - `Kurt Vogel` for SPD-containing cabinets.
   - `Heinrich Held` for BVP/Z-containing cabinets.
8. Continue and verify `bavaria_election_year` advances four years while `bavaria_election_month` stays on the election month.
9. To test a snap election, use `Call new Bavarian Landtag elections` from the Bavarian coalition screen and verify the recalculated election sets the following election to four years after the snap-election month/year.
10. Run `npm run build` to confirm source compilation.
