import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { UseStadiumEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PowerType } from '../../game';

export class SilentLab extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'PRC';

  public name: string = 'Silent Lab';

  public fullName: string = 'Silent Lab PRC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '140';

  public text: string =
    'Each Basic Pokemon in play, in each player\'s hand, ' +
    'and in each player\'s discard pile has no Abilities.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && StateUtils.getStadiumCard(state) === this) {
      const pokemonCard = effect.card;
      const cardList = StateUtils.findCardList(state, pokemonCard);

      const isBasic = cardList instanceof PokemonCardList
        ? cardList.isStage(Stage.BASIC)
        : pokemonCard.stage === Stage.BASIC;
      if (!effect.power.exemptFromAbilityLock) {
        if (isBasic && pokemonCard.powers.some(power => power.powerType === PowerType.ABILITY)) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }

        return state;
      }
    }

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
