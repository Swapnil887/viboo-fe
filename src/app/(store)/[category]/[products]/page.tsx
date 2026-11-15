interface PageProps {
  params: Promise<{
    category: string;
    products?: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { category, products } = await params;

  return (
    <div>
      {category} - {products}
    </div>
  );
}
