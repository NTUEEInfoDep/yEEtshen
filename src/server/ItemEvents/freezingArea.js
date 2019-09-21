const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class FreezingArea extends ItemEventClass {
    constructor( x, y, owner ) {
        super( x, y, Constants.ITEM_EVENTS_PARAMETERS.FREEZING_AREA_RADIUS, owner );
        console.log( 'FreezingArea Generated' );
    }
    update( dt ) {
        super.update( dt );
        if ( Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.FREEZING_AREA_DURATION ) {
            this.destroy = true;
            console.log( 'FreezingArea Dissapeared' );
        }
    }
    collide( player ) {
        //TODO: stop the player's movement
    }
}

module.exports = FreezingArea;