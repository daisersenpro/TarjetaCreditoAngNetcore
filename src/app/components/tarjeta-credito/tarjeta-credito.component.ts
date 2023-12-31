import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id: number | undefined;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _tarjetaService: TarjetaService
  ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this._tarjetaService.getListTrajetas().subscribe(
      data => {
        console.log(data);
        this.listTarjetas = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  guardarTarjeta() {
    console.log(this.form);

    const tarjeta: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
    }

    if(this.id == undefined){
      //Agregamos una nueva tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La tarjeta fue registrada con Exito!', 'Tarjeta Registrada!');
        this.obtenerTarjetas();
        this.form.reset();
      }, error =>{
        this.toastr.error('Opss.. ocurrio un error','Error')
        console.log(error);
      });
    }else {
      tarjeta.id = this.id;
      //Editamos la tarjeta
      this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe( data =>{
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con exito!', 'Tarjeta Actualizada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
      })
    }

    
  }

  eliminarTarjeta(id: number) {
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada con exito', 'Trajeta eliminada');
      this.obtenerTarjetas();
    }, error => {
      console.log(error);
    })
    
  }

  editarTarjeta(tarjeta: any){
    this.accion = 'Editar';
    this.id = tarjeta.id;

    //metodo para rellenar
    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
  }
}
