# Hamburg Bürgerschaft/Landtag Implementation Report

## Files changed

- `source/scenes/events/hamburg_landtag_election.scene.dry`
  - Adds the Hamburg Bürgerschaft election event, result screen, coalition menu, snap-election action, leader assignment choices, and confirmation screen.
- `source/scenes/election_algorithm.scene.dry`
  - Adds reusable Hamburg election calculation logic alongside existing Landtag calculations.
- `source/scenes/post_event.scene.dry`
  - Adds save-migration/default values for Hamburg trackers and runtime Hamburg election/coalition calculation functions.
- `source/scenes/root.scene.dry`
  - Adds startup/default Hamburg state values for the start menu and new games.
- `hamburg-landtag-report.md`
  - Documents the implementation and testing path.

## New Hamburg variables

Election-date and election-cycle trackers:

- `hamburg_election_month`
- `hamburg_election_year`
- `hamburg_snap_election_called`
- `hamburg_next_election_month_preview`
- `hamburg_next_election_year_preview`

Government and leader trackers:

- `hamburg_government`
- `hamburg_leader`
- `hamburg_majority_cabinet`
- `hamburg_current_government_name`
- `hamburg_current_government_parties`
- `hamburg_current_government_seats`
- `hamburg_current_government_status`
- `hamburg_majority_threshold`
- `hamburg_any_majority_coalition`
- `hamburg_leader_default`

Seat/vote trackers:

- `hamburg_landtag_seat_count`
- `hamburg_landtag_total_seats`
- `hamburg_landtag_seat_allocation_valid`
- `hamburg_parties`
- `hamburg_party_weights`
- Per-party vote, display, result, and seat variables for `spd`, `kpd`, `ddp`, `dvp`, `dnvp`, `z`, `nsdap`, and `wp`, using the existing pattern:
  - `hamburg_<party>_votes_raw`
  - `hamburg_<party>_votes`
  - `hamburg_<party>_votes_disp`
  - `hamburg_<party>_votes_display`
  - `hamburg_<party>_result_votes`
  - `hamburg_<party>_r`
  - `hamburg_<party>_seats`
  - `hamburg_<party>_seat_share_disp`

Coalition trackers use the existing Landtag pattern:

- `hamburg_<coalition_key>_coalition_name`
- `hamburg_<coalition_key>_coalition_parties`
- `hamburg_<coalition_key>_coalition_seats`
- `hamburg_<coalition_key>_coalition_majority`
- `hamburg_<coalition_key>_coalition_status`
- `hamburg_<coalition_key>_coalition_selectable`

## Hamburg vote-weight formula

Hamburg results are calculated from federal vote support:

1. Read each party’s federal raw vote share from `<party>_votes_raw`, falling back to `<party>_normalized * 100` if needed.
2. Multiply by the Hamburg party weight:
   - SPD: `1.27`
   - KPD: `1.45`
   - DDP: `3.00`
   - DVP: `1.40`
   - DNVP: `0.86`
   - Z: `0.11`
   - NSDAP: `0.80`
   - WP: `0.62`
3. Normalize weighted party totals back to a 100% Hamburg vote-share total.
4. Allocate `160` Bürgerschaft seats by D’Hondt through `window.allocateDhondtSeats`.
5. Store rounded display vote shares and integer seat totals on `hamburg_*` variables.

## Coalition options implemented

Hamburg majority threshold: `81` of `160` seats.

Implemented coalition options:

1. `SPD-KPD`
   - Parties: `SPD + KPD`
   - Government id: `1`
   - Key: `spd_kpd`
2. `Sole SPD`
   - Parties: `SPD`
   - Government id: `2`
   - Key: `sole_spd`
3. `SPD-DDP`
   - Parties: `SPD + DDP`
   - Government id: `3`
   - Key: `spd_ddp`
4. `SPD-DDP-DVP`
   - Parties: `SPD + DDP + DVP`
   - Government id: `4`
   - Key: `spd_ddp_dvp`
5. `DDP-DNVP-WP-DVP`
   - Parties: `DDP + DNVP + WP + DVP`
   - Government id: `5`
   - Key: `ddp_dnvp_wp_dvp`

Selection rule:

- A coalition is selectable if its seat total is at least `81`.
- If no listed coalition has a majority, only the incumbent `hamburg_government` option is selectable as a minority/caretaker continuation.

## Leader options implemented

Leader priority follows the requested order:

1. `Rudolf Ross` when the selected coalition includes the SPD.
2. `Carl Wilhelm Petersen` when the selected coalition includes the DDP and does not include the SPD.
3. `Walther Dauch` as the DVP fallback when a DVP coalition without SPD or DDP is added or reached by future Hamburg logic.

Current implemented coalition IDs mean:

- `Rudolf Ross` is available for coalition IDs `1`, `2`, `3`, and `4`.
- `Carl Wilhelm Petersen` is available for coalition ID `5`.
- `Walther Dauch` is included as a fallback leader branch for a DVP/non-SPD/non-DDP Hamburg government state.

Every leader branch sets `hamburg_leader`.

## Election date tracking

Initial Hamburg election date:

- `hamburg_election_month = 10`
- `hamburg_election_year = 1927`

Regular election behavior:

- On event departure, if `hamburg_snap_election_called == 0`, the next election year becomes `hamburg_election_year + 4` and the month remains the current scheduled month.

Snap election behavior:

- The Hamburg results screen includes `Call new Hamburg Bürgerschaft elections.`
- This sets:
  - `hamburg_election_year = year`
  - `hamburg_election_month = month`
  - `hamburg_snap_election_called = 1`
- On event departure, snap elections schedule the next Hamburg election for `year + 4` and retain the snap-election month.

## How to test the Hamburg election cycle

1. Start or load a game and advance to October 1927.
2. Confirm that the Hamburg Bürgerschaft election event appears when:
   - `year = hamburg_election_year` and `month >= hamburg_election_month`, or
   - `year > hamburg_election_year`.
3. On the result screen, verify:
   - Hamburg vote shares display for SPD, KPD, DDP, DVP, DNVP, Z, NSDAP, and WP.
   - Hamburg seat totals sum to `160`.
   - The next-election preview shows four years after the current scheduled election or snap-election date.
4. Select each visible coalition option and verify:
   - Majority coalitions are selectable.
   - Minority coalitions are not selectable unless no majority coalition exists and that option is the incumbent.
   - Coalition seat totals and majority/minority labels update.
5. Select leaders and verify:
   - SPD coalitions set `hamburg_leader = "Rudolf Ross"`.
   - The DDP-led non-SPD coalition sets `hamburg_leader = "Carl Wilhelm Petersen"`.
6. Use `Call new Hamburg Bürgerschaft elections.` and verify:
   - The current month/year become the snap-election base date.
   - After departure, the next Hamburg election is scheduled four years after the snap election.
