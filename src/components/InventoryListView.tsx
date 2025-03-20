// components/InventoryListView.tsx
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Product } from "../interfaces/Product";
import { ArrowBigLeftDash } from "lucide-react";

interface InventoryListViewProps {
  products: Product[];
  onProductChange: (
    index: number,
    field: "amountPieces" | "amountPackages",
    value: string
  ) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isValid: boolean;
  inventoryDate: string;
  facility: string;
  kioskName: string;
  toggleView: () => void;
  firstInventoryMade: boolean;
}

const InventoryListView = ({
  products,
  onProductChange,
  onSubmit,
  isValid,
  inventoryDate,
  facility,
  kioskName,
  toggleView,
  firstInventoryMade
}: InventoryListViewProps) => {
  return (
    <div className="container mx-auto p-3 h-[100vh] w-full">
      <div className="rounded-xl border border-black text-black">
      <h2 className="text-lg lg:text-3xl text-center w-full mt-10 font-bold">
          Inventera {facility} {kioskName}
        </h2>
        <div className="w-full flex place-items-center flex-col mt-5 gap-3 mb-16">
        <p className="text-sm lg:text-lg">Senast inventering gjord:</p>
        {firstInventoryMade ? (
            <h3 className="lg:text-lg text-xs font-semibold">
               {inventoryDate}
            </h3>
          ) : (
            <p className="text-center text-xs">Ingen inventering gjord</p>
          )}
        </div>
         
        
        <form onSubmit={onSubmit}>
          {products.sort((a,b) => a.productName.localeCompare(b.productName)).map((product, index) => (
            <div
              key={product.id}
              className={`space-y-4 lg:flex 
                odd:bg-gray-100 bg-white
              rounded-lg p-5`}
            >
              <div className="flex flex-col lg:flex-row lg:gap-4">
                <h3 className="text-lg font-bold w-[280px]">{product.productName}</h3>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold">Antal i styck</label>
                  <Input
                    type="number"
                    name="amountPieces"
                    value={product.amountPieces}
                    onChange={(e) =>
                      onProductChange(index, "amountPieces", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold">
                    Antal i förpackning
                  </label>
                  <Input
                    type="number"
                    name="amountPackages"
                    value={product.amountPackages}
                    onChange={(e) =>
                      onProductChange(index, "amountPackages", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="mx-auto w-fit">
            <Button
              type="submit"
              variant="secondary"
              className={`my-10 mx-auto ${
                !isValid ? "bg-gray-500" : "bg-orange-400"
              }`}
              disabled={!isValid}
             
            >
              Skicka in inventering
            </Button>
          </div>
        </form>
        <Button
          type="button"
          className="w-16 h-16 shadow border m-1 p-1 rounded-xl fixed right-3 bottom-3 lg:right-10 xl:right-36"
          variant="outline"
          onClick={() => {
            toggleView();
          }}
        >
          <ArrowBigLeftDash className="w-20 h-20" />
         
        </Button>
      </div>
    </div>
  );
};

export default InventoryListView;
