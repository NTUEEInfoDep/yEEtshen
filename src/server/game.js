const Constants = require('../shared/constants');
const Utils = require('../shared/utils');

const Player = require('./player');
const ComputerPlayer = require('./computerplayer');
// const Obj = require('./object');
const { applyCollisions, itemCollisions, playerCollisions } = require('./collisions');

const itemGenerator = require('./generate');
const ItemEvent = require('./ItemEvents/');
const fs = require('fs');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.computerplayers = {};
    this.bullets = [];
    this.items = [];
    this.itemEvents = [];

    this.broadcasts = [];
    // set initial leaderborads value 0
    this.leaderboards = [];
    for(let i = 0; i < Constants.LEADERBOARD_SIZE; i++) {
      this.leaderboards.push({ username: '-', score: '-', id: ''});
    }

    // add computerplayers
    this.generateComputerPlayer('cp1', '奇聖號（電腦）');
    this.generateComputerPlayer('cp2', '哲廣號（電腦）');
    this.generateComputerPlayer('cp3', '國瑋號（電腦）');
    this.generateComputerPlayer('cp4', '映樵號（電腦）');
    this.allComputerID = ['cp1', 'cp2', 'cp3', 'cp4'];

    // this.virtualPlayers = {}; 
    this.virtualPlayer = new Player('virtual', '', Constants.MAP_SIZE * 0.5, Constants.MAP_SIZE * 0.5, 0);
    this.virtualSockets = {};

    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;

    this.getTopTenData();
    setInterval(this.update.bind(this), 1000 / 60);
    setInterval(() => itemGenerator(this.items), 5000);

    setInterval(() => this.handleComputerPlayerFire(),
      Constants.COMPUTER_PLAYER_FIRE_COOLDOWN * 1000);
  }
  
  // add a virtual player for menu background
  addVirtualPlayer(socket) {
    this.virtualSockets[socket.id] = socket;
  }

  // remove virtual player when entering the game
  removeVirtualPlayer(socket) {
    delete this.virtualSockets[socket.id];
  }

  generateComputerPlayer(id, username) {
    const {x, y} = this.generateValidPosition(0.15);
    const computerplayer = new ComputerPlayer(id, username, x, y);
    this.computerplayers[computerplayer.id] = computerplayer;
  }

  positionIsValid(x, y) {
    const position = {x, y};
    for (let player of Object.values(this.players)) {
      if (player.distanceTo(position) < 2.5 * Constants.PLAYER_RADIUS) {
        return false;
      }
    }
    for (let computerplayer of Object.values(this.computerplayers)) {
      if (computerplayer.distanceTo(position) < 2.5 * Constants.COMPUTER_PLAYER_RADIUS) {
        return false;
      }
    }
    return true;
  }

  generateValidPosition(mapBoundaryRatio) {
    let x = null;
    let y = null;
    do {
      x = Constants.MAP_SIZE * (mapBoundaryRatio + Math.random() * (1 - 2 * mapBoundaryRatio));
      y = Constants.MAP_SIZE * (mapBoundaryRatio + Math.random() * (1 - 2 * mapBoundaryRatio));
    } while (!this.positionIsValid(x, y));

    return {x, y};
  }

  addPlayer(socket, username, spriteIdx) {
    this.sockets[socket.id] = socket;
    // Generate a position to start this player at.
    const {x, y} = this.generateValidPosition(0.25);
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

  handleComputerPlayerFire() {
    Object.values(this.computerplayers).forEach(computerplayer => {
    const newBulletsAndItemEvents = computerplayer.handleFire();
    if ( newBulletsAndItemEvents.bullets ) {
      newBulletsAndItemEvents.bullets.forEach( bullet => this.bullets.push( bullet )  );
    }
    if ( newBulletsAndItemEvents.itemEvents ) {
      newBulletsAndItemEvents.itemEvents.forEach( itemEvent => this.itemEvents.push( itemEvent ) );
    }
    });
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

    Object.values(this.computerplayers).forEach(computerplayer => {
      computerplayer.update(dt);
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    const destroyedBullets1 = applyCollisions(Object.values(this.computerplayers), this.bullets);
    this.bullets = this.bullets.filter(bullet => !destroyedBullets1.includes(bullet));

    // Apply player collision with other
    // Todo
    Object.values(this.players).forEach(player => {
      playerCollisions(player, Object.values(this.players));
    });
    Object.values(this.players).forEach(player => {
      playerCollisions(player, Object.values(this.computerplayers));
    });
    Object.values(this.computerplayers).forEach(computerplayer => {
      playerCollisions(computerplayer, Object.values(this.computerplayers));
    });

    // Check if any players are dead
    playerIDs.forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        this.itemEvents.push( new ItemEvent.Death( player ) );
        // If the killer player still alive, increase his or her score
        const killerID = player.beKilledByID;
        const killer = this.players[killerID];
        if (killer) {
          const param = Constants.KILLED_SCORE; // parameters
          const killScore = param.BASE_SCORE + 
                            Math.min(player.score * param.RATIO
                                     , param.UPPERBOUND);
          killer.score += killScore;
        }

        // The special color for the killer name
        let color = "black";
        if (killerID) {
          if (killerID === Constants.SPECIAL_ID) {color = "red";};
          if (this.allComputerID.includes(killerID)) {color = "green";};
        }

        const playerTruncName = Utils.truncateName(player.username, 14);
        const beKilledName = player.beKilledByName;
        let beKilledTruncName = null;
        if (beKilledName !== Constants.BOUNDARY_KILL_NAME) {
          beKilledTruncName = Utils.truncateName(beKilledName, 14);
        } else {
          beKilledTruncName = Constants.BOUNDARY_KILL_NAME;
        }
        // The message to be rendered on the gameover board.
        const message = {
          name: player.username,
          killedBy: beKilledName,
          color: color,
          condition: "normal",
          score: Math.round(player.score),
        }
        socket.emit(Constants.MSG_TYPES.GAME_OVER, message);

        // The broadcast message.
        const broadcastMessage = {
          playerName: playerTruncName,
          beKilledName: beKilledTruncName,
          color: color,
          condition: "normal",
        };
        // broadcast to every player
        Object.values(this.players).forEach(singlePlayer => {
          singlePlayer.broadcasts.push(broadcastMessage);
        });

        // Remove the player.
        this.removePlayer(socket);
      }
    });

    // Check if any computerplayers are dead
    Object.values(this.computerplayers).forEach(computerplayer => {
      if (computerplayer.hp <= 0) {
        // If the killer player still alive, increase his or her score
        const killerID = computerplayer.beKilledByID;
        const killer = this.players[killerID];
        if (killer) {
          killer.score += Constants.COMPUTER_KILL_SCORE;
        }
        let condition = null;
        if (this.allComputerID.includes(killerID)) {
          condition = "both";
        } else {
          condition = "inverse";
        }

        // The special color for the killer name
        const color = "green";

        // The broadcast message.
        const broadcastMessage = {
          playerName: computerplayer.username,
          beKilledName: computerplayer.beKilledByName,
          color: color,
          condition: condition,
        };
        // broadcast to every player
        Object.values(this.players).forEach(singlePlayer => {
          singlePlayer.broadcasts.push(broadcastMessage);
        });

        // Remove the player and set the revive time
        if (computerplayer.item) {
          delete this.items[computerplayer.item.id];
          computerplayer.item = null;
        }
        setTimeout(() => this.generateComputerPlayer(computerplayer.id, computerplayer.username), Constants.COMPUTER_PLAYER_REVIVAL_TIME * 1000);
        delete this.computerplayers[computerplayer.id];
      }
    });

    // update item events and check collision
    this.itemEvents.forEach( itemEvent => {
      itemEvent.update( dt, this.itemEvents );
      itemEvent.collide( this.players );
      itemEvent.collide( this.computerplayers );
    })
    this.itemEvents = this.itemEvents.filter( itemEvent => !itemEvent.destroy )

    // Check the collisions of items and destroy collected items
    const destroyedItems = itemCollisions(Object.values(this.players), this.items);
    this.items = this.items.filter(item => !destroyedItems.includes(item));

    const destroyedItems1 = itemCollisions(Object.values(this.computerplayers), this.items);
    this.items = this.items.filter(item => !destroyedItems1.includes(item));

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

  getTopTenData() { // get data from topten.json
    fs.readFile('topten.json', (err, data) => {
        if (err) console.log(err);
        else {
          let tmpdata = JSON.parse(data);
          for (let i = 0; i < Constants.LEADERBOARD_SIZE; i++) {
            this.leaderboards[i] = Object.assign({}, this.leaderboards[i], tmpdata[i]);
          }
        }
    })
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
             this.leaderboards[i].score = Math.max(Math.round(p.score), this.leaderboards[i].score);
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

    fs.writeFile('topten.json', JSON.stringify(this.leaderboards), (err) => {
        if (err) console.log(err)
    });
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
    const nearbyComputerPlayers = Object.values(this.computerplayers).filter(
      c => c.distanceTo(player) <= Constants.MAP_SIZE / 2,
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
      computerplayers: nearbyComputerPlayers.map(c => c.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      items: nearbyItems.map(i => i.serializeForUpdate()),
      itemEvents: nearbyItemEvents.map(e => e.serializeForUpdate()),
      leaderboard,
      broadcasts,
      playerNum: Object.keys(this.players).length,
    };
  }
}

module.exports = Game;
