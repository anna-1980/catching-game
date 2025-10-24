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

    this.registry.set('playerName', 'Anna');
    this.registry.set('score', 0);
  }

  create() {
    // Add instructions before starting the game

    let nameForm = this.add.dom(400, 350).createFromCache('nameform');

    nameForm.addListener('submit');
    nameForm.on('submit', (event: any) => {
      event.preventDefault();
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

    // Wait for spacebar to start the game
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.scene.start('PlayScene');
    });

    /// get the scores
    // --- HALL OF FAME ---
    this.add
      .text(400, 450, '🏆 HALL OF FAME 🏆', {
        fontSize: '24px',
        color: '#002C5C',
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5);

    // Fetch top 5 scores
    fetch('http://localhost:3000/scores?_sort=score&_order=desc&_limit=5')
      .then((res) => res.json())
      .then((scores: any[]) => {
        if (scores.length === 0) {
          this.add
            .text(400, 490, 'No scores yet — be the first!', {
              fontSize: '18px',
              color: '#444',
              fontFamily: 'Arial',
              align: 'center',
            })
            .setOrigin(0.5);
          return;
        }

        let text = '';
        scores.forEach((entry, i) => {
          text += `${i + 1}. ${entry.user.padEnd(5)}   ${entry.score}\n`;
        });

        this.add
          .text(400, 530, text, {
            fontSize: '20px',
            color: '#003598',
            fontFamily: 'Courier New, monospace',
            align: 'center',
          })
          .setOrigin(0.5);
      })
      .catch((err) => {
        console.error('Error fetching scores:', err);
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
