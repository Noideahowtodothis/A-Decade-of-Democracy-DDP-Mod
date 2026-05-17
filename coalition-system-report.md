# Coalition Negotiation System Report

## Files changed
- `source/scenes/root.scene.dry`
  - Added initial coalition negotiation state variables/flags for new games.
- `source/scenes/events/election_1928.scene.dry`
  - Added reusable coalition concession metadata, threshold helpers, incompatibility checks, concession effect application, party negotiation screens, confirmation/cancel flow, negotiated-government formation, and fallback toleration/new-election choices.
- `coalition-system-report.md`
  - This implementation report.

## New scenes/screens created
All new screens are in `source/scenes/events/election_1928.scene.dry`:
- `@coalition_negotiation_start` — party selection / negotiation hub.
- `@coalition_negotiation_party` — party-specific concession checklist with current and required points.
- `@toggle_*` concession screens — one toggle scene per concession.
- `@coalition_confirm_party` — confirms concessions when threshold is met and adds the party to the negotiated coalition.
- `@coalition_cancel_party` — backs out without applying concessions.
- `@coalition_form_government` / `@coalition_custom_formed` — forms a majority negotiated coalition and sets membership/government flags.
- `@coalition_reject_formation` / `@coalition_fallback` — fallback menu after refusing coalition formation.
- `@tolerate_*` screens — placeholder toleration choices for viable fallback coalitions.
- `@coalition_fallback_new_elections` — triggers the existing new-election path when no viable tolerated coalition is available or when chosen.

## Concession data location
Concession metadata is stored in `Q.coalition_concessions` inside the `@post_election_1928` JavaScript setup block in `source/scenes/events/election_1928.scene.dry`.

Each entry includes:
- `id`
- `party`
- `label`
- `isMajor`
- `points`
- `effects`
- `blockedParties`
- `conditions`
- `todo`

## Missing variables / TODOs
- `spd_relation` does not exist in the current state architecture. Effects that say “damage SPD ties/relations” use `Q.coalitionNudge('spd_relation', amount)`, which safely no-ops unless a future `spd_relation` variable is added.
- `lautenbach_tracker` does not exist. The WP “Reduce Inflation” concession subtracts from it only if the variable exists.
- NSDAP/Z and KPD/Z incompatibility exceptions are represented by placeholder flags `coalition_nsdap_z_allowed` and `coalition_kpd_z_allowed`; TODO comments mark these for future scenario-specific refinement.
- Concession effect magnitudes are intentionally placeholder mechanical values and should be tuned after playtesting.
- The negotiated government uses simple membership/government flags and a placeholder chancellor assignment based on the largest coalition member; detailed cabinet/prose integration is left for a later pass.

## Build/test result
- `npm run dendrynexus` was attempted, but the package script invokes `dendrynexus` with no subcommand and exits with usage error.
- `npx dendrynexus compile .` passed after the implementation fixes.
