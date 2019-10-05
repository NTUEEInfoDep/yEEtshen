const Constants = require('../shared/constants');
const Utils = require('../shared/utils');

const Player = require('./player');
// const Obj = require('./object');
const { applyCollisions, itemCollisions, playerCollisions } = require('./collisions');

const itemGenerator = require('./generate');
const ItemEvent = require('./ItemEvents/');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.items = [];
    this.itemEvents = [];

    this.broadcasts = [];
    // set initial leaderborads value 0
    this.leaderboards = [];
    for(let i = 0; i < Constants.LEADERBOARD_SIZE; i++) {
      this.leaderboards.push({ username: '-', score: '-', id: 'virtual' + 'i'});
    }

    // this.virtualPlayers = {}; 
    this.virtualPlayer = new Player('virtual', '', Constants.MAP_SIZE * 0.5, Constants.MAP_SIZE * 0.5, 0);
    this.virtualSockets = {};

    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
    setInterval(() => itemGenerator(this.items), 5000);
  }
  
  // add a virtual player for menu background
  addVirtualPlayer(socket) {
    this.virtualSockets[socket.id] = socket;
  }

  // remove virtual player when entering the game
  removeVirtualPlayer(socket) {
    delete this.virtualSockets[socket.id];
  }

  addPlayer(socket, username, spriteIdx) {
    this.sockets[socket.id] = socket;
    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y, spriteIdx);
  }

  removePlayer(socket) {
    const player = this.players[socket.id];
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
      const newBulletsAndItemEvents = player.handleFire();
      if ( newBulletsAndItemEvents.bullets ) {
        newBulletsAndItemEvents.bullets.forEach( bullet => this.bullets.push( bullet )  );
      }
      if ( newBulletsAndItemEvents.itemEvents ) {
        newBulletsAndItemEvents.itemEvents.forEach( itemEvent => this.itemEvents.push( itemEvent ) );
      }
    }
  }

  /*
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
  */

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000; // seconds
    const playerIDs = Object.keys(this.sockets);
    // const virtualPlayerIDs = Object.keys(this.virtualSockets)
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
        this.itemEvents.push( new ItemEvent.Death( player ) );
        // If the killer player still alive, increase his or her score
        const killer = this.players[player.beKilledByID];
        if (killer) {
          const param = Constants.KILLED_SCORE; // parameters
          const killScore = param.BASE_SCORE + 
                            Math.min(player.score * param.RATIO
                                     , param.UPPERBOUND);
          killer.score += killScore;
        }

        const playerTruncName = Utils.truncateName(player.username, 14);
        const beKilledName = player.beKilledByName;
        const beKilledTruncName = Utils.truncateName(beKilledName, 14);
        // The message to be rendered on the gameover board.
        const message = {
          name: player.username,
          killedBy: beKilledName,
          score: Math.round(player.score),
        }
        socket.emit(Constants.MSG_TYPES.GAME_OVER, message);

        // The broadcast message.
        const broadcastMessage = {
          playerName: playerTruncName,
          beKilledName: beKilledTruncName,
        };
        // broadcast to every player
        Object.values(this.players).forEach(singlePlayer => {
          singlePlayer.broadcasts.push(broadcastMessage);
        });

        // Remove the player.
        this.removePlayer(socket);
      }
    });

    // update item events and check collision
    this.itemEvents.forEach( itemEvent => {
      itemEvent.update( dt, this.itemEvents );
      itemEvent.collide( this.players );
    })
    this.itemEvents = this.itemEvents.filter( itemEvent => !itemEvent.destroy )

    // Check the collisions of items and destroy collected items
    const destroyedItems = itemCollisions(Object.values(this.players), this.items);
    this.items = this.items.filter(item => !destroyedItems.includes(item));

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      // update virtual player
      Object.keys(this.virtualSockets).forEach(socketID => {
        const socket = this.virtualSockets[socketID];
        socket.emit(Constants.MSG_TYPES.VIRTUAL_GAME_UPDATE, this.createUpdate(this.virtualPlayer, leaderboard));
      })
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {      
    Object.values(this.players)
      .forEach(p => {                                       // for any player
        // console.log(p.score)
        let count = -1;                                           
        for(let i = 0; i < Constants.LEADERBOARD_SIZE; i++) { // run through the leaderboard
          if(p.score > this.leaderboards[i].score || this.leaderboards[i].score === '-') {        // if bigger than the history score
            count = i;                                  // save the place to replace                                                 
            break;
          }
        }
        let exist = false;
        for(let i = 0; i < Constants.LEADERBOARD_SIZE; i++) { // check if the id is on the leaderboard 
          if(this.leaderboards[i].id == p.id) {
             exist = true;
             this.leaderboards[i].score = Math.round(p.score);
             break;
          }
        }
        if(count != -1 && !exist) { // if need to change the leaderboard
          for(let i = Constants.LEADERBOARD_SIZE - 1; i > count ; i--) { // move the past record back
            this.leaderboards[i] = this.leaderboards[i - 1];
          }
          this.leaderboards[count] = { username: p.username, score: Math.round(p.score), id: p.id };    
        }  
      })    
    
    this.leaderboards
      .sort((p1, p2) => p2.score - p1.score)  

    return this.leaderboards
    // .map(p => ({ username: p.username, score: Math.round(p.score) }));
    // return Object.values(this.players)
    //   .sort((p1, p2) => p2.score - p1.score)
    //   .slice(0, 5)
    //   .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyItems = this.items.filter(
      i => i.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyItemEvents = this.itemEvents.filter(
      e => e.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const broadcasts = player.broadcasts;
    player.broadcasts = [];

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      items: nearbyItems.map(i => i.serializeForUpdate()),
      itemEvents: nearbyItemEvents.map(e => e.serializeForUpdate()),
      leaderboard,
      broadcasts,
    };
  }
}

module.exports = Game;
