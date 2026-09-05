export interface MovimientoInventario {
  id?: number;
  productoId: number;
  tipoMovimiento: 'INGRESO' | 'SALIDA' | 'TRANSFERENCIA';
  cantidad: number;
  fecha?: string;
  usuarioId?: string;
  observacion?: string;
}