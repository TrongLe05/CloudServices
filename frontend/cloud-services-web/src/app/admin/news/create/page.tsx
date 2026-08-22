export const dynamic = "force-dynamic";

import { NewsEditorForm } from "@/components/admin/NewsEditorForm";

export default function CreateNewsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <NewsEditorForm />
    </div>
  );
}
