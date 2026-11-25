import ProductListing from "@/components/products/ProductListing";
import { Product, ProductFilter } from "@/types/product";

async function getProducts(): Promise<Product[]> {
  const filter = {
    category: ["clothing"],
  };

  console.log( `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/5b8bed60-3f74-491b-b36e-6a22ddadd3a6
    `)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/5b8bed60-3f74-491b-b36e-6a22ddadd3a6
    `,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  console.log(data,"here")

  return data ;
}



export default async function ProductsPage() {
  const {data}:any = await getProducts()

  console.log(data.productVariants,"data.productVariants")

  return (
   <ProductListing
      products={data.productVariants}
      filters={[]}
      isProductVariant={true}
      // onApplyFilters={(filters) => {
      //   console.log("Selected filters:", filters);
      // }}
      // onSortChange={(sort) => {
      //   console.log("Selected sorting:", sort);
      // }}
    />
  );
}
