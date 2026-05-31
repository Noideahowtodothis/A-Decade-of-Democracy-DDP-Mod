# DDP conversion audit

## Scope

This pass audits source `.dry` scenes only. Generated `out/html` files were not edited directly, event prose was preserved, and effects that clearly apply to the SPD as a separate party were intentionally left unchanged.

## Files changed

Player-facing support conversions, inherited SPD-faction no-ops, or ambiguity TODOs were applied in these source files:

- `source/scenes/advisors/aufhauser.scene.dry`
- `source/scenes/advisors/baade.scene.dry`
- `source/scenes/advisors/breitscheid.scene.dry`
- `source/scenes/advisors/hilferding.scene.dry`
- `source/scenes/advisors/juchacz.scene.dry`
- `source/scenes/advisors/leber.scene.dry`
- `source/scenes/advisors/leipart.scene.dry`
- `source/scenes/advisors/levi.scene.dry`
- `source/scenes/advisors/mierendorff.scene.dry`
- `source/scenes/advisors/muller.scene.dry`
- `source/scenes/advisors/pfulf.scene.dry`
- `source/scenes/advisors/rosenfeld.scene.dry`
- `source/scenes/advisors/sender.scene.dry`
- `source/scenes/advisors/seydewitz.scene.dry`
- `source/scenes/advisors/stampfer.scene.dry`
- `source/scenes/advisors/wels.scene.dry`
- `source/scenes/advisors/wissell.scene.dry`
- `source/scenes/advisors/woytinsky.scene.dry`
- `source/scenes/events/austrian_civil_war.scene.dry`
- `source/scenes/events/banking_crisis.scene.dry`
- `source/scenes/events/blutmai.scene.dry`
- `source/scenes/events/businesses_lose_confidence.scene.dry`
- `source/scenes/events/capital_strike.scene.dry`
- `source/scenes/events/center_party_conference.scene.dry`
- `source/scenes/events/centrist_leaders_resign.scene.dry`
- `source/scenes/events/ddp_dstp.scene.dry`
- `source/scenes/events/death_of_hindenburg_president.scene.dry`
- `source/scenes/events/economic_expansion.scene.dry`
- `source/scenes/events/economic_sanctions.scene.dry`
- `source/scenes/events/emergency_cuts.scene.dry`
- `source/scenes/events/high_inflation.scene.dry`
- `source/scenes/events/hoover_moratorium.scene.dry`
- `source/scenes/events/kpd_policy.scene.dry`
- `source/scenes/events/kpd_ultimatum.scene.dry`
- `source/scenes/events/kpd_vote_of_no_confidence.scene.dry`
- `source/scenes/events/labor_unrest.scene.dry`
- `source/scenes/events/lausanne_conference.scene.dry`
- `source/scenes/events/left_split.scene.dry`
- `source/scenes/events/london_economic_conference.scene.dry`
- `source/scenes/events/march_on_berlin.scene.dry`
- `source/scenes/events/nazis_in_crisis.scene.dry`
- `source/scenes/events/panzerkreuzer.scene.dry`
- `source/scenes/events/panzerkreuzer_b.scene.dry`
- `source/scenes/events/panzerkreuzer_ministry.scene.dry`
- `source/scenes/events/presidential_election_1932.scene.dry`
- `source/scenes/events/prussian_coup.scene.dry`
- `source/scenes/events/reformist_leaders_resign.scene.dry`
- `source/scenes/events/return_to_normalcy.scene.dry`
- `source/scenes/events/schleichers_schemes.scene.dry`
- `source/scenes/events/understanding_enemy.scene.dry`
- `source/scenes/events/unemployment_insurance_1.scene.dry`
- `source/scenes/events/unemployment_insurance_weimar.scene.dry`
- `source/scenes/events/unions_declare_independence.scene.dry`
- `source/scenes/events/vote_of_no_confidence.scene.dry`
- `source/scenes/events/young_plan.scene.dry`
- `source/scenes/government_affairs/agricultural_policy.scene.dry`
- `source/scenes/government_affairs/coalition_affairs.scene.dry`
- `source/scenes/government_affairs/constitutional_reform.scene.dry`
- `source/scenes/government_affairs/dealing_with_toleration.scene.dry`
- `source/scenes/government_affairs/economic_democracy.scene.dry`
- `source/scenes/government_affairs/economic_policy.scene.dry`
- `source/scenes/government_affairs/education_science.scene.dry`
- `source/scenes/government_affairs/fiscal_policy.scene.dry`
- `source/scenes/government_affairs/foreign_policy.scene.dry`
- `source/scenes/government_affairs/homosexual_rights.scene.dry`
- `source/scenes/government_affairs/judiciary.scene.dry`
- `source/scenes/government_affairs/labor_affairs.scene.dry`
- `source/scenes/government_affairs/labor_rights.scene.dry`
- `source/scenes/government_affairs/military_policy.scene.dry`
- `source/scenes/government_affairs/police.scene.dry`
- `source/scenes/government_affairs/prussian_affairs.scene.dry`
- `source/scenes/government_affairs/social_welfare.scene.dry`
- `source/scenes/government_affairs/womens_rights.scene.dry`
- `source/scenes/party_affairs/campaigning.scene.dry`
- `source/scenes/party_affairs/confronting_nazis.scene.dry`
- `source/scenes/party_affairs/crisis_program.scene.dry`
- `source/scenes/party_affairs/enemies.scene.dry`
- `source/scenes/party_affairs/fundraising.scene.dry`
- `source/scenes/party_affairs/ideology.scene.dry`
- `source/scenes/party_affairs/inter_party_relationships.scene.dry`
- `source/scenes/party_affairs/international_relations.scene.dry`
- `source/scenes/party_affairs/iron_front.scene.dry`
- `source/scenes/party_affairs/media.scene.dry`
- `source/scenes/party_affairs/neorevisionism.scene.dry`
- `source/scenes/party_affairs/party_disunity.scene.dry`
- `source/scenes/party_affairs/party_organizations.scene.dry`
- `source/scenes/party_affairs/peoples_party.scene.dry`
- `source/scenes/party_affairs/peoples_party_campaigning.scene.dry`
- `source/scenes/party_affairs/rally.scene.dry`
- `source/scenes/party_affairs/reichsbanner.scene.dry`
- `source/scenes/party_affairs/shuffle_leadership.scene.dry`

