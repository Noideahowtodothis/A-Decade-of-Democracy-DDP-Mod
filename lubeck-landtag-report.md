# Lübeck Landtag/Bürgerschaft Implementation Report

## Files changed
- `source/scenes/post_event.scene.dry`
- `source/scenes/events/lubeck_landtag_election.scene.dry`

## New Lübeck variables
- Election timing: `lubeck_election_month`, `lubeck_election_year`, `lubeck_snap_election_called`, `lubeck_next_election_month_preview`, `lubeck_next_election_year_preview`
  - Initial regular election baseline is set to **November 1927**.
- Legislature configuration: `lubeck_landtag_seat_count`, `lubeck_landtag_total_seats`, `lubeck_landtag_seat_allocation_valid`, `lubeck_parties`, `lubeck_party_weights`
- Vote trackers: `lubeck_{party}_votes_raw`, `lubeck_{party}_votes`, `lubeck_{party}_votes_disp`, `lubeck_{party}_result_votes`
- Seat trackers: `lubeck_{party}_r`, `lubeck_{party}_seats`
- Government trackers: `lubeck_government`, `lubeck_leader`, `lubeck_majority_cabinet`, `lubeck_current_government_name`, `lubeck_current_government_parties`, `lubeck_current_government_seats`, `lubeck_current_government_status`
- Coalition trackers: `lubeck_{coalition}_coalition_seats`, `lubeck_{coalition}_coalition_status`, `lubeck_{coalition}_coalition_selectable`
- Membership trackers: `lubeck_spd_in_government`, `lubeck_ddp_in_government`, `lubeck_dvp_in_government`, `lubeck_hvb_in_government`, `lubeck_nsdap_in_government`

## Lübeck vote-weight formula
1. Read federal vote shares (`*_votes_raw`, fallback to `*_normalized`).
2. Apply Lübeck party multipliers:
   - SPD 1.67
   - KPD 0.80
   - NSDAP 0.78
   - DNVP 0.65
   - DVP 0.52
   - DDP 0.32
   - HVB 6.00 (using `other` as the source bloc)
   - Z 0.00 (forced not running)
   - Other 1.00 (retained for display/applicability)
3. Normalize all weighted values to 100%.
4. Allocate 80 seats with D’Hondt.

## HVB implementation
- Added Lübeck-only party key `hvb`.
- Added display name `Hanseatischer Volksbund`.
- Built HVB weighted votes from the existing federal `other` bloc (`other * 6.00`).
- Included HVB in normalization, D’Hondt seat allocation, seat/vote trackers, and coalition arithmetic.

## Coalition options implemented
1. SPD-DDP
2. SPD-DDP-DVP
3. DDP-DVP-HVB
4. DDP-DVP-DNVP-HVB
5. DVP-DNVP-NSDAP

Rules implemented:
- Majority threshold set to 41/80.
- Coalitions selectable only with majority, unless no majority exists for any listed coalition, in which case incumbent remains selectable.

## Leader options implemented
Selectable when valid:
- Paul Löwigt (SPD present)
- Otto-Heinrich Drechsler (NSDAP present)
- Carl Heinsohn (DVP with SPD)
- Hans Ewers (DVP without SPD)
- Johann Martin Andreas Neumann (HVB before 1928)
- Rudolf Keibel (HVB from 1928 onward)
- Heinrich Eckholdt (DDP present)

Priority fallback applied on confirmation:
1. Otto-Heinrich Drechsler if NSDAP
2. Paul Löwigt if SPD
3. Johann Martin Andreas Neumann if HVB and before 1928
4. Rudolf Keibel if HVB and 1928+
5. Carl Heinsohn if DVP with SPD
6. Hans Ewers if DVP without SPD
7. Heinrich Eckholdt if DDP

## How to test the Lübeck election cycle
1. Start a game and advance to `lubeck_election_month` / `lubeck_election_year`.
2. Open the Lübeck election event and run vote counting.
3. Verify:
   - Vote share table includes SPD/KPD/DDP/DVP/DNVP/NSDAP/HVB/Z/Other.
   - Z is always 0 votes and 0 seats.
   - Total seats equal 80.
4. Test coalition gating:
   - Select only majority coalition options.
   - If no majority options exist, verify incumbent option remains available.
5. Test leader options by coalition composition and year (<1928 and >=1928 for HVB).
6. Confirm next election preview is 4 years later after regular election.
7. Trigger “Call new Lübeck elections” and confirm next election preview resets to 4 years after snap election month/year.
