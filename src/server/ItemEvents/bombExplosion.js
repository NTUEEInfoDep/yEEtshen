
const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class BombExplosion extends ItemEventClass {
    constructor( player ) {
        super( player.x, player.y, Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_RADIUS, player );
    }
    update( dt, itemEvents ) {
    }
    collide( players ) {
        this.destroy = true;
        Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
            if ( player != this.parent ) {
                if ( player.takeDamage( Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_DAMAGE ) ) {
                    this.parent.onDealtDamage();
                }
            }
        } );
    }
}

module.exports = BombExplosion;