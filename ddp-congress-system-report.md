# DDP Congress System Report

## Files changed

- `source/scenes/events/ddp_congress.scene.dry` — new event scene and issue/category screens for the DDP party congress.
- `source/scenes/root.scene.dry` — default state/registry additions for DDP ideology, congress dates, and faction dissent.
- `source/scenes/post_event.scene.dry` — save/load migration, defaults, registry insertion, and clamping for DDP ideology and DDP faction dissent.
- `source/scenes/status.scene.dry` — new `status.ddp_ideology` status section with readable labels and faction dissent display.
- `out/html/index.html` — adds Culture and DDP Ideology sidebar tab buttons.
- `source/qdisplays/ddp_nationalism_position.qdisplay.dry` — readable labels for DDP nationalism position codes.
- `source/qdisplays/ddp_economic_position.qdisplay.dry` — readable labels for DDP economic position codes.
- `source/qdisplays/ddp_republic_position.qdisplay.dry` — readable labels for DDP republic position codes.
- `source/qdisplays/ddp_federalism_position.qdisplay.dry` — readable labels for DDP federalism position codes.
- `source/qdisplays/ddp_leader_position.qdisplay.dry` — readable labels for DDP leader codes.

## New variables

### DDP ideology/state variables

- `ddp_nationalism_position` — numeric DDP nationalism code, default `0`.
- `ddp_economic_position` — numeric DDP economics code, default `0`.
- `ddp_republic_position` — numeric DDP republic code, default `0`.
- `ddp_federalism_position` — numeric DDP federalism code, default `0`.
- `ddp_leader` — numeric DDP leader code, default `0`.

### DDP faction dissent variables

- `ddp_left_progressive_dissent` — default `0`, clamped `0–100`.
- `ddp_laborist_dissent` — default `0`, clamped `0–100`.
- `ddp_left_liberal_dissent` — default `0`, clamped `0–100`.
- `ddp_left_bourgeois_dissent` — default `0`, clamped `0–100`.
- `ddp_regionalist_dissent` — default `0`, clamped `0–100`.

### Registry/helper variables

- `ddp_ideology_variables` — list of DDP ideology/state variables.
- `ddp_faction_dissent_variables` — list of DDP faction dissent variables.
- `ddp_congress_dates` — list of congress date codes.
- `ddp_congress_YYYY_MM_done` flags — one-shot flags for each congress date after it fires.
- `ddp_congress_*_support`, `ddp_congress_*_oppose`, `ddp_congress_*_available`, and `ddp_congress_*_debug` — temporary calculated congress voting/debug values.

## Congress trigger dates

The congress event is eligible once on these month/year combinations:

- December 1925 (`1925-12`)
- April 1927 (`1927-04`)
- October 1929 (`1929-10`)
- March 1931 (`1931-03`)
- August 1933 (`1933-08`)

The current default game starts in January 1928, so the 1925 and 1927 congresses only matter for alternate/custom starts or loaded states that reach those dates.

## Delegate strength calculation

- The congress uses the five current DDP faction strength variables:
  - `ddp_left_progressive`
  - `ddp_laborist`
  - `ddp_left_liberal`
  - `ddp_left_bourgeois`
  - `ddp_regionalist`
- If the total faction strength is above `0`, each faction receives delegates equal to:
  - `100 * faction strength / total DDP faction strength`
- If all faction strengths are `0`, the scene uses a temporary equal fallback:
  - `20` delegates for each faction.
- Policy support totals are the sum of supporting faction delegates.
- Policy opposition totals are the sum of opposing faction delegates.
- Neutral factions do not count for either side.
- A policy can be adopted only if support delegates are greater than opposition delegates.

## Adoption effects

- Adopting a policy sets the relevant DDP ideology/state code.
- Supporting factions lose `2` dissent, clamped at `0`.
- Opposing factions gain `5` dissent, clamped at `100`.
- Neutral factions are unchanged.
- No other gameplay effects are currently applied.

## How to test in game

1. Build from source so the new DDP congress scene and qdisplays are included in the playable output.
2. Start or load a game before one of the trigger dates.
3. Advance into a trigger month, for example October 1929.
4. When the event deck appears, select `DDP Party Congress`.
5. Confirm that the overview lists delegates for all five DDP factions.
6. Open each issue category and confirm that every option shows support, opposition, and available/blocked debug text.
7. Adopt an available position.
8. Confirm that the current adopted position changes and supporting/opposing faction dissent changes.
9. Open the sidebar `DDP Ideology` tab and confirm readable labels are shown for all adopted DDP positions.

## Unresolved TODOs

- The system currently uses an equal delegate fallback when all DDP faction strengths are zero. Future DDP faction mechanics should provide nonzero faction strength values during normal play.
- The system only changes DDP ideology variables and faction dissent. It intentionally does not yet change votes, relations, culture, economics, or election logic.
- The existing DDP party leader/ideology placeholder trackers still exist elsewhere; this implementation uses `ddp_leader` for the congress leader code as requested.
- The sidebar HTML is updated, but generated playable bundles should be rebuilt by the normal project build process when generated outputs are desired.
