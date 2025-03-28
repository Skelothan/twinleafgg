import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
export declare class Ivysaur extends PokemonCard {
    name: string;
    cardImage: string;
    set: string;
    fullName: string;
    cardType: CardType;
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    setNumber: string;
    attacks: Attack[];
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
