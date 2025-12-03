import Phaser from 'phaser';

interface GameOverData {
  score: number;
  playerName: string;
}

export class GameOverScene extends Phaser.Scene {
  private score!: number;
  private playerName!: string;

  constructor() {
    super('GameOverScene');
  }

  create(data: GameOverData) {
    this.score = data.score;
    this.playerName = data.playerName || 'Anonymous';

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Title
    const title = this.add.text(centerX, centerY - 80, 'GAME OVER!', {
      fontSize: '40px',
      color: '#003598',
      fontFamily: 'Arial',
      align: 'center',
    });
    title.setOrigin(0.5);

    // Score
    const scoreText = this.add.text(centerX, centerY - 20, `Final Score: ${this.score}`, {
      fontSize: '28px',
      color: '#000',
      fontFamily: 'Arial',
      align: 'center',
    });
    scoreText.setOrigin(0.5);

    // Instructions
    const restartText = this.add
      .text(centerX, centerY + 40, 'Press R to restart level', {
        fontSize: '20px',
        color: '#000',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5);

    // const nextLevelText = this.add
    //   .text(centerX, centerY + 70, 'Press N for next level', {
    //     fontSize: '20px',
    //     color: '#000',
    //     fontFamily: 'Arial',
    //     align: 'center',
    //   })
    //   .setOrigin(0.5);

    const menuText = this.add
      .text(centerX, centerY + 100, 'Press M for main menu', {
        fontSize: '20px',
        color: '#000',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5);

    //  Save score
    (window as any).scoreService
      .addScore(this.playerName, this.score)
      .then(() => {
        this.add
          .text(centerX, centerY - 130, 'Score saved!', {
            fontSize: '18px',
            color: '#00AA00',
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);
      })
      .catch((err: any) => {
        console.error('Error saving score:', err);
        this.add
          .text(centerX, centerY + 140, 'Could not save score 😢', {
            fontSize: '18px',
            color: '#AA0000',
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);
      });

    //  Key handling
    this.input.keyboard?.on('keydown-R', () => {
      this.scene.start('PlayScene'); // restart game
    });

    // this.input.keyboard?.on('keydown-N', () => {
    //   this.scene.start('Level2Scene'); // 👈 your future second level
    // });

    this.input.keyboard?.on('keydown-M', () => {
      this.scene.start('PreloadScene');
    });
  }
}
