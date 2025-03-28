import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';
export declare class Fezandipitiex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    regulationMark: string;
    cardType: CardType;
    weakness: {
        type: CardType;
    }[];
    hp: number;
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly TABLE_TURNER_MARKER = "TABLE_TURNER_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
