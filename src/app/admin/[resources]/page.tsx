import ResourcesLandingPage from "@/components/admin/ResourcesLandingPage";
import Link from "next/link";

const fetchResources = async (resources: String) => {
  try {
    console.log(`${process.env.BACKEND_URL}/api/${resources}`);
    const resourceDataResponse = await fetch(
      resources == "product-varient"
        ? `${process.env.BACKEND_URL}/api/products/variant`
        : `${process.env.BACKEND_URL}/api/${resources}`,
    );
    const resourceData = resourceDataResponse
      ? await resourceDataResponse?.json()
      : false;

    if (resourceData && resourceData.success) {
      return resourceData;
    } else {
      throw new Error("Data not Fetched");
    }
  } catch (error) {
    console.log(error);
  }
};

export default async function page({
  params,
}: {
  params: Promise<{ resources: string }>;
}) {
  const { resources } = await params; // e.g., "category" or "brand"

  // Capitalize title: "category" -> "Categories"
  const title = resources.charAt(0).toUpperCase() + resources.slice(1) + "s";
  const fetchResoDataurces = await fetchResources(resources);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage {title}</h1>
        <Link
          href={`/admin/${resources}/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New {resources}
        </Link>
      </div>

      {/* Render generic data table for this specific resource */}

      <ResourcesLandingPage
        resources={resources}
        resourceData={fetchResoDataurces?.data || []}
      />
    </div>
  );
}
