import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private turboText!: Phaser.GameObjects.Text;

  constructor() {
    super('PreloadScene');
  }

  preload() {
    // You can later load images, sprites, etc. here.
    // For now, maybe just a text or progress bar.
    // this.load.once('complete', () => {
    //   this.scene.start('PlayScene');
    // });

    this.load.image('bucket', '../../assets/catching/bucket.png');
    this.load.svg('bucket', '../../assets/catching/bucket.svg');
  }

  create() {
    // Add instructions before starting the game
    this.add
      .text(400, 200, 'CATCHING GAME', {
        fontSize: '32px',
        color: '#002C5C',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(400, 250, 'Use LEFT/RIGHT arrows to move', {
        fontSize: '20px',
        color: '#FF9D00',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(400, 280, 'Hold SPACEBAR for turbo speed (2x)', {
        fontSize: '20px',
        color: '#F23885',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    // this.add.text(400, 320, 'Catch 4 balls to win!', {
    //   fontSize: '20px',
    //   color: '#fff',
    //   fontFamily: 'Arial',
    //   align: 'center'
    // }).setOrigin(0.5, 0.5);

    this.add
      .text(400, 400, 'Press SPACE to start', {
        fontSize: '24px',
        color: '#002C5C',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    // Wait for spacebar to start the game
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('PlayScene');
    });
  }
}
