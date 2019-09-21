
const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class BombExplosion extends ItemEventClass {
    constructor( x, y, owner ) {
        super( x, y, Constants.ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS, owner );
        console.log( 'BombExplosion Generated' );
    }
    update( dt ) {
        super.update( dt );
        if ( Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_DURATION ) {
            this.destroy = true;
            console.log( 'BombExplosion Dissapeared' );
        }

    }
    collide( players ) {
        if ( this.needCollision ) {
            this.needCollision = false;
            Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
                if ( player.id != this.owner.id ) {
                    player.hp -= Constants.ITEM_EVENTS_PARAMETERS.BOMB_EXPLOSION_DAMAGE;
                    this.owner.onDealtDamage();
                    console.log( `player ${player.username} was damaged by a bomb` );
                }
            } );
        }
    }
}

module.exports = BombExplosion;