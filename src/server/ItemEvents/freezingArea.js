const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class FreezingArea extends ItemEventClass {
    constructor( player  ) {
        super( player.x, player.y, Constants.ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS, player );
    }
    update( dt, itemEvents ) {
        if ( Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.FREEZING_AREA_DURATION ) {
            this.destroy = true;
        }
    }
    collide( players ) {
        Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
            if ( player != this.parent ) {
                player.state.freeze = Date.now();
            }
        } );
    }
}

module.exports = FreezingArea;