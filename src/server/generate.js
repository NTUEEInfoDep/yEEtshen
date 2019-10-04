const Items = require('./Items/');
const Constants = require('../shared/constants');

function itemGenerator(items) {
    const mapSize = Constants.MAP_SIZE;
    let itemsNum = {
        Healbag: 0,
        Shield: 0,
        LightSword: 0,
        Bomb: 0,
        FreezeBomb: 0,
        Weed: 0,
        Shotgun: 0,
        Cannon: 0,
    };
    items.map(item => { itemsNum[item.constructor.name] += 1; });
    Object.keys(itemsNum).map(itemKey => {
        const num = Constants.ITEM_MAX_NUM[itemKey.toUpperCase()];
        if (num > itemsNum[itemKey]) {
            const diff = num - itemsNum[itemKey];
            const add_num = Math.max(Math.floor(Math.random() * diff),1);
            for (let i = 0; i < add_num; i++) {
                let x = mapSize * (0.1 + Math.random() * 0.8);
                let y = mapSize * (0.1 + Math.random() * 0.8);
                // check if place collide with other item
                items.map(other => {
                    while (Math.hypot(other.x - x, other.y - y) < Constants.ITEM_RADIUS) {
                        x = mapSize * (0.05 + Math.random() * 0.9);
                        y = mapSize * (0.05 + Math.random() * 0.9)
                    }
                })
                items.push(new Items[itemKey](x, y));
            }
        }
    })
}

module.exports = itemGenerator;

// this.addItem(new Items.Healbag( 100, 100 ));
// this.addItem(new Items.Weed( 300, 100 ));
// this.addItem(new Items.Shield( 500, 100 ));
// this.addItem(new Items.LightSword( 700, 100 ));
// this.addItem(new Items.Bomb( 100, 300 ));
// this.addItem(new Items.Cannon( 300, 300 ));
// this.addItem(new Items.FreezeBomb( 500, 300 ));
// this.addItem(new Items.Shotgun( 700, 300 ));