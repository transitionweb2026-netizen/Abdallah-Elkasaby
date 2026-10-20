import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CatalogManager } from "@/components/admin/CatalogManager";
import { catalogKeys, type CatalogKey } from "@/lib/cms/model";

export function generateStaticParams() {
  return catalogKeys.map((key) => ({ key }));
}

function isCatalogKey(value: string): value is CatalogKey {
  return (catalogKeys as readonly string[]).includes(value);
}

export default async function AdminCatalogPage({ params }: PageProps<"/admin/catalogs/[key]">) {
  const { key } = await params;
  if (!isCatalogKey(key)) notFound();

  return (
    <AdminShell>
      <CatalogManager catalog={key} />
    </AdminShell>
  );
}
