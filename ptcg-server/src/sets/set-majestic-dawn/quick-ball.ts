import { Card } from '../../game/store/card/card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PokemonCard } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const cards: Card[] = [];
  let pokemon: Card | undefined;
  for (let i = 0; i < player.deck.cards.length; i++) {
    const card = player.deck.cards[i];
    cards.push(card);

    if (card instanceof PokemonCard) {
      pokemon = card;
      break;
    }
  }

  yield store.prompt(state, [
    new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, cards),
    new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)
  ], () => next());

  if (pokemon !== undefined) {
    player.deck.moveCardTo(pokemon, player.hand);
  }
  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class QuickBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'MD';

  public name: string = 'Quick Ball';

  public fullName: string = 'Quick Ball MD';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public text: string =
    'Reveal cards from the top of your deck until you reveal a Pokémon. Show that Pokémon to your opponent and put it into your hand. Shuffle the other revealed cards back into your deck. (If you don\'t reveal a Pokémon, shuffle all revealed cards back into your deck.)';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
