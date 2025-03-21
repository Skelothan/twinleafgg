"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandorusEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_message_1 = require("../../game/game-message");
class LandorusEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hammerhead',
                cost: [F],
                damage: 30,
                text: 'Does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }, {
                name: 'Land\'s Judgment',
                cost: [F, F, C],
                damage: 80,
                text: 'You may discard all [F] Energy attached to this Pokémon. If you do, this attack does 70 more damage.'
            },
        ];
        this.set = 'BCR';
        this.setNumber = '89';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Landorus EX';
        this.fullName = 'Landorus EX BCR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_DISCARD_ENERGY), result => {
                if (result) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    store.reduceEffect(state, checkProvidedEnergy);
                    const cards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        if (em.provides.includes(card_types_1.CardType.FIGHTING) || em.provides.includes(card_types_1.CardType.ANY)) {
                            cards.push(em.card);
                        }
                    });
                    effect.damage += 70;
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    return store.reduceEffect(state, discardEnergy);
                }
            });
        }
        return state;
    }
}
exports.LandorusEx = LandorusEx;
