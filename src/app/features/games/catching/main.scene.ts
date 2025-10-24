import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  preload() {
    // preload assets (e.g., this.load.image('player', 'assets/player.png'))
  }

  create() {
    this.add.text(100, 100, 'Hello Angular 20 + Phaser!', { color: '#fff' });
  }

//   update() {
//     // game loop
//   }
}