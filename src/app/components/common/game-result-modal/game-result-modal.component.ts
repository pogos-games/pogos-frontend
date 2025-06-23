import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgClass } from '@angular/common';

export interface GameResult {
  isWin: boolean;
  isTie: boolean;
  bet: number;
  winAmount: number;
  newBalance: number;
  playerHands?: HandResult[];
  dealerHand?: HandResult;
}

export interface HandResult {
  value: number;
  status: 'win' | 'lose' | 'tie' | 'bust';
}

@Component({
  selector: 'app-game-result-modal',
  standalone: true,
  imports: [
    NzModalModule,
    NgClass
  ],
  templateUrl: './game-result-modal.component.html',
  styleUrl: './game-result-modal.component.scss'
})
export class GameResultModalComponent {
  @Input({ required: true }) isVisible: WritableSignal<boolean> = signal(false);
  @Input({ required: true }) gameResult: GameResult | null = null;

  @Output() onReplay: EventEmitter<void> = new EventEmitter<void>();
  @Output() onQuit: EventEmitter<void> = new EventEmitter<void>();

  getResultClass(): string {
    if (!this.gameResult) return '';
    
    if (this.gameResult.isWin) return 'win';
    if (this.gameResult.isTie) return 'tie';
    return 'lose';
  }

  getResultTitle(): string {
    if (!this.gameResult) return '';
    
    if (this.gameResult.isWin) return 'Victoire !';
    if (this.gameResult.isTie) return 'Égalité !';
    return 'Défaite !';
  }

  getResultMessage(): string {
    if (!this.gameResult) return '';
    
    if (this.gameResult.isWin) {
      return `Félicitations ! Vous avez gagné ${this.gameResult.winAmount} points !`;
    }
    if (this.gameResult.isTie) {
      return 'Match nul ! Votre mise vous est restituée.';
    }
    return `Dommage ! Vous avez perdu ${Math.abs(this.gameResult.winAmount)} points.`;
  }

  getHandStatusClass(status: string): string {
    return status;
  }

  getHandStatusText(status: string): string {
    switch (status) {
      case 'win': return 'Gagnant';
      case 'lose': return 'Perdant';
      case 'tie': return 'Égalité';
      case 'bust': return 'Bust';
      case 'blackjack': return 'Blackjack !';
      default: return status;
    }
  }

  handleReplay(): void {
    this.isVisible.set(false);
    this.onReplay.emit();
  }

  handleQuit(): void {
    this.isVisible.set(false);
    this.onQuit.emit();
  }
}