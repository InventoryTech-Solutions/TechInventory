export interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  precio: number;
  stockActual: number;
  codigoBarras?: string;
  stockMinimo?: number;
  ubicacionBodega?: string;
  imagenUrl?: string;
}