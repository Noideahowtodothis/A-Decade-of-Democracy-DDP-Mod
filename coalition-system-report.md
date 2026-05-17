# Coalition Negotiation System Report

## Files changed
- `source/scenes/root.scene.dry`
  - Added initial coalition negotiation state variables/flags for new games.
  - Added initial debug/display strings for the proposed coalition, blocked parties, unavailable parties, selected concessions, and concession-specific blocks.
- `source/scenes/events/election_1928.scene.dry`
  - Added reusable coalition concession metadata, threshold helpers, incompatibility checks, concession effect application, party negotiation screens, confirmation/cancel flow, negotiated-government formation, and fallback toleration/new-election choices.
  - Added temporary/debug text showing selected party, selected concessions, current concession points, required concession points, proposed coalition, blocked/incompatible parties, and no-seat unavailable parties.
  - Kept incompatibilities to the requested first-pass list: SPD blocks DNVP/NSDAP; DNVP blocks SPD/KPD; NSDAP blocks SPD/KPD; KPD blocks DNVP/DVP/NSDAP.
- `coalition-system-report.md`
  - This implementation report.

## How to reach the system in-game
1. Run an election that routes into `source/scenes/events/election_1928.scene.dry` and reaches `@post_election_1928`.
2. Continue to the post-election coalition menu.
3. Choose `Negotiate a custom coalition` (`@coalition_negotiation_start`).
4. Pick one of SPD, DVP, DNVP, Z, BVP, or WP.
5. Toggle concessions until current concession points meet the required threshold, then confirm the party to add it to the proposed coalition.
6. Once the proposed coalition has at least 50 seats, choose `Form the negotiated coalition government`.
7. If negotiations are rejected, `@coalition_reject_formation` routes to a fallback toleration/new-election menu.

## Concessions implemented
- SPD
  - Expand Welfare *
  - Expand Unemployment Insurance *
  - Expand Labor Protections *
  - Cut Military Spending *
  - Expand Women’s Rights
  - Sexual Minority Law Reforms
  - Expand Secular Education
  - Crackdown on Paramilitaries
- DVP
  - Reduce Regulations *
  - Cut Welfare *
  - Increase Salaries for Government Employees *
  - Expand Secular Education
  - Crackdown on Communists
  - Protect Nationalist Bureaucrats
- DNVP
  - Increase Tariffs *
  - Increase Rural Aid *
  - Allow Imperial Symbolism
  - Crack Down on Socialists
  - Protect Nationalist Bureaucrats
  - Increase Funding to Protestant Church Groups
- Z
  - Expand Catholic Education *
  - Balance the Budget *
  - Further Negotiate with the Papacy *
  - Expand Infrastructure in the South
  - Support Catholic Student Groups
  - Support Catholic Unions
- BVP
  - Expand State Autonomy
- WP
  - Reduce Inflation *
  - Promote Landlord Interests

Major concessions count as 2 points. Minor concessions count as 1 point. Concession effects are only applied when the party is confirmed into the coalition, and accepted concessions are saved as `concession_<id>_accepted` flags.

## Missing variables / TODOs
- `spd_relation` does not exist in the current state architecture. Effects that say “damage SPD ties/relations” use `Q.coalitionNudge('spd_relation', amount)`, which safely no-ops unless a future `spd_relation` variable is added.
- `lautenbach_tracker` does not exist. The WP “Reduce Inflation” concession subtracts from it only if the variable exists.
- Incompatibility nuance is still TODO: future work should consider party leaders, presidential pressure, toleration exceptions, and scenario-specific exceptions.
- Concession effect magnitudes are intentionally placeholder mechanical values and should be tuned after playtesting.
- The negotiated government uses simple membership/government flags and a placeholder chancellor assignment based on the largest coalition member; detailed cabinet/prose integration is left for a later pass.

## Build/test result
- `npm run dendrynexus` was attempted, but the package script invokes `dendrynexus` with no subcommand and exits with a usage error.
- `npx dendrynexus compile .` passed after the implementation changes. It regenerated `out/game.json`; that generated file was reverted to keep this diff focused and avoid modifying generated output.
