import { useEffect, useState } from "react";
import Keypad, { KeypadKeys } from "./components/Keypad";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

type KioskInventory = {
  id: number;
  products: Products[];
};

interface Products {
  id: number;
  productName: string;
  amountPieces: string | number;
  amountPackages: string | number;
}

const App2 = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [keypadTarget, setKeypadTarget] = useState<"pieces" | "packages">(
    "pieces"
  );
  const [products, setProducts] = useState<Products[]>([]);
  const [editedProducts, setEditedProducts] = useState<Products[]>([]);
  const [activeInput, setActiveInput] = useState<"pieces" | "packages" | null>(
    null
  );


  const facility = "Rosta Gärde";
  const kiosk = "Kiosk 1";
  const inventoryDate = "2025-06-13 14:25";

  const id = "3395";

  const { data, isLoading, error } = useQuery<Products[]>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/inventoryList/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: KioskInventory = await response.json();
      return data.products;
    },
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
      setEditedProducts(
        data.map((product) => ({
          ...product,
          amountPieces: "", // Initialt tomt
          amountPackages: "", // Initialt tomt
        }))
      );
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      const url = `http://localhost:3000/inventoryList/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: editedProducts }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update list");
      }
      toast({
        title: "Lyckat!",
        description: "Inventeringen skickades iväg",
      });
    } catch (error) {
      console.error("Update failed:", error);
      alert("Misslyckades med att spara ändringar.");
    }
  };

  const handleKeypadPress = (keyPadKey: KeypadKeys) => {
    if (!editedProducts.length) return;

    const currentProduct = editedProducts[currentProductIndex];

    if (keyPadKey === KeypadKeys.CLEAR) {
      updateCurrentProduct(keypadTarget, "");
      return;
    }

    if (keyPadKey === KeypadKeys.BKSP) {
      updateCurrentProduct(keypadTarget, (prevValue) => prevValue.slice(0, -1));
      return;
    }

    updateCurrentProduct(keypadTarget, (prevValue) => prevValue + keyPadKey);
  };

  const updateCurrentProduct = (
    field: "pieces" | "packages",
    newValue: string | ((prev: string) => string)
  ) => {
    const parseValue = (value: string) => {
      const parsedValue = parseInt(value, 10);
      return isNaN(parsedValue) ? "" : parsedValue;
    };

    setEditedProducts((prevProducts) =>
      prevProducts.map((product, index) =>
        index === currentProductIndex
          ? {
              ...product,
              [field === "pieces" ? "amountPieces" : "amountPackages"]:
                typeof newValue === "function"
                  ? parseValue(
                      newValue(
                        String(
                          product[
                            field === "pieces"
                              ? "amountPieces"
                              : "amountPackages"
                          ]
                        )
                      )
                    )
                  : parseValue(newValue),
            }
          : product
      )
    );
  };

  const goToNextProduct = () => {
    setCurrentProductIndex((prevIndex) =>
      prevIndex + 1 >= products.length ? 0 : prevIndex + 1
    );
  };

  const goToPreviousProduct = () => {
    setCurrentProductIndex((prevIndex) =>
      prevIndex - 1 < 0 ? products.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  const currentProduct = products[currentProductIndex];
  const currentEditedProduct = editedProducts[currentProductIndex];

  if (!currentProduct) {
    return <div>No products available.</div>;
  }

  const handleFocus = (field: "pieces" | "packages") => {
    setActiveInput(field);
  };

  return (
    <>
      <Toaster />
      <div className="grid grid-rows-[auto__1fr_auto_2fr] h-screen container mx-auto p-4">
        <div>
          <h2 className="text-center w-full mb-1 h-fit">
            {facility} {kiosk}
          </h2>
          <p className="text-center text-xs">
            Senast inventering: {inventoryDate}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="w-fit mx-auto mb-5">
            {/* Progress display */}
            <div className="mt-auto relative">
              <h3 className="text-2xl font-bold text-center mb-6">
                {currentProduct.productName}
              </h3>
              <span className="text-right text-xs absolute -top-7 right-0 bg-neutral-200 rounded-full p-2 ">
                {currentProductIndex + 1}/{products.length}
              </span>
            </div>

            <div className="flex gap-5">
              <div className="flex flex-col">
                <p className="text-xs font-semibold">Antal i styck</p>
                <Input
                  value={currentEditedProduct.amountPieces}
                  onFocus={() => {
                    handleFocus("pieces"); 
                    setKeypadTarget("pieces"); 
                  }}
                  onClick={() => {
                    handleFocus("pieces");
                    setKeypadTarget("pieces");
                  }}
                  onChange={(e) =>
                    updateCurrentProduct("pieces", () => e.target.value)
                  }
                  readOnly
                  autoFocus
                  className={`border-b-2 border-black border-x-0 border-t-0 shadow-none rounded-none focus:outline-none focus-visible:ring-0 focus:border-blue-200 active:border-blue-200 w-full p-2 border-2  ${
                    activeInput === "pieces" ? "border-blue-500 bg-blue-100" : "border-gray-300"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-semibold">
                  Antal i obrutna förpackningar
                </p>
                <Input
                  value={currentEditedProduct.amountPackages}
                  onFocus={() => {
                    handleFocus("packages"); 
                    setKeypadTarget("packages"); 
                  }}
                  onClick={() => {
                    handleFocus("packages");
                    setKeypadTarget("packages");
                  }}
                  onChange={(e) =>
                    updateCurrentProduct("packages", () => e.target.value)
                  }
                  readOnly
                  className={`border-b-2 border-black border-x-0 border-t-0 shadow-none rounded-none focus:outline-none focus-visible:ring-0 focus:border-blue-200 active:border-blue-200 w-full p-2 border-2  ${
                    activeInput === "packages" ? "border-blue-500 bg-blue-100" : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div className="w-full flex">
              <Button type="submit" className="mt-10 mx-auto">
                Skicka in inventering
              </Button>
            </div>
          </form>
        </div>
        <div className="flex justify-between mx-5">
          <Button
            type="button"
            onClick={goToPreviousProduct}
            className="place-self-center rounded-xl h-12"
            variant={"outline"}
          >
            <ArrowBigLeft />
          </Button>

          <Button
            type="button"
            onClick={goToNextProduct}
            className="place-self-center rounded-xl h-12"
            variant={"outline"}
          >
            <ArrowBigRight className="" />
          </Button>
        </div>
        <Keypad onKeyPressed={handleKeypadPress} />
      </div>
    </>
  );
};

export default App2;
