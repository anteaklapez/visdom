import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ImgbbService } from '../../../../services/imgbb.service';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Image } from '../../../../models/basic-object.interface';
import * as uuid from 'uuid';
import { MatDatepicker } from '@angular/material/datepicker';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BuildingType } from '../../../../models/building.interface';

const DEFAULT_IMAGE_FULL = environment.defaultImageFull;
const DEFAULT_IMAGE_SMALL = environment.defaultImageSmall;

@Component({
  selector: 'app-building-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, AsyncPipe],
  templateUrl: './building-form.component.html',
  styleUrl: './building-form.component.scss',
})
export class BuildingFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _imgbbService = inject(ImgbbService);

  filteredBuildingType$!: Observable<string[] | undefined> | undefined;
  isDragging: boolean = false;
  isSubmitting: boolean = false;
  buildingForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  images: string[] = [];
  selectedFiles: File[] = [];

  ngOnInit(): void {
    this.buildingForm = this._fb.group({
      location: ['', Validators.required],
      title: ['', Validators.required],
      price: [
        '',
        [Validators.min(0), Validators.max(10000000), Validators.required],
      ],
      image: [[]],
      roomNumber: ['', Validators.min(0)],
      buildingArea: ['', [Validators.min(0)]],
      gardenArea: ['', [Validators.min(0)]],
      buildYear: [{ value: '', disabled: true }],
      buildingType: [''],
      description: [''],
    });

    this.filteredBuildingType$ = this.buildingForm.get('buildingType')?.valueChanges.pipe(
      startWith(''),
      map((buildingType) => this._filterBuildingType(buildingType || ''))
    );
  }

  onBuildYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    this.buildingForm.controls['buildYear'].setValue(
      new Date(normalizedYear, 12, 0)
    );
    datepicker.close();
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

  private _filterBuildingType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._getBuildingTypeList().filter((brand) =>
      brand.toLowerCase().includes(filterValue)
    );
  }

  private _getBuildingTypeList(): string[] {
    return Object.values(BuildingType);
  }

  onSubmit() {
    if (!this.buildingForm.valid) return;
    this.isSubmitting = true;
    this.buildingForm.value.id = uuid.v4();

    if (this.images.length > 0) {
      const uploadObservables = this.images.map((image) =>
        this._imgbbService.uploadToImgbb(image)
      );

      forkJoin(uploadObservables).subscribe({
        next: (responses) => {
          this.buildingForm.value.image = responses.map((response) => {
            return {
              id: response.data.id,
              full: response.data.image.url,
              small: response.data.thumb.url,
            } as Image;
          });
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.buildingForm.value.image = [
        {
          id: uuid.v4(),
          full: DEFAULT_IMAGE_FULL,
          small: DEFAULT_IMAGE_SMALL,
        } as Image,
      ];
      this.isSubmitting = false;
      console.log(this.buildingForm.value)
    }
  }
}
