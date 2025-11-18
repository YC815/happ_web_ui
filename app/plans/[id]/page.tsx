export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">計劃詳情</h1>
      <p className="mt-2 text-neutral-600">計劃 ID: {id}</p>
    </div>
  );
}
