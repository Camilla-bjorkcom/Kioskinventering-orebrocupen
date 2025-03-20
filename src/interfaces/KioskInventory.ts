import { Product } from "./Product";

export type KioskInventory = {
    id: string;
    kioskName: string;
    facility: string;
    inventoryDate: string;
    products: Product[];
    firstInventoryMade: boolean;
  };