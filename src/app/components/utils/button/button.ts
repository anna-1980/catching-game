import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonPriority, ButtonSize } from './button-enum';

@Pipe({
  name: 'buttonClass',
  standalone: true,
})
export class ButtonClassPipe implements PipeTransform {
  transform(
    priority: ButtonPriority,
    size: ButtonSize,
    expanded?: boolean,
    className?: string
  ): string {
    const classes = [
      'btn',
      `btn--${priority}`,
      `btn--${size}`,
      expanded ? 'btn--expanded' : '',
      className || '',
    ];
    return classes.filter(Boolean).join(' ');
  }
}

@Component({
  standalone: true,
  selector: 'app-button',
  imports: [CommonModule, RouterModule, ButtonClassPipe],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() className?: string;
  @Input() priority: ButtonPriority = ButtonPriority.PRIMARY;
  @Input() size: ButtonSize = ButtonSize.MEDIUM;
  @Input() disabled?: boolean;
  @Input() expanded?: boolean;
  @Output() btnClick = new EventEmitter<Event>();
  @Input() link?: string;

  private router = inject(Router);

  handleClick(event: Event) {
    this.btnClick.emit(event);
    const externalLink = this.link?.includes('https://');

    if (this.link) {
      if (externalLink) {
        window.location.href = this.link as string;
      } else {
        const route = Array.isArray(this.link) ? this.link : [this.link];
        this.router.navigate(route);
      }
    }
  }
}
