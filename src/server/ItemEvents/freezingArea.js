const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')
const { ITEM_EVENTS_PARAMETERS, BULLET_SPEED, MAP_SIZE } = Constants;

class FreezingArea extends ItemEventClass {
    constructor( player  ) {
        const { x, y, direction } = player;
        super( x + ( ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS) * Math.sin( direction), 
            y - ( ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS) * Math.cos( direction),
            ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS,
            player.id,
            player.username,
            player.direction
        );
    }
    update( dt, itemEvents ) {
        this.x += BULLET_SPEED * Math.sin( this.direction ) * dt;
        this.y -= BULLET_SPEED * Math.cos( this.direction ) * dt;
        const { x, y } = this;
        if ( x < 0 || x > MAP_SIZE || y < 0 || y > MAP_SIZE) {
            this.destroy = true;
        }
    }
    collide( players ) {
        Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
            if ( player.id != this.parentID ) {
                player.state.freeze = Date.now();
            }
        } );
    }
}

module.exports = FreezingArea;