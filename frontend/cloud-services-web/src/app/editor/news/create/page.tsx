export const dynamic = "force-dynamic";

import { NewsEditorForm } from "@/components/admin/NewsEditorForm";

export default function CreateEditorNewsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <NewsEditorForm />
    </div>
  );
}
