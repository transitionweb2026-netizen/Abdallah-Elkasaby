import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DocumentEditor } from "@/components/admin/DocumentEditor";
import { documentKeys, type DocumentKey } from "@/lib/cms/model";

export function generateStaticParams() {
  return documentKeys.map((key) => ({ key }));
}

function isDocumentKey(value: string): value is DocumentKey {
  return (documentKeys as readonly string[]).includes(value);
}

export default async function AdminDocumentPage({ params }: PageProps<"/admin/documents/[key]">) {
  const { key } = await params;
  if (!isDocumentKey(key)) notFound();

  return (
    <AdminShell>
      <DocumentEditor documentKey={key} />
    </AdminShell>
  );
}
