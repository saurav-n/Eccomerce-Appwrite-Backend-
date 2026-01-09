import AdminCategory from "@/Components/AdminCategory";
import AdminContainer from "@/Components/AdminContainer";

export default function AdminCategoryPage() {
  return (
    <main className="flex-1 p-8 bg-white">
      <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
      <p className="text-slate-600 mt-2">Manage your product categories here</p>
      <AdminCategory />
    </main>
  );
}
