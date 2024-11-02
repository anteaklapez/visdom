import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const IMGUR_API_URL = 'https://api.imgur.com/3/image';
const IMGUR_CLIENT_ID = environment.imgurClientId;

@Injectable({
  providedIn: 'root',
})
export class ImgurService {
  private readonly _http = inject(HttpClient);

  uploadToImgur(image: string): Observable<string> {
    const formData = new FormData();
    formData.append('image', image);

    return this._http
      .post<any>(IMGUR_API_URL, formData, {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      })
      .pipe(map((response) => response.data.link));
  }

  async uploadXhr(image: any) {
    return new Promise((resolve, reject) => {
      let img = image.substr(image.indexOf(',') + 1);

      let fd = new FormData();
      fd.append('image', img);

      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);

      xhr.onload = resolve;
      xhr.onerror = reject;

      xhr.setRequestHeader('Authorization', `Client-ID ${IMGUR_CLIENT_ID}`);

      xhr.send(fd);
    });
  }
}
