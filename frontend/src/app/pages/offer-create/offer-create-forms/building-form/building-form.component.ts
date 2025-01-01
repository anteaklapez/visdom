import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { ImgbbService } from '../../../../services/imgbb.service';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import * as uuid from 'uuid';
import { MatDatepicker } from '@angular/material/datepicker';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Building,
  BuildingType,
  Floors,
} from '../../../../models/building.interface';
import { ItemService } from '../../../../services/item.service';
import { Router } from '@angular/router';

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
  private readonly _itemService = inject(ItemService);
  private readonly _router = inject(Router);

  filteredBuildingType$!: Observable<string[] | undefined> | undefined;
  filteredFloors$!: Observable<string[] | undefined> | undefined;
  isDragging: boolean = false;
  isSubmitting: boolean = false;
  buildingForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  images: string[] = [];
  selectedFiles: File[] = [];
  title: string = 'DODAVANJE NEKRETNINE';
  dataToEdit: Building | null = null;

  ngOnInit(): void {
    this.dataToEdit = this._itemService.getItemToEdit() as Building | null;

    this.buildingForm = this._fb.group({
      location: [null, Validators.required],
      title: [null, Validators.required],
      price: [
        null,
        [Validators.min(0), Validators.max(10000000), Validators.required],
      ],
      images: [[]],
      roomNumber: [null, Validators.min(0)],
      buildingArea: [null, [Validators.min(0)]],
      gardenArea: [null, [Validators.min(0)]],
      floors: [null, [Validators.min(0)]],
      bathroomNumber: [null, [Validators.min(0)]],
      buildYear: [{ value: null, disabled: true }],
      buildingType: [null],
      description: [null],
    });

    if (this.dataToEdit) {
      this.title = 'UREĐIVANJE NEKRETNINE';
      this.buildingForm.patchValue({
        location: this.dataToEdit.location,
        title: this.dataToEdit.title,
        price: this.dataToEdit.price,
        roomNumber: this.dataToEdit.roomNumber,
        bathroomNumber: this.dataToEdit.bathroomNumber,
        floors: this.dataToEdit.floors,
        buildingArea: this.dataToEdit.buildingArea,
        gardenArea: this.dataToEdit.gardenArea,
        buildYear: new Date(this.dataToEdit.buildYear as any, 0, 1),
        buildingType: this.dataToEdit.buildingType,
        description: this.dataToEdit.description,
      });

      if (this.dataToEdit.images) {
        this.images = this.dataToEdit.images.map((img) => img.full);
        this.buildingForm.get('images')?.setValue(this.dataToEdit.images);
      }
    }

    this.filteredBuildingType$ = this.buildingForm
      .get('buildingType')
      ?.valueChanges.pipe(
        startWith(''),
        map((buildingType) => this._filterBuildingType(buildingType || null))
      );

    this.filteredFloors$ = this.buildingForm.get('floors')?.valueChanges.pipe(
      startWith(''),
      map((floors) => this._filterFloors(floors || null))
    );
  }

  onBuildYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    this.buildingForm.controls['buildYear'].setValue(date);
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
    return this._getBuildingTypeList().filter((type) =>
      type.toLowerCase().includes(filterValue)
    );
  }

  private _filterFloors(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._getFloorsTypeList().filter((floor) =>
      floor.toLowerCase().includes(filterValue)
    );
  }

  private _getBuildingTypeList(): string[] {
    return Object.values(BuildingType);
  }

  private _getFloorsTypeList(): string[] {
    return Object.values(Floors);
  }

  private _convertDateSelectionToString() {
    const buildYear = this.buildingForm.get('buildYear')?.value;

    if (buildYear instanceof Date) {
      this.buildingForm
        .get('buildYear')
        ?.setValue(buildYear.getFullYear().toString());
    } else {
      this.buildingForm.get('buildYear')?.setValue(null);
    }
  }

  onSubmit(): void {
    if (!this.buildingForm.valid) return;
    this.isSubmitting = true;

    this._convertDateSelectionToString();

    const buildingData = this.buildingForm.getRawValue() as Building;

    if (this.images.length > 0) {
      const uploadObservables = this.images.map((image) =>
        this._imgbbService.uploadToImgbb(image)
      );

      forkJoin(uploadObservables).subscribe({
        next: (responses) => {
          const uploadedImages = responses.map((response) => ({
            id: uuid.v4(),
            full: response.data.image.url,
            small: response.data.thumb.url,
          }));
          buildingData.images = uploadedImages;

          if (this.dataToEdit) {
            this._updateBuilding(this.dataToEdit.id, buildingData);
          } else {
            buildingData.id = uuid.v4();
            this._createBuilding(buildingData);
          }
        },
        error: (err) => {
          console.error('Error uploading images:', err);
          this.isSubmitting = false;
        },
      });
    } else {
      buildingData.images = this.dataToEdit?.images || [
        {
          id: uuid.v4(),
          full: DEFAULT_IMAGE_FULL,
          small: DEFAULT_IMAGE_SMALL,
        },
      ];

      if (this.dataToEdit) {
        this._updateBuilding(this.dataToEdit.id, buildingData);
      } else {
        buildingData.id = uuid.v4();
        this._createBuilding(buildingData);
      }
    }
  }

  private _updateBuilding(buildingId: string, buildingData: Building) {
    this._itemService
      .updateBuilding({ ...buildingData, id: buildingId })
      .subscribe({
        next: (res) => {
          this._router.navigate(['/ponuda/nekretnine']);
        },
        error: (err) => {
          console.error('Error updating car:', err);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }

  private _createBuilding(buildingData: Building) {
    this._itemService.createBuilding(buildingData).subscribe({
      next: (res) => {
        this._router.navigate(['/ponuda/nekretnine']);
      },
      error: (err) => {
        console.error('Error creating car:', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
