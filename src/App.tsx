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
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "./components/ui/toaster";


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

  const { toast } = useToast();
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

  const { isLoading, error } = useQuery<KioskInventory>({
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


    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update list");
      }

      form.reset();

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
      <Toaster />
      <div className="container mx-auto p-3">
        <div className="rounded-xl border border-black border-solid text-black aspect-video">
          <h2 className="text-lg lg:text-3xl text-center w-full mt-10 font-bold">
            Inventera {facility} {kiosk}
          </h2>
          <div className="w-full place-items-center mt-5 gap-3 mb-16">
            <p className="text-sm lg:text-lg">Senast inventering gjord:</p>
            <h3 className="lg:text-lg font-semibold">{inventoryDate}</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="w-fit mx-auto mb-20">
              {fields.map((product, index) => (
                <div
                  key={product.id}
                  className={`space-y-4 lg:flex ${
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
                        <FormLabel>
                          <p className="lg:w-[220px] text-lg">
                            {product.productName}
                          </p>
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
                <Button
                  type="submit"
                  className="w-full mt-10"
                  onClick={() => {
                    toast({
                      title: "Lyckat!",
                      description: "Inventering skickades iväg",
                    });
                  }}
                >
                  Skicka in inventering
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
