import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WorksheetService {
  constructor(private http: HttpClient) {}

  getWorksheetJson() {
    return this.http.get<any>('assets/worksheets.json');
  }
}
