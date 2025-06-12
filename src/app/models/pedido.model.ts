export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
}

export interface Mesa {
  id: number;
  numero: number;
  ubicacion: string;
}

export interface Mesero {
  id_mesero: number;
  nombre: string;
  documento: string;
  turno: string;
}

export interface Repartidor {
  id: number;
  nombre: string;
  telefono: string;
  vehiculo: string;
}

export interface EstadoPedido {
  id: number;
  estado: string;
  fecha_hora: string;
}

export interface Menu {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface PedidoMenu {
  id_pedido: number;
  id_menu: number;
  cantidad: number;
  subtotal: number;
  menu: Menu;
}

export interface Pedido {
  id: number;
  tipo_pedido: string;
  fecha_hora: string;
  tiempo_estimado_preparacion: number;
  tiempo_estimado_entrega: number;
  estado_actual: string;
  id_clientes: number;
  id_mesa: number;
  id_mesero?: number | null;
  id_repartidor?: number | null;
  cliente: Cliente;
  mesa: Mesa;
  mesero: Mesero;
  repartidor: Repartidor | null;
  estados: EstadoPedido[];
  pedido_menus: PedidoMenu[];
}
