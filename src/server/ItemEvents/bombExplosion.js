
const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class BombExplosion extends ItemEventClass {
    constructor( x, y, playerID, playerName ) {
        super( x, y, Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_RADIUS, playerID, playerName );
        this.needCollision = true;
    }
    update( dt, itemEvents ) {
        if ( Date.now() - this.timestamp >= Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_END ) {
            this.destroy = true;
        }
    }
    collide( players ) {
        if ( this.needCollision &&  Date.now() - this.timestamp >= Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_HIT ) {
            this.needCollision = false;
            Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
                if ( player.id != this.parentID ) {
                    player.takeDamage( Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_DAMAGE, this.parentID, this.parentName );
                }
            } );
        }
    }
}

module.exports = BombExplosion;