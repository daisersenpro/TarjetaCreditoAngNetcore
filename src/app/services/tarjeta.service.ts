import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  // Inyeccion de Api
  private myAppUrl = 'https://localhost:44389/';
  private myApiUrl = 'api/tarjeta/';

  constructor(private http: HttpClient) { }

  getListTrajetas(): Observable<any[]> {
    return this.http.get<any[]>(this.myAppUrl + this.myApiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Metodo de eliminacion
  deleteTarjeta(id:number): Observable<any>{
    return this.http.delete(this.myAppUrl + this.myApiUrl + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);
    return throwError('Algo salió mal; por favor, inténtalo de nuevo más tarde.');
  }

  //Metodo Save Tarjeta
  saveTarjeta(tarjeta: any): Observable<any>{
    return this.http.post(this.myAppUrl + this.myApiUrl, tarjeta);
  }

  updateTarjeta(id: number, tarjeta: any): Observable<any>{
    return this.http.put(this.myAppUrl + this.myApiUrl + id, tarjeta);
  }
}
