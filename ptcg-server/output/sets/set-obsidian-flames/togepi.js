"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togepi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Togepi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Whiny Voice',
                cost: [C],
                damage: 0,
                text: 'Choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into their deck.'
            },
            {
                name: 'Rolling Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Togepi';
        this.fullName = 'Togepi OBF';
    }
    reduceEffect(store, state, effect) {
        // Whiny Voice
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1, isSecret: true }), cards => {
                cards = cards || [];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => []);
                opponent.hand.moveCardsTo(cards, opponent.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Togepi = Togepi;
