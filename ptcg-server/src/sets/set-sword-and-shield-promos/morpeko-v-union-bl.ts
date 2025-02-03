import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, Power, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { MorpekoVUNIONTopLeft } from './morpeko-v-union-tl';
import { MorpekoVUNIONTopRight } from './morpeko-v-union-tr';
import { MorpekoVUNIONBottomRight } from './morpeko-v-union-br';

export class MorpekoVUNIONBottomLeft extends PokemonCard {
  public stage: Stage = Stage.VUNION;
  public tags = [CardTag.POKEMON_VUNION];
  public cardType: CardType = L;
  public hp: number = 310;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  
  public powers: Power[] = [
    {
      name: 'Morpeko V-UNION Assembly',
      text: 'Once per game during your turn, combine 4 different Morpeko V-UNION from your discard pile and put them onto your bench.',
      useFromDiscard: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.ABILITY
    }
  ];

  public attacks = [
    {
      name: 'Burst Wheel',
      cost: [L, C, C],
      damage: 100,
      damageCalculation: 'x',
      text: 'Discard all Energy from this Pokémon. This attack does 100 damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'SP';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '218';
  public name: string = 'Morpeko V-UNION';
  public fullName: string = 'Morpeko V-UNION (Bottom Left) SP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // assemblin the v-union
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.assembledVUNIONs.includes(this.name)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let topLeftPiece = false;
      let topRightPiece = false;
      let bottomLeftPiece = false;
      let bottomRightPiece = false;
      player.discard.cards.forEach(card => {
        if (card instanceof MorpekoVUNIONTopLeft) { topLeftPiece = true; }
        if (card instanceof MorpekoVUNIONTopRight) { topRightPiece = true; }
        if (card instanceof MorpekoVUNIONBottomLeft) { bottomLeftPiece = true; }
        if (card instanceof MorpekoVUNIONBottomRight) { bottomRightPiece = true; }
      });

      if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
        if (slots.length > 0) {
          player.discard.cards.forEach(card => { if (card instanceof MorpekoVUNIONTopRight) { player.discard.moveCardTo(card, slots[0]); } });
          player.discard.cards.forEach(card => { if (card instanceof MorpekoVUNIONBottomLeft) { player.discard.moveCardTo(card, slots[0]); } });
          player.discard.cards.forEach(card => { if (card instanceof MorpekoVUNIONBottomRight) { player.discard.moveCardTo(card, slots[0]); } });
          // gotta make sure the actual mon ends up on top
          player.discard.cards.forEach(card => { if (card instanceof MorpekoVUNIONTopLeft) { player.discard.moveCardTo(card, slots[0]); } });
          player.assembledVUNIONs.push(this.name);
          slots[0].pokemonPlayedTurn = state.turn;
        }
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    return state;
  }
}
