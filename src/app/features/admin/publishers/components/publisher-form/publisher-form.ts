import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';
import { PublisherRequest, PublisherUpdateRequest } from '../../models/publisher.model';

@Component({
  selector: 'app-publisher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './publisher-form.html'
})
export class PublisherForm implements OnInit {
  private fb = inject(FormBuilder);
  private publisherService = inject(PublisherService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  publisherForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  publisherId = signal<string | null>(null);

  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.publisherId.set(id);
      this.loadPublisherData(id);
    }
  }

  private initForm(): void {
    this.publisherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]],
      address: ['']
    });
  }

  private loadPublisherData(id: string): void {
    this.publisherService.getPublisherById(id).subscribe({
      next: (publisher) => {
        this.publisherForm.patchValue({
          name: publisher.name,
          code: publisher.code,
          address: publisher.address
        });
      },
      error: () => this.errorMessage.set('Impossible de charger les données de l\'éditeur.')
    });
  }

  onSubmit(): void {
    if (this.publisherForm.invalid) {
      this.publisherForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    if (this.isEditMode() && this.publisherId()) {
      const updatePayload: PublisherUpdateRequest = this.publisherForm.value;
      this.publisherService.updatePublisher(this.publisherId()!, updatePayload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    } else {
      const createPayload: PublisherRequest = this.publisherForm.value;
      this.publisherService.createPublisher(createPayload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(): void {
    this.isSubmitting.set(false);
    this.router.navigate(['/admin/publishers']);
  }

  private handleError(err: any): void {
    console.error('Erreur enregistrement éditeur:', err);
    this.errorMessage.set('Une erreur est survenue lors de l\'enregistrement.');
    this.isSubmitting.set(false);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.publisherForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
