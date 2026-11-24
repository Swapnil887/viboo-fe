import Link from "next/link";
import Image from "next/image";
import { Category, CategoryWithChildren } from "@/types/category";
import { buildCategoryTree } from "@/lib/utils";

interface Props {
  categories: Category[];
}

export default function CategoryListing({ categories }: Props) {
  const categoryTree = buildCategoryTree(categories);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Categories</span>
        </div>

        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Categories
          </h1>
          <p className="mt-3 text-gray-500">
            Discover something special for every little adventure.
          </p>
        </div>

        {/* Category Sections */}
        <div className="space-y-14">
          {categoryTree.map((category) => (
            <section key={category.id}>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {category.description}
                    </p>
                  )}
                </div>

                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  View All →
                </Link>
              </div>

              {category.children.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/category/${category.slug}/${child.slug}`}
                      className="group"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                        {child.imageUrl ? (
                          <Image
                            src={child.imageUrl}
                            alt={child.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 20vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No image available
                          </div>
                        )}
                      </div>

                      <h3 className="mt-3 text-center text-sm font-medium text-gray-800 group-hover:text-black">
                        {child.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Explore our {category.name} collection.
                </p>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
