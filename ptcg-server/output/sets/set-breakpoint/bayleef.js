"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bayleef = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Bayleef extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.evolvesFrom = 'Chikorita';
        this.attacks = [{
                name: 'Body Slam',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed'
            },
            {
                name: 'Vine Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'BKP';
        this.name = 'Bayleef';
        this.fullName = 'Bayleef BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.Bayleef = Bayleef;
