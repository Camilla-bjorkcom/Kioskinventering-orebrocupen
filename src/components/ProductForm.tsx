// components/ProductForm.tsx
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Product } from "../interfaces/Product";
import { useRef } from "react";

interface ProductFormProps {
  product: Product;
  onChange: (field: "amountPieces" | "amountPackages", value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  isValid: boolean;
  currentProductIndex: number;
  activeInput: "amountPieces" | "amountPackages" | null;
  totalProducts: number | undefined;
  setActiveInput: React.Dispatch<
    React.SetStateAction<"amountPieces" | "amountPackages" | null>
  >;
  handleFocus: (field: "amountPieces" | "amountPackages") => void;
  setKeypadTarget: React.Dispatch<
    React.SetStateAction<"amountPieces" | "amountPackages">
  >;
}

const ProductForm = ({
  product,
  onChange,
  onSubmit,
  isValid,
  currentProductIndex,
  activeInput,
  totalProducts,
  setActiveInput,
  handleFocus,
  setKeypadTarget,
}: ProductFormProps) => {
  const piecesInputRef = useRef<HTMLInputElement>(null);
  const packagesInputRef = useRef<HTMLInputElement>(null);

  const handleInputClick = (field: "amountPieces" | "amountPackages") => {
    setActiveInput(field);
    handleFocus(field);
    setKeypadTarget(field);

    if (field === "amountPieces") {
      piecesInputRef.current?.focus();
    } else {
      packagesInputRef.current?.focus();
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-fit mx-auto">
      <div className="">
        <h3 className="min-[376px]:text-2xl text-xl font-bold text-center p-2 mb-3">
          {product.productName}
        </h3>
        <span
          className={`text-right text-xs absolute top-12 right-0 ${
            isValid ? "bg-green-200" : "bg-neutral-200"
          } rounded-full p-2`}
        >
          {currentProductIndex + 1}/{totalProducts}
        </span>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col mx-auto">
          <p className="text-xs font-semibold">Antal i styck</p>
          <Input
            value={product.amountPieces}
            ref={piecesInputRef}
            onFocus={() => {
              handleFocus("amountPieces");
              setKeypadTarget("amountPieces");
            }}
            onClick={() => {
              handleInputClick("amountPieces");
            }}
            onChange={(e) => onChange("amountPieces", e.target.value)}
            readOnly
            autoFocus
            className={`border-b-2 border-black border-x-0 border-t-0 shadow-none rounded-none focus:outline-none focus-visible:ring-0 focus:border-orange-400 active:border-orange-200 w-[200px] p-2  
    ${
      activeInput === "amountPieces" ? "border-orange-400" : "border-gray-300"
    }`}
          />
        </div>
        <div className="flex flex-col mx-auto">
          <p className="text-xs font-semibold">Antal obrutna förpackningar</p>
          <Input
            value={product.amountPackages}
            ref={packagesInputRef}
            onFocus={() => {
              handleFocus("amountPackages");
              setKeypadTarget("amountPackages");
            }}
            onClick={() => {
              handleInputClick("amountPackages");
            }}
            onChange={(e) => onChange("amountPackages", e.target.value)}
            readOnly
            className={`border-b-2 border-black border-x-0 border-t-0 shadow-none rounded-none focus:outline-none focus-visible:ring-0 focus:border-orange-400 active:border-orange-200 w-[200px] p-2  
    ${
      activeInput === "amountPackages" ? "border-orange-400" : "border-gray-300"
    }`}
          />
        </div>
      </div>
      <div className="w-full flex">
        <Button
          type="submit"
          variant={"secondary"}
          className={`mt-5 mx-auto  ${
            !isValid ? "bg-gray-500" : "bg-orange-400"
          }`}
          disabled={!isValid}
        >
          Skicka in inventering
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
