import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Vaporeonex extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.LIGHTNING;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.WATER | CardType.COLORLESS)[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.WATER | CardType.LIGHTNING)[];
        damage: number;
        text: string;
    })[];
    regulationMark: string;
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
    readonly ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
