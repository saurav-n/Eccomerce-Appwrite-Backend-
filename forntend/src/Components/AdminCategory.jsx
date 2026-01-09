import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useSelector } from "react-redux";
import { fetchCategories } from "@/app/categorySlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useToast } from "./Toast/use-toast";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
});

export default function AdminCategory() {
  //   const [categories, setCategories] = useState([
  //     { id: 1, name: "Electronics", description: "Electronic devices and accessories" },
  //     { id: 2, name: "Clothing", description: "Fashion and apparel items" },
  //     { id: 3, name: "Books", description: "Digital and physical books" },
  //     { id: 4, name: "Home & Garden", description: "Home decor and gardening supplies" },
  //   ])

  const { categories, isLoading, error } = useSelector(
    (state) => state.category
  );
  const dispatch = useDispatch();
  console.log("categories", categories);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const onSubmit =async (data) => {
    try {
      if (editingId) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/updateCategory/${editingId}`,data,{
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
          }
        })
        toast({
          description:`Category "${data.name}" updated!`,
          variant:'success'
        })
        dispatch(fetchCategories())
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/addCategory`,data,{
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
          }
        })
        toast({
          description:`Category "${data.name}" added!`,
          variant:'success'
        })
        dispatch(fetchCategories())
      }
    } catch (error) {
      toast({
        description:error.response.data.message,
        variant:'error'
      })
    }

  };

  const handleEdit = (category) => {
    setEditingId(category._id);
  };

  const handleDelete =async (category) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/deleteCategory/${category._id}`,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      toast({
        description:`Category "${category.name}" deleted!`,
        variant:'success'
      })
      dispatch(fetchCategories())
    } catch (error) {
      toast({
        description:error.response.data.message,
        variant:'error'
      })
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setValue('name','')
    setValue('description','')
  };

  useEffect(()=>{
    if(editingId){
      const category=categories.find(category=>category._id===editingId)
      if(category){
        setValue('name',category.name)
        setValue('description',category.description)
      }
    }
  },[editingId])

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Categories List - Left Side */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              All Categories
            </h2>
          </div>

          {isLoading && (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500">Loading...</p>
            </div>
          )}

          {!isLoading && (
            <div className="divide-y divide-slate-200">
              {categories.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-500">
                    No categories yet. Create your first one!
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {category.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form - Right Side */}
      <div className="lg:col-span-1">
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg">
          <div className="px-6 py-4 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Category" : "Add Category"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-900 mb-2"
              >
                Category Name
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500"
              />
            </div>

            {/* Category Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-900 mb-2"
              >
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Enter category description"
                rows="4"
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-500 resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-slate-200 text-slate-900 py-2 px-4 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
