import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';
import { PublisherRequest } from '../../models/publisher.model';

@Component({
  selector: 'app-publisher-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './publisher-form.html',
  styleUrl: './publisher-form.css'
})
export class PublisherForm {
  private publisherService = inject(PublisherService);
  private router = inject(Router);

  publisherForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    address: new FormControl('')
  });

  onSubmit(): void {
    if (this.publisherForm.valid) {
      const newPublisher: PublisherRequest = {
        name: this.publisherForm.value.name!,
        code: this.publisherForm.value.code!,
        address: this.publisherForm.value.address || undefined
      };

      this.publisherService.createPublisher(newPublisher).subscribe({
        next: () => {
          alert('Éditeur enregistré !');
          this.router.navigate(['/publishers']);
        },
        error: (err) => {
          console.error("Erreur d'enregistrement", err);
          alert("Erreur lors de la création de l'éditeur.");
        }
      });
    }
  }
}
