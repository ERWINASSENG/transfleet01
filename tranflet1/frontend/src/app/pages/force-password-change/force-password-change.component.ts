import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-force-password-change',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './force-password-change.component.html',
  styleUrl: './force-password-change.component.scss',
})
export class ForcePasswordChangeComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = signal('');
  saving = signal(false);

  onSubmit(): void {
    this.errorMessage.set('');

    // Validation
    if (this.newPassword.length < 8) {
      this.errorMessage.set('Le nouveau mot de passe doit faire au moins 8 caractères');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    this.saving.set(true);
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        alert('Mot de passe modifié avec succès !');
        // Redirection selon le rôle
        const user = this.auth.currentUser();
        if (user?.role === 'driver') {
          this.router.navigate(['/trips']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: any) => {
        this.errorMessage.set(err.error?.message || 'Erreur lors du changement de mot de passe');
        this.saving.set(false);
      }
    });
  }
}
