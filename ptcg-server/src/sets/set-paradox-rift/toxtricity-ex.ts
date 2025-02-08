import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Toxtricityex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Toxel';
  public cardType: CardType = F;
  public hp: number = 260;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Knocking Hammer',
      cost: [L, L],
      damage: 70,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Gaia Punk',
      cost: [L, L, L],
      damage: 270,
      text: 'Discard 3 [L] Energy from your Pokémon.'
    }
  ];

  public set: string = 'PAR';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Toxtricity ex';
  public fullName: string = 'Toxtricity ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Knocking Hammer
    if (WAS_ATTACK_USED(effect, 0, this)){
      effect.opponent.deck.moveTo(effect.opponent.discard, 1);
    }

    // Gaia Punk
    if (WAS_ATTACK_USED(effect, 1, this)){
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, L, 3);
    }

    return state;
  }
}