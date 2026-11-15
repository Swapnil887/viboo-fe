interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  return <div>{category}</div>;
}
