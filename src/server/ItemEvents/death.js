const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')
const { ITEM_EVENTS_PARAMETERS, BULLET_SPEED, MAP_SIZE } = Constants;

class Death extends ItemEventClass {
    constructor( player  ) {
        const { x, y, id, username } = player;
        super( x, y, 0, id, username );
    }
    update( dt, itemEvents ) {
        if ( Date.now() - this.timestamp >= ITEM_EVENTS_PARAMETERS.DEATH_END ) {
            this.destroy = true;
        }
    }
    collide( players ) {
    }
}

module.exports = Death;