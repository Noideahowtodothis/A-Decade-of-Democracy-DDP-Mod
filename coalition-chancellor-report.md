# Coalition Chancellor Report

## Removed old coalition options

The post-election coalition entry point now sends the player to the negotiated coalition flow only. The old preset coalition choices are no longer offered from that screen:

- Weimar Coalition
- Grand Coalition
- New Grand Coalition
- Bourgeois/center-right arrangements
- Right-wing Coalition
- Popular Front
- Unity/Far-right/legacy no-majority shortcuts

The coalition formation screen now shows the negotiated coalition state instead: current coalition parties, seat total out of 500, the 251-seat majority threshold, negotiable parties with seat counts, and the Form Government button once the coalition reaches 251 seats.

## Chancellor candidates implemented

After forming a majority negotiated coalition, the player now chooses a Chancellor before selecting ministries.

Implemented candidates:

- SPD in coalition:
  - Otto Braun
  - Otto Wels
  - Hermann Müller, only before March 1931
  - Rudolf Breitscheid
- Z in coalition:
  - Heinrich Brüning
- DVP in coalition and SPD not in coalition:
  - Hans Luther
- DDP in coalition and DDP has over 10% of coalition seat share:
  - Hermann Dietrich
  - Theodor Heuss

Unavailable candidates remain visible but disabled with a short requirement reason.

## Variables set by Chancellor selection

Selecting a Chancellor sets:

- `chancellor`
- `chancellor_party`

DDP Chancellor selections use the current `ddp_name` value for `chancellor_party`; other selections use the existing party labels (`SPD`, `Z`, `DVP`).

## How to test the flow

1. Trigger a Reichstag election.
2. On the post-election screen, continue to coalition formation.
3. Confirm that only the negotiated coalition flow is offered from the coalition menu.
4. Add negotiable parties until the coalition reaches at least 251 of 500 seats.
5. Confirm that Form Government appears only once the coalition has at least 251 seats.
6. Select Form Government.
7. Confirm that the Chancellor selection screen appears before ministry selection.
8. Confirm candidate availability matches coalition membership and date rules.
9. Select a Chancellor and confirm that the following ministry selection screen shows the selected Chancellor and DDP ministry picks.
