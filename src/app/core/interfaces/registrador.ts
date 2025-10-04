export interface TipoRegistrador {
    id: number;
    nombre_tipo: string;
    descripcion: string | null;
    activo: boolean;
}

export interface Registrador {
    id: number;
    nombre_registrador: string;
    id_tipo_registrador: number | null;
    tipo: TipoRegistrador | null;
}