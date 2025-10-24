import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  private turboText!: Phaser.GameObjects.Text;
  public inputName: string = '';

  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('bucket', '../../assets/catching/bucket.png');
    this.load.svg('bucket', '../../assets/catching/bucket.svg');
    this.load.html('nameform', '../../assets/catching/nameform.html');

    this.registry.set('playerName');
    this.registry.set('score', 0);
  }

  create() {
    // Add instructions before starting the game

    let nameForm = this.add.dom(400, 350).createFromCache('nameform');

    nameForm.addListener('submit');
    nameForm.on('submit', (event: any) => {
      event.preventDefault();

      if (event.inputEvent && event.inputEvent.key !== 'Enter') {
        return;
      }

      const inputElement = nameForm.getChildByName('username') as HTMLInputElement;
      const playerName = inputElement.value;

      if (playerName.length > 0) {
        this.registry.set('playerName', playerName);
        nameForm.removeListener('submit');
        nameForm.setVisible(false);
        this.scene.start('PlayScene');
      } else {
        inputElement.placeholder = 'Please enter your name!';
        inputElement.style.borderColor = '#ff0000';
      }
    });

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

    /// get the scores
    // --- HALL OF FAME ---

    (window as any).scoreService
      .getTopScores(5)
      .then((scores: any[]) => {
        this.add
          .text(400, 450, '🏆 HALL OF FAME 🏆', {
            fontSize: '24px',
            color: '#002C5C',
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);

        if (!scores.length) {
          this.add
            .text(400, 540, 'No scores yet — be the first!', {
              fontSize: '18px',
              color: '#444',
              fontFamily: 'Arial',
              align: 'center',
            })
            .setOrigin(0.5);
          return;
        }

        let text = '';
        scores.forEach((s, i) => {
          text += `${i + 1}. ${s.user} - ${s.score}\n`;
        });

        this.add
          .text(400, 540, text, {
            fontSize: '20px',
            color: '#003598',
            fontFamily: 'Courier New, monospace',
            align: 'center',
          })
          .setOrigin(0.5);
      })
      .catch((err: any) => {
        console.error('Error loading scores:', err);
        this.add
          .text(400, 540, 'Error loading scores 😢', {
            fontSize: '18px',
            color: '#a00',
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);
      });

    const hallBg = this.add.graphics();
    hallBg.fillStyle(0xffffff, 0.7);
    hallBg.fillRoundedRect(230, 420, 340, 165, 5);
    hallBg.setDepth(-1);
  }
}
