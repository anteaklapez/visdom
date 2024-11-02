import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Image } from '../models/basic-object.interface';

const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';
const IMGBB_CLIENT_ID = environment.imgbbClientId;

interface ImageResponse {
  data: {
      id: string;
      title: string;
      url_viewer: string;
      url: string;
      display_url: string;
      width: number;
      height: number;
      size: number;
      time: number;
      expiration: number;
      image: {
          filename: string;
          name: string;
          mime: string;
          extension: string;
          url: string;
      };
      thumb: {
          filename: string;
          name: string;
          mime: string;
          extension: string;
          url: string;
      };
      delete_url: string;
  };
  success: boolean;
  status: number;
}


@Injectable({
  providedIn: 'root',
})
export class ImgbbService {
  private readonly _http = inject(HttpClient);

  uploadToImgbb(base64Image: string): Observable<ImageResponse> {
    const base64ImageSplit = base64Image.split(',')[1] || base64Image;

    const formData = new FormData();
    formData.append('key', IMGBB_CLIENT_ID);
    formData.append('image', base64ImageSplit);

    return this._http.post<ImageResponse>(IMGBB_API_URL, formData).pipe(
      map((response) => response)
    );
  }
}
