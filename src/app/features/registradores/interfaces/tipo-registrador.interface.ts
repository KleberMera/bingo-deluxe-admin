export interface TipoRegistrador {
  id: number;
  nombre_tipo: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}