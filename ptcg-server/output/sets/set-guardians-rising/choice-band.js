"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceBand = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ChoiceBand extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'GRI';
        this.setNumber = '121';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Choice Band';
        this.fullName = 'Choice Band GRI';
        this.text = 'The attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active Pokémon-GX or Active Pokémon-EX (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.cards.includes(this)) {
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            const defending = opponent.active.getPokemonCard();
            // Try to reduce ToolEffect, to check if something is blocking the tool from working
            try {
                const stub = new play_card_effects_1.ToolEffect(effect.player, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (effect.damage > 0 && effect.target === opponent.active && defending
                && (defending.tags.includes(card_types_1.CardTag.POKEMON_GX) || defending.tags.includes(card_types_1.CardTag.POKEMON_EX))) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.ChoiceBand = ChoiceBand;
