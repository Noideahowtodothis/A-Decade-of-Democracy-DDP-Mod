# Bremen Landtag/Bürgerschaft System Report

## Files changed

- `source/scenes/events/bremen_landtag_election.scene.dry` — new Bremen Bürgerschaft election event, results display, coalition selection, snap election entry point, leader selection, and confirmation page.
- `source/scenes/post_event.scene.dry` — save/default migration values and runtime JavaScript helpers for Bremen vote weighting, D’Hondt seat allocation, and coalition status/selectability.
- `source/scenes/root.scene.dry` — startup/default Bremen state trackers.
- `out/game.json` — regenerated game bundle from `npm run build`.

## New Bremen variables

Core election/date and chamber trackers:

- `bremen_election_month`
- `bremen_election_year`
- `bremen_landtag_seat_count`
- `bremen_landtag_total_seats`
- `bremen_landtag_seat_allocation_valid`
- `bremen_next_election_month_preview`
- `bremen_next_election_year_preview`
- `bremen_snap_election_called`

Government trackers:

- `bremen_government`
- `bremen_leader`
- `bremen_majority_cabinet`
- `bremen_current_government_name`
- `bremen_current_government_parties`
- `bremen_current_government_seats`
- `bremen_current_government_status`
- `bremen_majority_threshold`
- `bremen_any_majority_coalition`

Party/vote/seat trackers:

- `bremen_parties`
- `bremen_party_weights`
- `bremen_hausbesitzer_party_name`
- `bremen_dvp_other_votes_base_raw`
- `bremen_dvp_other_votes_weighted_raw`
- `bremen_dvp_other_split_dvp_share`
- `bremen_dvp_other_split_hausbesitzer_share`
- Per-party Bremen vote and seat variables for `spd`, `kpd`, `ddp`, `z`, `dvp`, `hausbesitzer`, `dnvp`, and `nsdap`, using the existing Landtag naming pattern: `bremen_<party>_votes_raw`, `bremen_<party>_votes`, `bremen_<party>_votes_disp`, `bremen_<party>_votes_display`, `bremen_<party>_result_votes`, `bremen_<party>_r`, `bremen_<party>_seats`, and `bremen_<party>_seat_share_disp`.

Coalition trackers:

- `bremen_sole_spd_coalition_*`
- `bremen_spd_kpd_coalition_*`
- `bremen_spd_ddp_coalition_*`
- `bremen_spd_ddp_dvp_coalition_*`
- `bremen_dvp_dnvp_ddp_hausbesitzer_coalition_*`

Each coalition gets `_name`, `_parties`, `_seats`, `_majority`, `_status`, and `_selectable` values.

## Bremen vote-weight formula

Bremen uses federal support as its input. For each party, the helper first reads `<party>_votes_raw`; if that is unavailable, it falls back to `100 * <party>_normalized`. Invalid or negative values are treated as zero.

Weights implemented:

- SPD: `federal SPD share * 1.42`
- DNVP: `federal DNVP share * 0.65`
- DDP: `federal DDP share * 1.93`
- KPD: `federal KPD share * 0.78`
- Zentrum: `federal Z share * 0.17`
- NSDAP: `federal NSDAP share * 0.80`
- DVP/Other pool: `(federal DVP share + federal Other share) * 3.00`

After weighting and the DVP/Other/Hausbesitzer split, all Bremen party shares are normalized to sum to 100 before D’Hondt allocation.

## DVP/Other/Hausbesitzer split implementation

The DVP and Other federal vote shares are combined before weighting:

```text
combinedDvpOtherBase = federalShare('dvp') + federalShare('other')
combinedDvpOtherWeighted = combinedDvpOtherBase * 3.00
```

The weighted combined pool is then split:

```text
bremen_dvp = combinedDvpOtherWeighted * 0.75
bremen_hausbesitzer = combinedDvpOtherWeighted * 0.25
```

The Hausbesitzer Party is Bremen-only: it is included in `bremen_parties` and Bremen vote/seat variables, but it is not added to the national `parties` list.

## Coalition options implemented

Bremen majority threshold: 61 of 120 seats.

Implemented options:

1. `Sole SPD` — SPD.
2. `SPD-KPD` — SPD + KPD.
3. `SPD-DDP` — SPD + DDP.
4. `SPD-DDP-DVP` — SPD + DDP + DVP.
5. `DVP-DNVP-DDP-Hausbesitzer` — DVP + DNVP + DDP + Hausbesitzer.

Coalitions are selectable if they have at least 61 seats. If no listed coalition has a majority, the incumbent `bremen_government` is selectable as a minority cabinet.

## Leader options implemented

Leader selection follows the requested priority:

1. Wilhelm Kaisen when SPD is present in the Bremen coalition.
2. Theodor Spitta when DDP is present and SPD is absent.
3. Martin Donandt as a fallback for a Bremen cabinet without SPD or DDP.

For the implemented coalition list, all SPD coalitions offer Wilhelm Kaisen and the non-SPD DDP/Hausbesitzer coalition offers Theodor Spitta.

## Election date tracking

Initial Bremen election date:

- November 1927 (`bremen_election_month = 11`, `bremen_election_year = 1927`).

After a regular election, the event advances the existing Bremen election date tracker by four years, preserving the scheduled month. This means the initial November 1927 tracker advances to November 1931 even if the overdue event is resolved after game start. The snap-election button sets the Bremen election date to the current month/year, marks `bremen_snap_election_called = 1`, immediately runs a new election, and then schedules the next Bremen election four years after that snap election month/year.

## How to test the Bremen election cycle

1. Run `npm run build` to compile the `.scene.dry` files.
2. Start a new game or load a save that has passed through `post_event` so Bremen defaults are initialized.
3. Advance to November 1927 or any later month with `bremen_election_year = 1927` and `bremen_election_month = 11`.
4. Confirm the Bremen Bürgerschaft election event appears.
5. Select `Count the votes` and verify:
   - Bremen vote shares are displayed.
   - Bremen seats total 120.
   - Hausbesitzer appears as a Bremen-only party.
   - DVP and Other are not weighted separately for Bremen; they are combined, weighted, and split.
6. Verify only majority coalitions are selectable unless no listed coalition has a majority, in which case the incumbent is selectable.
7. Select a coalition and verify leader options:
   - Any SPD coalition should route to Wilhelm Kaisen.
   - The DVP-DNVP-DDP-Hausbesitzer coalition should route to Theodor Spitta.
8. Confirm the government and verify the next Bremen election preview is four years after the scheduled Bremen election date for regular elections.
9. Use `Call new Bremen Bürgerschaft elections` from the coalition page and verify the next election preview is four years after the snap election month/year.
