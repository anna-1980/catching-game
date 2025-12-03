import Phaser from 'phaser';
import { gameState } from './../game-state';

export class PlayLevelOne extends Phaser.Scene {
  private bucket!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private ground!: Phaser.GameObjects.Graphics;
  private playerName!: string;

  private background!: Phaser.GameObjects.TileSprite;

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
  private scoreLocal = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private totalBalls = 20;
  private ballsCaught = 0;
  private gameOverText!: Phaser.GameObjects.Text;

  // extras
  private turbo = 2;

  constructor() {
    super('PlayLevelOne');
  }

  private finishLevel(success: boolean) {
    // stop timers etc.
    this.time.removeAllEvents();

    this.balls.children.each((ball) => {
      (ball as Phaser.Physics.Arcade.Image).destroy();
      return true;
    });

    this.bucket.clearTint();

    gameState.lastResult = success ? 'win' : 'lose';

    this.scene.start('GameOverScene', {
      score: gameState.score,
      playerName: gameState.playerName,
      level: gameState.level,
      success,
    });
  }

  init() {
    // reset per-run values
    this.ballsCaught = 0;
    this.scoreLocal = 0;
    gameState.score = 0;

    // if you use lives as “per run”, reset here too:
    // gameState.lives = 3;

    // if you store any flags about this level, reset them here as well
  }

  create() {
    // game state --------------------------------------------------------------------------
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;

    // this.playerName = this.registry.get('playerName') || 'Anonymous';
    this.playerName = gameState.playerName;

    this.scoreText = this.add.text(20, 20, this.playerName, {
      fontSize: '24px',
      color: '#000',
      fontFamily: 'Arial',
    });

    //  BACKGROUND
    this.background = this.add.tileSprite(0, 0, 1600, 1200, 'bg-pattern'); // full game size
    this.background.setOrigin(0, 0);
    this.background.setScale(0.5);

    this.background.setDepth(0); // behind everything
    this.background.setScrollFactor(0); // stay fixed to camera

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

    //------- addeing controll arrows for player movement on small screens-------//
    // const left = this.add
    //   .image(30, 448, 'left')
    //   .setOrigin(0.5, 0.5)
    //   .setScale(0.25)
    //   .setInteractive();

    // const right = this.add
    //   .image(770, 448, 'right')
    //   .setOrigin(0.5, 0.5)
    //   .setScale(0.25)
    //   .setInteractive();
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

    // Scroll the background (sideways)
    const bgSpeed = 0.2; // tweak this for faster/slower scroll
    this.background.tilePositionX += bgSpeed * delta;
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
    gameState.score += points;
    this.ballsCaught++;
    this.scoreLocal = gameState.score;
    this.scoreText.setText('Score: ' + this.scoreLocal);

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

    // Check if level is over
    // ✅ Level successfully completed
    if (this.ballsCaught >= this.totalBalls) {
      // ✅ Level successfully completed
      this.finishLevel(true);
    }

    if (gameState.lives <= 0) {
      this.finishLevel(false);
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

    // 👉 jump to GameOverScene and pass data
    this.scene.start('GameOverScene', {
      score: gameState.score,
      playerName: gameState.playerName,
      level: gameState.level,
    });
  }
}
