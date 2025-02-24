"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sigilyph = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sigilyph extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.resistance = [{ type: F, value: -20 }];
        this.powers = [
            {
                name: 'Toolbox',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon may have up to 4 Pokémon Tool cards attached to it. ' +
                    '(If this Pokémon loses this Ability, discard Pokémon Tool cards attached to this Pokémon until only 1 Pokémon Tool card remains.)'
            }
        ];
        this.attacks = [{ name: 'Cutting Wind', cost: [P, C, C], damage: 70, text: '' }];
        this.set = 'PLB';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sigilyph';
        this.fullName = 'Sigilyph PLB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                if (!game_1.StateUtils.isPokemonInPlay(player, this)) {
                    return;
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card !== this) {
                        return;
                    }
                    if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                        cardList.maxTools = 4;
                    }
                    else {
                        cardList.maxTools = 1;
                    }
                });
            });
        }
        return state;
    }
}
exports.Sigilyph = Sigilyph;
