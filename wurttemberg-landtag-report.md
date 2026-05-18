# Württemberg Landtag Implementation Report

## Files changed
- `source/scenes/post_event.scene.dry`
- `source/scenes/events/wurttemberg_landtag_election.scene.dry`

## New Württemberg variables
- Date/scheduling: `wurttemberg_election_month`, `wurttemberg_election_year`, `wurttemberg_snap_election_called`, `wurttemberg_next_election_month_preview`, `wurttemberg_next_election_year_preview`
- Core government: `wurttemberg_government`, `wurttemberg_leader`, `wurttemberg_majority_cabinet`, `wurttemberg_current_government_name`, `wurttemberg_current_government_parties`, `wurttemberg_current_government_seats`, `wurttemberg_current_government_status`
- Election mechanics: `wurttemberg_parties`, `wurttemberg_party_weights`, `wurttemberg_landtag_seat_count`, `wurttemberg_landtag_total_seats`, `wurttemberg_landtag_seat_allocation_valid`
- DNVP split trackers: `wurttemberg_dnvp_pool_weighted_raw`, `wurttemberg_dnvp_split_csvd_share`, `wurttemberg_dnvp_split_wbwb_share`, `wurttemberg_dnvp_split_dnvp_share`
- Party vote/seat trackers for SPD, DDP, DVP, Z, KPD, DNVP, CSVD, WBWB, NSDAP, Other:
  - `wurttemberg_<party>_votes_raw`, `wurttemberg_<party>_votes`, `wurttemberg_<party>_votes_disp`, `wurttemberg_<party>_result_votes`
  - `wurttemberg_<party>_r`, `wurttemberg_<party>_seats`

## Württemberg vote-weight formula
- Base weighted pools:
  - `SPD = federal_spd * 0.77`
  - `DDP = federal_ddp * 1.90`
  - `DVP = federal_dvp * 0.63`
  - `Z = federal_z * 1.64`
  - `KPD = federal_kpd * 0.67`
  - `NSDAP = federal_nsdap * 0.71`
  - `DNVP_pool = federal_dnvp * 2.14`
  - `Other = federal_other * 1.00`
- Normalize all resulting party pools to 100% before seat allocation.

## DNVP/CSVD/WBWB split implementation
- `DNVP_pool` is split as:
  - `CSVD = DNVP_pool * (1/6)`
  - `WBWB = DNVP_pool * (4/6)`
  - `DNVP = DNVP_pool * (1/6)`
- These split values are included in normalization and D’Hondt seat allocation.

## Coalition options implemented
1. SPD-DDP
2. SPD-DDP-DVP
3. SPD-DDP-Z-DVP
4. DDP-Z-DVP
5. DDP-Z-DVP-WBWB
6. Z-DVP-WBWB-DNVP
7. Z-WBWB-DNVP
8. Z-WBWB-DNVP-CSVD
9. WBWB-DNVP-NSDAP

Selection rule:
- Majority threshold is 41/80.
- Coalition option is selectable when majority is reached.
- If none has majority, incumbent coalition remains selectable.

## Leader options implemented
- Wilhelm Keil (if SPD in coalition)
- Kurt Schumacher (if SPD in coalition)
- Eugen Bolz (if Z in coalition)
- Wilhelm Bazille (if DNVP in coalition)
- Reinhold Maier (if DDP in coalition)
- Johannes Hieber (if DDP in coalition)
- Christian Mergenthaler (if NSDAP in coalition)

## How to test Württemberg election cycle
1. Start/load game and ensure defaults initialize:
   - election date set to May 1928
   - seat count fixed at 80
2. Advance time to trigger the Württemberg election event.
3. Verify result table shows votes and seats for all listed Württemberg parties.
4. Verify coalition options only appear when eligible under majority/incumbent rules.
5. Select each coalition path and confirm leader menu exposes only valid leaders for that coalition composition.
6. Confirm normal election scheduling advances to same month, year +4.
7. Use snap-election action and confirm next election date resets to snap month/year +4.
