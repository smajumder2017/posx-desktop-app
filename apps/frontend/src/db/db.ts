// db.ts
import Dexie, { Table } from 'dexie';

export interface Printer {
  id?: number;
  printerValue: string;
  printerType: string;
  printerLocation: string;
}

export class PosX extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  printers!: Table<Printer>;

  constructor() {
    super('PosX');
    this.version(1).stores({
      printers: '++id, printerValue, printerType, printerLocation' // Primary key and indexed props
    });
  }
}

export const posXDB = new PosX();