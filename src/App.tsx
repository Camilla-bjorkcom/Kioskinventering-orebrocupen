import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type KioskInventory = {
  id: number;
  products: Products[];
};

interface Products {
  id: number;
  productName: string;
  amountPieces: number;
  amountPackages: number;
}

function App() {
  const facility = "Rosta Gärde";
  const kiosk = "Kiosk 1";
  const inventoryDate = "2025-06-13 14:25";

  const [inventoryList, setInventoryList] = useState<Products[]>([]);

  const formSchema = z.object({
    products: z.array(
      z.object({
        productName: z.string().min(1, "Produktnamn är obligatoriskt"),
        amountPieces: z.coerce
          .number()
          .min(0, "Antal stycken måste vara större än eller lika med 0"),
        amountPackages: z.coerce
          .number()
          .min(0, "Antal paket måste vara större än eller lika med 0"),
      })
    ),
  });

  const id = "3395";

  type FormData = z.infer<typeof formSchema>;

  const { isLoading, error, refetch } = useQuery<KioskInventory>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/inventoryList/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setInventoryList(data.products);
      return data.products;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: [],
    },
  });

  useEffect(() => {
    if (inventoryList.length > 0) {
      form.reset({
        products: inventoryList.map((product) => ({
          productId: product.id,
          productName: product.productName,
        })),
      });
    }
  }, [inventoryList, form]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    console.log("I handlesubmit");
    try {
      const updatedList = await saveChangesToInventoryList(data);
      console.log("Updated list:", updatedList);
    } catch (error) {
      console.error("Failed to save changes", error);
    }
  }, console.error);

  const saveChangesToInventoryList = async (data: FormData) => {
    const url = `http://localhost:3000/inventoryList/${id}`;

    const sanitizedInventoryList = {
      products: data.products.map((product) => ({
        productname: product.productName,
        amountPieces: product.amountPieces,
        amountPackages: product.amountPackages,
      })),
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedInventoryList),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update list");
      }

      const updatedData = await response.json();
      return updatedData;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold w-full mb-10 mt-5">
          Inventering kiosker
        </h1>
        <div className="rounded-xl border border-black border-solid text-black aspect-video">
          <h2 className="text-3xl text-center w-full mt-10 font-bold">
            Inventera {facility} {kiosk}
          </h2>
          <div className="flex flex-col w-full place-items-center mt-5 gap-3 mb-16">
            <p className="text-lg">Senast inventering gjord:</p>
            <h3 className="text-lg font-semibold">{inventoryDate}</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="w-fit mx-auto mb-20">
              {fields.map((product, index) => (
                <div
                  key={product.id}
                  className={`space-y-4 flex ${
                    index % 2 === 0
                      ? "bg-gray-100 rounded-lg p-5"
                      : "bg-white rounded-lg p-5"
                  }`}
                >
                  <FormField
                    key={product.id}
                    control={form.control}
                    name={`products.${index}.productName`}
                    render={() => (
                      <FormItem className="place-content-center">
                        <FormLabel >
                          <p className="w-[220px]">{product.productName}</p>
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-5">
                    <FormField
                      key={product.id}
                      control={form.control}
                      name={`products.${index}.amountPieces`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antal i styck</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      key={index}
                      control={form.control}
                      name={`products.${index}.amountPackages`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antal i förpackningar</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <div className="w-1/2 place-self-center">
                <Button type="submit" className="w-full mt-10">
                  Skicka inventering
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export default App;
