import BrandForm from "@/components/admin/resource/BrandForm";
import CategoryForm from "@/components/admin/resource/CategoryForm";
import ProductForm from "@/components/admin/resource/ProductForm";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resources: string; id: any }>;
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize">Edit</h1>
      {/* Fetch data where item.id === id and render pre-filled GlobalForm */}
      <ProductForm />
    </div>
  );
}
