import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaisSmall, Pais } from '../interfaces/paises.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v2/';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia','Europe', 'Oceania'];

  get regiones(): string[]{

    //this.http.get().subscribe
    //const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`;https://restcountries.com/v3.1/region
    //return this.http.get<PaisSmall[]>(url);

    return [...this._regiones];//desestructuro
  }

  constructor(private http:HttpClient) { }

  getPaisesPorRegion(region:string): Observable<PaisSmall[]>{
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);

  }

/*   getFronterasPorPais(region:string): Observable<PaisSmall[]>{
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);

  } */

  getPaisPorCodigo(codigo:string): Observable<Pais | null>{
    if (!codigo) {
      return of(null);
    }
    const url: string = `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url);

  }

  getPaisPorCodigoSmall(codigo:string): Observable<PaisSmall>{

    const url: string = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>(url);

  }

  getPaisesPorCodigos(borders:string[]): Observable<PaisSmall[]>{
    if (!borders) {
      return of([]);
    }
    const peticiones:Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);//almaceno la peticion
      peticiones.push(peticion);
    });

    return  combineLatest(peticiones) ;

  }

}
