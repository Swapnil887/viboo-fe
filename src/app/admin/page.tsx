import Link from "next/link";

export default async function page() {
  const resources = [
    { name: "Brand", redirectionLink: "/admin/brand" },
    // { name: "Category", redirectionLink: "/admin/category" },
  ];
  return (
    <div className="p-6">
      {resources.map((ele, index) => (
        <Link href={ele.redirectionLink}>
          <h3>{ele.name}</h3>
        </Link>
      ))}
    </div>
  );
}
