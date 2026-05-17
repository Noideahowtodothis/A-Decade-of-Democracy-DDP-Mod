# Startup State Debug Report

## What was broken

The HTML build renders the status/sidebar before the player presses **Start game**. After the recent variable and party-refactor work, the root scene had no display-safe initial state before it routed to the start menu. As a result, sidebar expressions were reading unset qualities and Dendry displayed unset numeric/string values as default fallbacks such as `0` or `o`.

The visible symptoms matched missing qualities rather than bad formatting:

- `Resources available` read an unset `resources` quality.
- `President`, `Chancellor`, and `Chancellor party` read unset government qualities.
- Reichstag composition entries read unset `*_r_disp` result-display qualities.
- `Next election` read unset `next_election_month` / `next_election_year` qualities.
- Poll/status tabs also had no safe startup values for the newly split BVP/WP vote-display qualities or the refactored political/faction meters.

## Variables that needed pre-start defaults

The fix adds a root-scene startup baseline that is safe for the start menu but does **not** mark the game as started. It initializes the sidebar-visible initial state before the first screen:

- Basic game clock/resources: `time`, `year`, `month`, `month_actions`, `resources`, `dues`.
- Government display: `president`, `chancellor`, `chancellor_party`.
- Government/coalition flags: `spd_in_government`, party government flags, `spd_toleration`, `spd_caretaker`, named coalition flags, coalition member flags, and coalition dissent counters.
- Election date: `next_election_year`, `next_election_month`, `next_election_time`, `n_elections`.
- Reichstag/result display: all initial `*_r`, `old_*_r`, `*_result_votes`, `*_r_disp`, `*_seat_share_disp`, `*_votes`, `*_votes_disp`, and `*_votes_display` values for `SPD`, `KPD`, `Z`, `BVP`, `DDP`, `DVP`, `WP`, `DNVP`, `NSDAP`, `Other`, and `SAPD`.
- Poll demographics: startup class vote values and normalized display values for BVP and WP alongside the existing parties.
- Refactor/new-variable defaults: `presidential_anger`, `pacifism`, `secularism`, `federalism`, `elite_support`, DDP faction variables, deprecated SPD faction compatibility variables, and simplified `DVP`/`DNVP`/`SPD` left-right variables.

## Files fixed

- `source/scenes/root.scene.dry`
  - Added an idempotent root `on-arrival` startup-state default block for sidebar/status variables before the start menu renders.
  - Fixed `coalition_total_seats` so the real game start no longer initializes it from `Q.ddp_r` before `Q.ddp_r` exists. It now resolves to the DDP starting Reichstag share once the Reichstag variables have been initialized.

- `out/html/core.js`
  - Rebuilt generated HTML/JS output with `npm run dendrynexus make-html -- --pretty`.

## How to verify in the browser

1. Open `out/html/index.html` in a browser.
2. Before pressing **Start game**, inspect the status/sidebar.
3. Confirm it shows initialized values instead of `0`/`o` fallbacks:
   - `Resources available: 2`
   - `President: Hindenburg`
   - `Chancellor: Marx (Z)`
   - Reichstag composition includes nonzero initial values such as `SPD: 26.0%`, `Z: 14.0%`, `BVP: 3.0%`, `WP: 4.0%`, `Other: 5.0%`
   - `Next election: May 1928`
4. Press **Start game** and confirm the same initial state remains visible on the regular game screen.
5. Open the polls/status tabs and confirm BVP/WP and the new political/faction variables render with initialized values instead of fallback defaults.
