import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais:  ['', Validators.required],
    frontera:  ['', Validators.required],
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando:boolean = false;

  constructor(private fb:FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

/*     this.miFormulario.get('region')?.valueChanges.subscribe(region => {
      console.log(region);
      this.paisesService.getPaisesPorRegion(region).subscribe(paises => {
        console.log(paises);
        this.paises = paises;
      })
    }) */

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(region => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(pais => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
      )
      .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
      });

  }

  guardar(){
    console.log(this.miFormulario.valid);//https://restcountries.com/
  }

}
