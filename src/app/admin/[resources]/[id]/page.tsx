import AttributeFormPage from "@/components/admin/resource/AttributeFormPage";
import BrandForm from "@/components/admin/resource/BrandForm";
import CategorPageForm from "@/components/admin/resource/CategoryForm";
import ProductFormPage from "@/components/admin/resource/ProductFormPage";
import ProductVariantFormPage from "@/components/admin/resource/ProductVariantFormPage";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resources: string; id: any }>;
}) {
  const { resources, id } = await params;
  let formatedData;
  if (id !== "create" && resources == "category") {
    const fetchResourceData = await fetch(
      `${process.env.BACKEND_URL}/api/category?id=${id}`,
    );
    const resourceData = await fetchResourceData.json();
    console.log("data", resourceData, "data");

    const categoryData = resourceData.data;

    formatedData = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      isActive: categoryData.isActive,
      sortOrder: categoryData.sortOrder,
      parentId: categoryData.parentId,
      attributeIds: categoryData.attributes.map((ele: any) => ele.attributeId),
    };
  }

  if (id !== "create" && resources == "attributes") {
    console.log(`${process.env.BACKEND_URL}/api/attributes?id=${id}`);
    const fetchResourceData = await fetch(
      `${process.env.BACKEND_URL}/api/attributes?id=${id}`,
    );
    const resourceData = await fetchResourceData.json();
    console.log("data", resourceData, "data");

    const categoryData = resourceData.data;

    console.log(categoryData, "her");

    formatedData = {
      name: categoryData.name,
      slug: categoryData.slug,
      dataType: categoryData.dataType,
      isFilterable: JSON.stringify(categoryData.isFilterable),
      isSearchable: JSON.stringify(categoryData.isSearchable),
      attributeValue: categoryData.values
        .map((attributeValue: any) => attributeValue.value)
        .join(","),
    };
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize">Edit</h1>
      {resources == "category" ? (
        <CategorPageForm id={id} resourceData={formatedData} />
      ) : resources == "products" ? (
        <ProductFormPage id={id} resourceData={formatedData} />
      ) : resources == "attributes" ? (
        <AttributeFormPage id={id} resourceData={formatedData} />
      ) : resources == "brand" ? (
        <BrandForm id={id} resourceData={formatedData} />
      ) : (
        <ProductVariantFormPage id={id} />
      )}
    </div>
  );
}
