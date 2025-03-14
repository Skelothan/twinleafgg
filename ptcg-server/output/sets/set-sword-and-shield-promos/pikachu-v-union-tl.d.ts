import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class PikachuVUNIONTopLeft extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIGHTING;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        text: string;
        useFromDiscard: boolean;
        exemptFromAbilityLock: boolean;
        powerType: PowerType;
    }[];
    attacks: {
        name: string;
        cost: (CardType.LIGHTNING | CardType.COLORLESS)[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = "OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
