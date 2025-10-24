import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from './main.scene';
import { PlayScene } from './scenes/play.scene';
import { PreloadScene } from './scenes/preload.scene';
import { ScoreService } from '../../../services/score.service';

@Component({
  standalone: true,
  selector: 'app-catching',
  imports: [],
  templateUrl: './catching.html',
  styleUrl: './catching.scss',
})
export class Catching implements OnInit, OnDestroy {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef<HTMLDivElement>;
  private game!: Phaser.Game;
  private scoreService = inject(ScoreService);

  ngOnInit() {
    //   Make service reachable from Phaser scenes
    (window as any).scoreService = this.scoreService;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: this.gameContainer.nativeElement,
      backgroundColor: '#94E6FF',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {
            y: 300,
            x: 0,
          },
          debug: false,
        },
      },
      dom: {
        createContainer: true,
      },

      scene: [PreloadScene, PlayScene, MainScene],
    };

    this.game = new Phaser.Game(config);
  }

  ngOnDestroy() {
    this.game.destroy(true);
  }
}
