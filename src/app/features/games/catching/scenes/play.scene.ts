import Phaser from 'phaser';

export class PlayScene extends Phaser.Scene {
  private bucket!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private ground!: Phaser.GameObjects.Graphics;
  private playerName!: string;

  private x = 400;
  private speed = 300;

  //balls
  private balls!: Phaser.Physics.Arcade.Group;

  private ballTypes = [
    { color: 0xa0b400, points: 1 },
    { color: 0x3273c3, points: 5 },
    { color: 0x00186e, points: 10 },
    { color: 0xff00d4, points: 15 },
  ];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private totalBalls = 4;
  private ballsCaught = 0;
  private gameOverText!: Phaser.GameObjects.Text;

  // extras
  private turbo = 2;

  constructor() {
    super('PlayScene');
  }

  create() {
    this.playerName = this.registry.get('playerName') || 'Anonymous';
    this.scoreText = this.add.text(20, 20, this.playerName, {
      fontSize: '24px',
      color: '#000',
      fontFamily: 'Arial',
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    // increase cursor triggered movement speed

    // draw ground once
    this.ground = this.add.graphics();
    const groundHeight = 60;
    this.ground.fillStyle(0x00b324, 1);
    this.ground.fillRect(0, 600 - groundHeight, 800, groundHeight);
    this.ground.setDepth(2);

    // bucket
    this.bucket = this.physics.add.sprite(400, 530, 'bucket');
    this.bucket.setScale(0.7);
    this.bucket.setCollideWorldBounds(true);
    (this.bucket.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.bucket.setDepth(2);
    // this.bucket.setVelocityX(600);

    // balls
    this.balls = this.physics.add.group();
    // Spawn a new ball every 800ms
    this.time.addEvent({
      delay: 800,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true,
    });

    //set up overlap detection after both exist
    this.physics.add.overlap(this.bucket, this.balls, (bucket, ball) => {
      this.catchBall(bucket as Phaser.Physics.Arcade.Sprite, ball as Phaser.GameObjects.Arc);
    });

    this.scoreText = this.add.text(20, 40, 'Score: 0', {
      fontSize: '24px',
      color: '#000',
      fontFamily: 'Arial',
    });
    this.scoreText.setDepth(10);
  }

  override update(_: number, delta: number) {
    let move = (this.speed * delta) / 600;

    if (this.cursors.left.isDown) {
      if (this.cursors.space.isDown) {
        this.bucket.x -= move * this.turbo;
      } else {
        this.bucket.x -= move;
      }
    } else if (this.cursors.right.isDown) {
      if (this.cursors.space.isDown) {
        this.bucket.x += move * this.turbo;
      } else {
        this.bucket.x += move;
      }
    }

    // Clamp to screen bounds
    this.bucket.x = Phaser.Math.Clamp(this.bucket.x, 30, 770);
    this.ground.setDepth(2);
    //
    // Remove balls that fall below the screen
    this.balls.children.each((ball) => {
      if ((ball as Phaser.Physics.Arcade.Image).y > 600) {
        (ball as Phaser.Physics.Arcade.Image).destroy();
        return false; // Remove this ball from the group
      }
      return true; // Keep iterating
    });
  }

  private spawnBall() {
    const x = Phaser.Math.Between(20, 780);
    const type = Phaser.Utils.Array.GetRandom(this.ballTypes); // pick one
    const ball = this.add.circle(x, 0, 18, type.color);
    (ball as any).points = type.points; // store point value on the ball object
    ball.setDepth(1);

    this.physics.add.existing(ball);
    const body = ball.body as Phaser.Physics.Arcade.Body;

    body.setAllowGravity(true);
    body.setVelocityY(Phaser.Math.Between(100, 200));
    body.setBounce(0.6);
    body.setCollideWorldBounds(true);

    this.balls.add(ball);
  }

  /// ---- detect catches---------------
  private catchBall(bucket: Phaser.Physics.Arcade.Sprite, ball: Phaser.GameObjects.Arc) {
    const points = (ball as any).points || 0;
    this.score += points;
    this.ballsCaught++;
    this.scoreText.setText('Score: ' + this.score);

    // Get the ball color and apply it as a tint to the bucket
    const ballColor = ball.fillColor;
    this.bucket.setTint(ballColor);

    this.tweens.add({
      targets: this.bucket,
      scaleX: 0.75,
      scaleY: 0.75,
      yoyo: true,
      duration: 100,
    });

    ball.destroy();

    // Check if game is over
    if (this.ballsCaught >= this.totalBalls) {
      this.gameOver();
    }
  }

  private gameOver() {
    // Stop spawning new balls
    this.time.removeAllEvents();

    // Destroy all remaining balls
    this.balls.children.each((ball) => {
      (ball as Phaser.Physics.Arcade.Image).destroy();
      return true;
    });
    this.bucket.clearTint();
    // Show game over text
    this.gameOverText = this.add.text(400, 300, 'GAME OVER!\nFinal Score: ' + this.score, {
      fontSize: '32px',
      color: ' #003598',
      fontFamily: 'Arial',
      align: 'center',
    });
    this.gameOverText.setOrigin(0.5, 0.5);
    this.gameOverText.setDepth(20);

    // Add restart instruction
    const restartText = this.add.text(400, 400, `Press R to restart`, {
      fontSize: '20px',
      color: '#000',
      fontFamily: 'Arial',
      align: 'center',
    });
    restartText.setOrigin(0.5, 0.5);
    restartText.setDepth(20);

    // Add back to main menu instruction
    const menuText = this.add.text(400, 430, `Press M to return to main menu`, {
      fontSize: '20px',
      color: '#000',
      fontFamily: 'Arial',
      align: 'center',
    });
    menuText.setOrigin(0.5, 0.5);
    menuText.setDepth(20);

    // Make just the R and M letters bold using rich text
    restartText.setText('Press R to restart');
    menuText.setText('Press M to return to main menu');

    // Listen for restart key
    this.input.keyboard?.on('keydown-R', () => {
      this.scene.restart();
    });

    this.input.keyboard?.on('keydown-M', () => {
      this.scene.start('PreloadScene');
    });

    (window as any).scoreService
      .addScore(this.playerName, this.score) // optionally pass 'gameId'
      .then(() => {
        this.add
          .text(400, 200, 'Score saved!', {
            fontSize: '20px',
            color: '#00AA00',
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);
      })
      .catch((err: any) => {
        console.error('Error saving score:', err);
        this.add
          .text(400, 500, 'Could not save score 😢', {
            fontSize: '20px',
            color: '#AA0000',
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);
      });
    // fetch('http://localhost:3000/scores', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     user: this.playerName,
    //     score: this.score,
    //     timestamp: new Date().toISOString(),
    //   }),
    // });
  }
}
