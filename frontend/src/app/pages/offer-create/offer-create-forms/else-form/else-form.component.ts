import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImgbbService } from '../../../../services/imgbb.service';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BasicObject, Image } from '../../../../models/basic-object.interface';
import * as uuid from 'uuid';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemService } from '../../../../services/item.service';
import { Router } from '@angular/router';

const DEFAULT_IMAGE_FULL = environment.defaultImageFull;
const DEFAULT_IMAGE_SMALL = environment.defaultImageSmall;

@Component({
  selector: 'app-else-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './else-form.component.html',
  styleUrl: './else-form.component.scss',
})
export class ElseFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _imgbbService = inject(ImgbbService);
  private readonly _itemService = inject(ItemService);
  private readonly _router = inject(Router);
  title: string = 'DODAVANJE OSTALIH PROIZVODA';
  dataToEdit: BasicObject | null = null;

  isDragging: boolean = false;
  isSubmitting: boolean = false;
  basicObjectForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  images: string[] = [];
  selectedFiles: File[] = [];

  ngOnInit(): void {
    this.dataToEdit = this._itemService.getItemToEdit() as BasicObject | null;

    this.basicObjectForm = this._fb.group({
      subject: ['', Validators.required],
      price: [
        '',
        [Validators.min(0), Validators.max(10000000), Validators.required],
      ],
      image: [[]],
      description: [''],
    });

    if (this.dataToEdit) {
      this.title = 'UREĐIVANJE OSTALIH PROIZVODA';
      this.basicObjectForm.patchValue({
        subject: this.dataToEdit.subject,
        price: this.dataToEdit.price,
        description: this.dataToEdit.description,
      });

      if (this.dataToEdit.images) {
        this.images = this.dataToEdit.images.map((img) => img.full);
        this.basicObjectForm.get('images')?.setValue(this.dataToEdit.images);
      }
    }
  }

  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const selectedFiles = Array.from(input.files);

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result as string;

          if (!this.images.includes(imageDataUrl)) {
            this.images.push(imageDataUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onClearImages() {
    this.images = [];
    this.selectedFiles = [];
  }

  onDeleteImage(image: string) {
    this.images = this.images.filter((i) => i !== image);
    this.selectedFiles = this.selectedFiles.filter((f) => f.name !== image);
  }

  onImageDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }

  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded() {
    this.isDragging = false;
  }

  onSubmit() {
    // 3. Validate the form
    if (!this.basicObjectForm.valid) return;
    this.isSubmitting = true;

    // Prepare the form data as our BasicObject
    const basicObjectData = this.basicObjectForm.value as BasicObject;

    // If editing, keep the existing ID; otherwise generate a new one
    if (this.dataToEdit) {
      basicObjectData.id = this.dataToEdit.id;
    } else {
      basicObjectData.id = uuid.v4();
    }

    // 4. Handle image uploads (or defaults)
    if (this.images.length > 0) {
      const uploadObservables = this.images.map((image) =>
        this._imgbbService.uploadToImgbb(image)
      );

      forkJoin(uploadObservables).subscribe({
        next: (responses) => {
          basicObjectData.images = responses.map((response) => {
            return {
              id: response.data.id,
              full: response.data.image.url,
              small: response.data.thumb.url,
            } as Image;
          });

          // 5. Create or Update
          if (this.dataToEdit) {
            this._updateBasicObject(basicObjectData);
          } else {
            this._createBasicObject(basicObjectData);
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.isSubmitting = false;
        },
      });
    } else {
      // If no new images were uploaded, either keep existing images or use defaults
      basicObjectData.images =
        this.dataToEdit?.images || [
          {
            id: uuid.v4(),
            full: DEFAULT_IMAGE_FULL,
            small: DEFAULT_IMAGE_SMALL,
          },
        ];

      if (this.dataToEdit) {
        this._updateBasicObject(basicObjectData);
      } else {
        this._createBasicObject(basicObjectData);
      }
    }
  }

  private _updateBasicObject(basicObjectData: BasicObject) {
    // Replace with your actual update service method:
    this._itemService.updateBasicObject(basicObjectData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this._router.navigate(['/ponuda/ostalo']);
      },
      error: (err) => {
        console.error('Error updating object:', err);
        this.isSubmitting = false;
      },
    });
  }

  private _createBasicObject(basicObjectData: BasicObject) {
    // Replace with your actual create service method:
    this._itemService.createBasicObject(basicObjectData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this._router.navigate(['/ponuda/ostalo']);
      },
      error: (err) => {
        console.error('Error creating object:', err);
        this.isSubmitting = false;
      },
    });
  }
}
