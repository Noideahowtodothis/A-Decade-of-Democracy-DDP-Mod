# Refactor Audit: Variable and Election Consistency

## Checks passed

- `presidential_anger` is initialized, has a quality definition, is clamped in post-event validation, appears in the library/debug display, and is included in root state/debug/audit registries.
- The standardized culture variables (`pro_republic`, `nationalism`, `pacifism`, `secularism`) are initialized, registered, clamped to 0-100, and exposed through culture helper functions. `pacifism` now has matching quality bounds and a 50 baseline.
- Gameplay references to the old `spd_pacifism` variable were replaced with `pacifism`. Threshold checks were offset to the standardized 50-point culture baseline (for example old `>= 3` checks now use `>= 53`) to avoid changing balance. Save/build migration shims offset old saved values to the new 50-point baseline so legacy saves can be upgraded safely.
- DDP faction variables (`ddp_left_progressive`, `ddp_laborist`, `ddp_left_liberal`, `ddp_left_bourgeois`, `ddp_regionalist`) are initialized, validated/clamped, displayed, and included in state/debug/audit registries.
- Simplified party faction variables (`dnvp_left`, `dnvp_right`, `dvp_left`, `dvp_right`, `spd_left`, `spd_right`) are initialized, clamped, derive faction totals/balances, and are included in state/debug/audit registries.
- `elite_support` is initialized, clamped, recorded in economic history, registered as the active gameplay variable, and exposed through helper functions. `capital_strike_progress` remains registered as deprecated for compatibility.
- `federalism` is initialized, clamped, recorded in political history, and included in state/debug/audit registries.
- BVP and WP are included in canonical party arrays, root social-class support variables, election migration, election normalization, relation variables, library display, coalition placeholder calculations, and the parliamentary chart data.
- Zentrum/Z no longer receives the old implicit BVP vote share in root defaults; migration code only subtracts newly split BVP defaults from older saves where BVP support was absent.
- Election vote-share display now stores one-decimal values consistently via `*_votes_disp` and `*_votes_display`; class support displays also use one decimal.
- D’Hondt allocation is now used after elections and in the election simulator with a normalized 100-seat chamber. The allocation tracks total seats, leaves vote shares unchanged, and assigns zero seats to parties below the active threshold.
- The hand-edited `out/html/game.js` merge error was fixed; the missing close brace on `migratePacifismQuality` no longer breaks JavaScript parsing.

## Fixes made

- Fixed malformed `post_event` JavaScript caused by an unterminated culture migration block and a duplicate economic-record object fragment.
- Removed a duplicate `on-arrival` property from the hard-difficulty start option.
- Replaced gameplay `spd_pacifism` reads/writes with `pacifism`, preserving old threshold behavior against the new 50-point baseline.
- Fixed `presidential_anger` quality metadata (`default-display`) and added post-event clamping.
- Added state/debug/audit registry coverage for the new/refactored variables.
- Standardized one-decimal election and class-support display variables.
- Added D’Hondt seat allocation to the main election post-processing and election simulator.
- Added normalized Reichstag seat count tracking (`reichstag_seat_count`, `reichstag_total_seats`, `reichstag_seat_allocation_valid`).
- Fixed the checked-in browser JavaScript syntax error in `out/html/game.js`.

## Unresolved TODOs / intentionally retained compatibility

- `capital_strike_progress` still drives existing capital-strike/capital-confidence gameplay in many event and government scenes. These references already have TODO markers in the affected systems and were not converted to `elite_support` because that would change balance and event timing.
- The old SPD faction strength/dissent variables (`left_strength`, `center_strength`, `labor_strength`, `reformist_strength`, `neorevisionist_strength` and matching dissent variables) remain in many scenes. They are treated as deprecated compatibility variables for existing party-dissent mechanics; converting them to the new DDP faction variables would be a balance/design pass rather than an obvious merge fix.
- Legacy save migrations still mention `spd_pacifism` and `capital_strike_progress` by name so older saves can load and upgrade safely.
- BVP/WP coalition behavior remains placeholder-level, with existing TODOs for richer BVP federalism/Bavarian autonomy and WP middle-class protest behavior.
- The checked-in static `out/html` build was not fully regenerated because `dendrynexus make-html --overwrite` replaces custom template assets. Only the obvious `out/html/game.js` syntax error was patched directly.

## Files changed

- `out/html/game.js`
- `source/qualities/pacifism.quality.dry`
- `source/qualities/presidential_anger.quality.dry`
- `source/scenes/election_algorithm.scene.dry`
- `source/scenes/election_simulation.scene.dry`
- `source/scenes/events/death_of_hindenburg_president.scene.dry`
- `source/scenes/events/economic_sanctions.scene.dry`
- `source/scenes/events/election_1928.scene.dry`
- `source/scenes/events/london_economic_conference.scene.dry`
- `source/scenes/events/panzerkreuzer.scene.dry`
- `source/scenes/events/panzerkreuzer_b.scene.dry`
- `source/scenes/events/panzerkreuzer_ministry.scene.dry`
- `source/scenes/events/weltbuhne.scene.dry`
- `source/scenes/events/weltbuhne_2.scene.dry`
- `source/scenes/events/young_plan.scene.dry`
- `source/scenes/government_affairs/education_science.scene.dry`
- `source/scenes/government_affairs/foreign_policy.scene.dry`
- `source/scenes/government_affairs/military_policy.scene.dry`
- `source/scenes/government_affairs/prussian_affairs.scene.dry`
- `source/scenes/government_affairs/war_guilt.scene.dry`
- `source/scenes/party_affairs/international_relations.scene.dry`
- `source/scenes/party_affairs/iron_front.scene.dry`
- `source/scenes/party_affairs/media.scene.dry`
- `source/scenes/party_affairs/rally.scene.dry`
- `source/scenes/party_affairs/response_to_antisemitism.scene.dry`
- `source/scenes/party_affairs/streetfighting.scene.dry`
- `source/scenes/post_event.scene.dry`
- `source/scenes/root.scene.dry`
- `refactor-audit.md`

## Build/test result

- PASS: `npx dendrynexus compile -f .`
- PASS: `node --check out/html/game.js`
- PASS: inline Node D’Hondt invariant check (100 total seats, below-threshold parties get 0 seats, vote shares unchanged)
- WARNING: `npm run dendrynexus` invokes the package script without a subcommand, so DendryNexus prints usage and exits with code 2.
