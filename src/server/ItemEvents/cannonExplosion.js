const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class CannonExplosion extends ItemEventClass {
    constructor( x, y, player ) {
        super( x, y, Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_RADIUS, player, player.dir );
        this.hasGeneratedSecondEXlopsion = false;
    }
    update( dt, itemEvents ) {
        if ( !this.hasGeneratedSecondEXlopsion && Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_GENERATE_INTERVAL ) {
            const {x, y, direction, parent} = this;
            this.hasGeneratedSecondEXlopsion = true;
            if ( x > 0 && x < Constants.MAP_SIZE && y > 0 && y < Constants.MAP_SIZE ) {
                const newCannonExplosion = new CannonExplosion( 
                    x + Math.cos(direction) * Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_RADIUS * 0.7,
                    y + Math.sin(direction) * Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_RADIUS * 0.7,
                    parent
                )
                itemEvents.push( newCannonExplosion );
            }
        }
    }
    collide( players ) {
        if ( Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_WARNING_TIME ) {
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
}

module.exports = CannonExplosion;