## SPD player-support effects converted

The inherited source naming uses party suffixes, such as `workers_spd`, rather than `spd_worker`. Clear player/card/event gains and losses were redirected as follows:

| Inherited SPD support variable | DDP support variable | References converted |
| --- | --- | ---: |
| `workers_spd` | `workers_ddp` | 182 |
| `unemployed_spd` | `unemployed_ddp` | 97 |
| `old_middle_spd` | `old_middle_ddp` | 70 |
| `new_middle_spd` | `new_middle_ddp` | 91 |
| `rural_spd` | `rural_ddp` | 46 |
| `catholics_spd` | `catholics_ddp` | 27 |
| **Total** |  | **513** |

## SPD faction effects made no-op/TODO

Deprecated SPD internal-faction mutations (`left_*`, `center_*`, `centrist_*`, `labor_*`, `reformist_*`, and `neorevisionist_*`) were removed from the converted player-facing scenes when there was no safe one-to-one DDP mapping. A source TODO was added to each affected scene:

> Revisit inherited SPD faction effect during event rewrite.

No new DDP faction variables were created. Existing DDP congress factions were not guessed at or rebalanced.

## Ambiguous or intentional SPD cases left unchanged

The following cases remain SPD effects because they clearly model the SPD as a separate party or need an event rewrite before their ownership can safely be changed:

- SPD vote drift and crisis losses in `source/scenes/post_event.scene.dry` and `source/scenes/events/election_1928.scene.dry`.
- Explicit SPD platform outcomes in `source/scenes/events/election_1928.scene.dry`.
- The SAPD split's explicit loss of SPD worker support in `source/scenes/events/sapd_formed.scene.dry`.
- Separate SPD losses alongside DDP losses in `source/scenes/events/emergency_cuts.scene.dry`.
- SPD losses conditioned on SPD government participation in `source/scenes/events/hunger_chancellor.scene.dry`.
- Candidate and coalition outcomes that are still explicitly framed around SPD decisions in `source/scenes/events/presidential_election_1932.scene.dry`, `source/scenes/events/death_of_hindenburg_president.scene.dry`, and `source/scenes/events/schleichers_schemes.scene.dry`. These scenes now carry TODO comments for the future event rewrite.
- Baseline SPD electorate initialization in `source/scenes/election_simulation.scene.dry` and save/runtime compatibility logic in `source/scenes/root.scene.dry`.
