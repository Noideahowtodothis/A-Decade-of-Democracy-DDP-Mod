# Thuringia Landtag Implementation Report

## Files changed
- source/scenes/events/thuringia_landtag_election.scene.dry
- source/scenes/election_algorithm.scene.dry
- source/scenes/root.scene.dry

## New Thuringia variables
- thuringia_election_month, thuringia_election_year, thuringia_snap_election_called
- thuringia_landtag_seat_count, thuringia_landtag_total_seats, thuringia_landtag_seat_allocation_valid
- thuringia_government, thuringia_leader, thuringia_majority_cabinet
- thuringia_landbund_party_name
- thuringia_<party>_votes_raw/votes/votes_disp and thuringia_<party>_r for: spd, kpd, ddp, dvp, dnvp, landbund, nsdap, wp, z, other
- coalition trackers for all listed options plus thuringia_current_government_* and party-in-government flags

## Thuringia vote-weight formula
- Federal vote input per party is multiplied by Thuringia weights:
  - SPD 1.10, KPD 1.32, DDP 1.00, DVP 1.34, NSDAP 1.26, WP 1.76, Z 0.11, Other 1.00
- DNVP is handled through combined pool logic (see below)
- Weighted totals are normalized to percentage shares before seat allocation

## DNVP/Landbund split implementation
- DNVP+Landbund pool uses federal DNVP vote * 1.45
- Landbund gets 75% of that weighted pool
- DNVP gets 25% of that weighted pool

## 1927 DNVP + DVP + Landbund combination implementation
- If election date is January 1927 (year == 1927 and month == 1):
  - DNVP share absorbs DVP and Landbund shares
  - DVP share set to 0
  - Landbund share set to 0
- This is applied for election/result seat calculation behavior.

## Coalition options implemented
1. SPD-KPD
2. Sole SPD
3. SPD-DDP
4. SPD-DDP-DVP
5. DDP-DVP-DNVP-Landbund
6. DDP-DVP-DNVP-Landbund-NSDAP
7. DVP-DNVP-Landbund-NSDAP

Rules implemented:
- Majority threshold fixed to 29/56
- Coalition selectable only with majority
- If no coalition has majority, incumbent can be retained
- Snap election action available

## Leader options implemented
- August Frölich (SPD present and DVP absent)
- Arnold Paulssen (DDP present)
- Richard Leutheußer (DVP present)
- Erwin Baum (SPD absent)
- Wilhelm Frick (NSDAP present)

## How to test the Thuringia election cycle
1. Start a new game and advance to January 1927.
2. Open Thuringia Landtag election event.
3. Confirm displayed vote shares, seat totals out of 56, and coalition seat statuses.
4. Verify January 1927 special DNVP+DVP+Landbund behavior (DVP/Landbund seats should collapse into DNVP).
5. Select different coalitions and verify leader options shown by party-presence rules.
6. Trigger “Call new Thuringia Landtag elections.” and verify next election preview updates to four years from snap election date.
7. For normal elections (without snap), verify next election date remains on the four-year cycle.
