export interface Producto {
  id?: number;
  nombre: string;
  codigoBarras: string;
  categoria: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  ubicacionBodega?: string;
}