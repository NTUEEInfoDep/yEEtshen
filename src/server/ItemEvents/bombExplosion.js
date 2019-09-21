
const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class BombExplosion extends ItemEventClass {
    constructor( { x, y, id } ) {
        super( x, y, Constants.ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS, id );
        console.log( 'BombExplosion Generated' );
    }
    update( dt ) {
        super.update( dt );
        if ( Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_DURATION ) {
            this.destroy = true;
        }
    }
    collide( players ) {
        if ( this.needCollision ) {
            this.needCollision = false;
            Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
                if ( player.id != this.parentID ) {
                    if ( player.takeDamage( Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_DAMAGE ) ) {
                        players[this.parentID].onDealtDamage();
                        console.log( `${players[this.parentID].username} just bombed ${player.username}!` );
                    }
                }
            } );
        }
    }
}

module.exports = BombExplosion;