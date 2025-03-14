"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZacianVUNIONBottomRight = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const zacian_v_union_tl_1 = require("./zacian-v-union-tl");
const zacian_v_union_tr_1 = require("./zacian-v-union-tr");
const zacian_v_union_bl_1 = require("./zacian-v-union-bl");
class ZacianVUNIONBottomRight extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = M;
        this.hp = 320;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Zacian V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Zacian V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.VUNION_ASSEMBLY,
            }
        ];
        this.attacks = [
            {
                name: 'Master Blade',
                cost: [M, M, M, C],
                damage: 340,
                text: 'Discard 3 Energy from this Pokémon.'
            }
        ];
        this.set = 'SWSH';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '166';
        this.name = 'Zacian V-UNION';
        this.fullName = 'Zacian V-UNION (Bottom Right) SWSH';
    }
    reduceEffect(store, state, effect) {
        // assemblin the v-union
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.assembledVUNIONs.includes(this.name)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let topLeftPiece = false;
            let topRightPiece = false;
            let bottomLeftPiece = false;
            let bottomRightPiece = false;
            player.discard.cards.forEach(card => {
                if (card instanceof zacian_v_union_tl_1.ZacianVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof zacian_v_union_tr_1.ZacianVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof zacian_v_union_bl_1.ZacianVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof ZacianVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof zacian_v_union_tr_1.ZacianVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof zacian_v_union_bl_1.ZacianVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof ZacianVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof zacian_v_union_tl_1.ZacianVUNIONTopLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.assembledVUNIONs.push(this.name);
                    slots[0].pokemonPlayedTurn = state.turn;
                }
            }
            else {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        return state;
    }
}
exports.ZacianVUNIONBottomRight = ZacianVUNIONBottomRight;
