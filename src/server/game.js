
const Constants = require('../shared/constants');
const Player = require('./player');
const { applyCollisions, playerCollisions } = require('./collisions');
const Items = require('./Items/');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.items = {};
    this.itemEvents = {};

    // add an item for test
    const test_item = new Items.bomb(Constants.MAP_SIZE / 3 * 2, Constants.MAP_SIZE / 3)
    this.addItem(test_item);

    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    let player = this.players[socket.id];
    // If the player exists and owns item, destroy it first.
    if (player && player.item) {
      delete this.items[player.item.id];
      player.item = null;
    }
    // delete the player
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, rotateSpeed) {
    if (this.players[socket.id]) {
      // this.players[socket.id].setDirection(dir);
      this.players[socket.id].setRotateSpeed(rotateSpeed);
    }
  }

  handleFire(socket) {
    if (this.players[socket.id]) {
      const player = this.players[socket.id];
      const newBullet = player.handleFire();
      if (newBullet) {
        if (player.item) {
          const itemEvent = player.useItem();
          if (itemEvent) {
            this.itemEvents[itemEvent.id] = itemEvent;
          }
        } else {
          this.bullets.push(newBullet);
        }
      }
    }
  }

  addItem(item) {
    this.items[item.id] = item;
  }

  handleItemEvents() {
    for (let itemEvent of Object.values(this.itemEvents)) {
      switch (itemEvent.event) {
        case 'bomb_explode':
          for (let player of Object.values(this.players)) {
            if ((itemEvent.parentID != player.id) &&
                (itemEvent.distanceTo(player) < Constants.ITEMS_PARAMETERS.BOMB_EXPLODE_RADIUS)) {
              player.hp -= Constants.ITEMS_PARAMETERS.BOMB_DAMAGE;
            }
          }
          delete this.itemEvents[itemEvent.id];
          break;

        default:
          throw 'Item events does not match any cases.'
      }
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000; // seconds
    const playerIDs = Object.keys(this.sockets);
    this.lastUpdateTime = now;

    // Update each bullet
    this.bullets = this.bullets.filter(bullet => !bullet.update(dt));

    // Update each player
    playerIDs.forEach(playerID => {
      const player = this.players[playerID];
      player.update(dt);
    //   if (newBullet) {
    //     this.bullets.push(newBullet);
    //   }
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Apply player collision with other
    // Todo
    Object.values(this.players).forEach(player => {
      playerCollisions(player, Object.values(this.players));
    });

    // Check if any players are dead
    playerIDs.forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Check if any players get items
    for (let item of Object.values(this.items)) {
      for (let player of Object.values(this.players)) {
        if (!item.ownedPlayer // The item is not owned by any players.
            && (item.distanceTo(player) <=
                Constants.ITEM_RADIUS + Constants.PLAYER_RADIUS)
            ) {
          // If the player has item, destroy it first
          if (player.item) {
            player.item.destroy(this.items);
          }
          item.beGotBy(player);
          break;
        }
      }
    }

    // Handle the item events
    this.handleItemEvents();

    // Update items
    for (let item of Object.values(this.items)) {
      item.update(dt);
    }

    // Destory items
    for (let item of Object.values(this.items)) {
      if (item.destroy) {
        this.items[item.id].ownedPlayer.item = null;
        delete this.items[item.id];
      }
    }

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyItems = Object.values(this.items).filter(
      i => i.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      items: nearbyItems.map(i => i.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
