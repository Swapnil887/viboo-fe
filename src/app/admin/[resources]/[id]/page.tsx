import BrandForm from "@/components/admin/resource/BrandForm";
import CategoryForm from "@/components/admin/resource/CategoryForm";
import ProductFormPage from "@/components/admin/resource/ProductFormPage";
import ProductVariantFormPage from "@/components/admin/resource/ProductVariantFormPage";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resources: string; id: any }>;
}) {
  const { resources, id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize">Edit</h1>
      {resources == "products" ? (
        <ProductFormPage id={id} />
      ) : (
        <ProductVariantFormPage id={id} />
      )}
    </div>
  );
}
