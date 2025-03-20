import { useEffect, useState } from "react";
import Keypad, { KeypadKeys } from "./components/Keypad";
import { Button } from "./components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { ArrowBigLeft, ArrowBigRight, LayoutList } from "lucide-react";
import ProductForm from "./components/ProductForm";
import { Product } from "./interfaces/Product";
import { KioskInventory } from "./interfaces/KioskInventory";
import InventoryListView from "./components/InventoryListView";

const KioskInventeringPage = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [keypadTarget, setKeypadTarget] = useState<
  "amountPieces" | "amountPackages"
>("amountPieces");
  const [editedProducts, setEditedProducts] = useState<Product[]>([]);
  const [activeInput, setActiveInput] = useState<
    "amountPieces" | "amountPackages" | null
  >("amountPieces");
  const [isListView, setIsListView] = useState(false);

  const facility = "Rosta Gärde";
  const kiosk = "Kiosk 1";
  const inventoryDate = "2025-06-13 14:25";

  const id = "3395";

  const { data, isLoading, error } = useQuery<Product[]>({
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
      const updatedProducts = data.map((product) => ({
        ...product,
        amountPieces: "",
        amountPackages: "",
      })).sort((a, b) => a.productName.localeCompare(b.productName)); ;
      setEditedProducts(updatedProducts);
      console.log("Updated editedProducts:", updatedProducts);
    }
  }, [data]);

  //valideringsflagga
  const isValid = editedProducts.every(
    (product) => product.amountPieces !== "" && product.amountPackages !== ""
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Förhindra formulärets standardomladdning

    if (!isValid) {
      toast({
        title: "Misslyckades",
        description: "Alla fält måste fyllas i.",
        className: "bg-red-200",
      });
      return;
    }

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
        className: "bg-green-200",
      });

      //återställer alla fält
      setEditedProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          amountPieces: "",
          amountPackages: "",
        }))
      );
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        title: "Error",
        description: "Misslyckades med att spara ändringar.",
        className: "bg-red-200",
      });
    }
  };

  const handleKeypadPress = (keyPadKey: KeypadKeys) => {
    if (!editedProducts.length) return;

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
    field: "amountPieces" | "amountPackages",
    newValue: string | ((prev: string) => string)
  ) => {
    setEditedProducts((prevProducts) =>
      prevProducts.map((product, index) =>
        index === currentProductIndex
          ? {
              ...product,
              [field === "amountPieces" ? "amountPieces" : "amountPackages"]:
                typeof newValue === "function"
                  ? newValue(
                      String(
                        product[
                          field === "amountPieces"
                            ? "amountPieces"
                            : "amountPackages"
                        ]
                      ) || ""
                    )
                  : newValue,
            }
          : product
      )
    );
  };
  const goToNextFieldOrProduct = () => {
    if (keypadTarget === "amountPieces") {
      setKeypadTarget("amountPackages");
      handleFocus("amountPackages");
    } else {
      setKeypadTarget("amountPieces");
      handleFocus("amountPieces");
      setCurrentProductIndex((prevIndex) =>
        prevIndex + 1 >= editedProducts.length ? 0 : prevIndex + 1
      );
    }
  };


  const goToPreviousFieldOrProduct = () => {
    if (keypadTarget === "amountPackages") {
      setKeypadTarget("amountPieces");
      handleFocus("amountPieces");
    } else {
      setKeypadTarget("amountPackages");
      handleFocus("amountPackages");
      setCurrentProductIndex((prevIndex) =>
        prevIndex === 0 ? editedProducts.length - 1 : prevIndex - 1
      );
    }
  };
  const handleFocus = (field: "amountPieces" | "amountPackages") => {
    setActiveInput(field);
  };

  const toggleListView = () => {
    if (!isListView) setIsListView(true);
    else {
      setIsListView(false);
    }
  };

  if (isLoading || !editedProducts.length) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }
  const handleProductChange = (
    index: number,
    field: "amountPieces" | "amountPackages",
    value: string
  ) => {
    setEditedProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      )
    );
  };

  const currentProduct = editedProducts?.[currentProductIndex];
 
  console.log(editedProducts);
  if (!currentProduct) {
    return <div>No products available.</div>;
  }
  const totalProducts = editedProducts.length;
  const isAmountFilled =
  String(editedProducts[currentProductIndex]?.amountPieces).trim() !== "" &&
  String(editedProducts[currentProductIndex]?.amountPackages).trim() !== "";
const isAmountPiecesFilled =
  String(editedProducts[currentProductIndex]?.amountPieces).trim() !== "";
  return (
    <>
      <Toaster />
      <div className="relative h-full">
      {!isListView && (
        <div className="grid grid-rows-[auto_auto_2fr] h-[80vh] container mx-auto p-4 gap-3">
        <div className="flex flex-col items-center justify-center relative">
          <ProductForm
            product={currentProduct}
            onChange={(field, value) =>
              updateCurrentProduct(
                field === "amountPieces"
                  ? "amountPieces"
                  : "amountPackages",
                value
              )
            }
            currentProductIndex={currentProductIndex}
            onSubmit={handleSubmit}
            isValid={isValid}
            activeInput={activeInput}
            totalProducts={totalProducts}
            setActiveInput={setActiveInput}
            setKeypadTarget={setKeypadTarget}
            handleFocus={handleFocus}
          />
        </div>
        <div className="flex justify-between mx-5">
          <Button
            type="button"
            onClick={() => {
              goToPreviousFieldOrProduct();
           
            }}
            className="place-self-center rounded-xl h-12"
            variant={"outline"}
          >
            <ArrowBigLeft />
          </Button>
          <Button
            type="button"
            className="w-36 h-12 shadow border m-1 p-1 rounded-xl font-light"
            variant={"default"}
            onClick={() => {
              toggleListView();
             
            }}
          >
            Byt till listvy
            <LayoutList className="w-20 h-20" />
          </Button>

          <Button
            type="button"
            onClick={() => {
              goToNextFieldOrProduct();
            }}
            className={`place-self-center rounded-xl h-12 ${
              (isAmountPiecesFilled && activeInput === "amountPieces") ||
              (currentProductIndex !== editedProducts.length - 1 &&
                isAmountFilled)
                ? "animate-pulse bg-orange-400"
                : ""
            }`}
            variant={"outline"}
          >
            <ArrowBigRight className="" />
          </Button>
        </div>
        <div className="flex relative">
          <Keypad onKeyPressed={handleKeypadPress} />
        </div>
      </div>
      )}
  </div>
        <div
          className={`${
            isListView ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-opacity duration-100 absolute inset-0`}
        >
          {isListView && (
            <InventoryListView
              products={editedProducts}
              onProductChange={handleProductChange}
              onSubmit={handleSubmit}
              isValid={isValid}
              inventoryDate={inventoryDate}
              facility={facility}
              kioskName={kiosk} 
              toggleView={toggleListView}
              firstInventoryMade={false}             
            />
          )}
        </div>
    
    </>
  );
};

export default KioskInventeringPage;
