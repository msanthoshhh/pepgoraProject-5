'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '../../lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// --- ICONS ---
import { MdImageNotSupported, MdSearch } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuSave, LuLoader, LuPlus } from "react-icons/lu";
import { FaBoxOpen } from "react-icons/fa";

// --- UTILS ---
import { getPaginationRange } from '@/components/GetPage';
import Sidebar from '@/components/Sidebar';

// --- TYPES ---
type Subcategory = {
  _id: string;
  sub_cat_name: string;
};

type Product = {
  _id: string;
  name: string;
  mappedParent: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function ProductsPage() {
  // --- STATE ---
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');


  // --- FETCH PRODUCTS ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/products`, {
        params: { page, limit, search: searchQuery },
      });
      console.log(res);
      setProducts(res.data.data.data);       // assuming your backend returns { data, totalPages }
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // --- FETCH SUBCATEGORIES (for dropdowns) ---
  const fetchSubcategories = async () => {
    try {
      const res = await axiosInstance.get(`/subcategories`);
      setSubcategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subcategories");
    }
  };

  // --- ADD PRODUCT ---
  const handleAddProduct = async (newProduct: Partial<Product>) => {
    try {
      await axiosInstance.post(`/products`, newProduct);
      toast.success("Product added successfully!");
      setIsAddModalOpen(false);
      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  // --- UPDATE PRODUCT ---
  const handleSaveEdit = async (updatedProduct: Product) => {
    try {
      // Build only the fields backend expects
      const payload = {
        name: updatedProduct.name,
        // mappedParent: updatedProduct.mappedParent,   // required if backend uses it
        metaTitle: updatedProduct.metaTitle,
        metaKeyword: updatedProduct.metaKeyword,
        metaDescription: updatedProduct.metaDescription,
        imageUrl: updatedProduct.imageUrl,

      };

      console.log("bfvhk", updatedProduct?._id)

      await axiosInstance.put(`/products/${updatedProduct?._id}`, payload);

      toast.success("Product updated successfully!");
      setProductToEdit(null);
      fetchProducts();
    } catch (err: any) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Failed to update product");
    }
  };

  // --- DELETE PRODUCT ---
  const handleDelete = async (product: Product) => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/products/${product._id}`);
      toast.success("Product deleted successfully!");
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Sidebar />
      <main className="ml-60 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* --- Add Product Modal --- */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Add Product</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const formData = new FormData(e.currentTarget);
                    const newProduct = {
                      name: formData.get("name") as string,
                      mappedParent: formData.get("subcategoryId") as string,
                      metaTitle: formData.get("metaTitle") as string,
                      metaKeyword: formData.get("metaKeyword") as string,
                      metaDescription: formData.get("metaDescription") as string,
                      imageUrl: formData.get("imageUrl") as string,
                    };

                    try {
                      await axiosInstance.post("/products", newProduct);
                      toast.success("Product added successfully!");
                      setIsAddModalOpen(false);
                      fetchProducts(); // refresh list
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to add product");
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full rounded-lg border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                    <select
                      name="subcategoryId"
                      required
                      className="w-full rounded-lg border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    >
                      {products.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      className="w-full rounded-lg border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
                    <input
                      type="text"
                      name="metaKeyword"
                      className="w-full rounded-lg border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      rows={3}
                      className="w-full rounded-lg border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      className="w-full rounded-lg border px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                    >
                      <LuPlus /> Create
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* --- Edit Product Modal --- */}
          {productToEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
                <form
  onSubmit={async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const updatedProduct: Product = {
      ...productToEdit,
      name: (formData.get("name") as string) || productToEdit.name,  // ✅ fallback
      mappedParent: (formData.get("mappedParent") as string) || productToEdit.mappedParent,
      metaTitle: formData.get("metaTitle") as string,
      metaKeyword: formData.get("metaKeyword") as string,
      metaDescription: formData.get("metaDescription") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    await handleSaveEdit(updatedProduct);
  }}
  className="space-y-4"
>
  <div>
    <label className="block text-sm font-medium">Product Name</label>
    <input
      type="text"
      name="name"                         // ✅ must be here
      defaultValue={productToEdit.name}
      required                            // ✅ ensure it can’t be empty
      className="w-full rounded-lg border px-3 py-2"
    />
  </div>

  {/* <div>
    <label className="block text-sm font-medium">Subcategory</label>
    <select
      name="mappedParent"                  // ✅ must match backend
      defaultValue={productToEdit.mappedParent}
      required
      className="w-full rounded-lg border px-3 py-2"
    >
      {subcategories.map((s) => (
        <option key={s._id} value={s._id}>
          {s.sub_cat_name}
        </option>
      ))}
    </select>
  </div> */}

  {/* metaTitle */}
  <div>
    <label className="block text-sm font-medium">Meta Title</label>
    <input
      type="text"
      name="metaTitle"
      defaultValue={productToEdit.metaTitle}
      className="w-full rounded-lg border px-3 py-2"
    />
  </div>

  {/* metaKeyword */}
  <div>
    <label className="block text-sm font-medium">Meta Keywords</label>
    <input
      type="text"
      name="metaKeyword"
      defaultValue={productToEdit.metaKeyword}
      className="w-full rounded-lg border px-3 py-2"
    />
  </div>

  {/* metaDescription */}
  <div>
    <label className="block text-sm font-medium">Meta Description</label>
    <textarea
      name="metaDescription"
      defaultValue={productToEdit.metaDescription}
      className="w-full rounded-lg border px-3 py-2"
      rows={3}
    />
  </div>

  {/* imageUrl */}
  <div>
    <label className="block text-sm font-medium">Image URL</label>
    <input
      type="text"
      name="imageUrl"
      defaultValue={productToEdit.imageUrl}
      className="w-full rounded-lg border px-3 py-2"
    />
  </div>

  <div className="flex justify-end gap-2 pt-2">
    <button
      type="button"
      onClick={() => setProductToEdit(null)}
      className="rounded-lg border px-4 py-2"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
    >
      <LuSave /> Save
    </button>
  </div>
</form>

              </div>
            </div>
          )}

          {/* --- Delete Confirmation Modal --- */}
          {productToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{productToDelete.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setProductToDelete(null)}
                    className="rounded-lg border px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(productToDelete)
                      setProductToDelete(null);
                    }}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    <RiDeleteBin6Line />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- Header --- */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                Products
              </h1>
              <p className="text-gray-500 text-sm">
                Manage all products and their details.
              </p>
            </div>
            {!userRole?.includes("pepagora_manager") && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
              >
                <LuPlus /> Add Product
              </button>
            )}
          </div>

          {/* --- Table --- */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center h-60">
                <LuLoader className="text-4xl text-blue-600 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center p-12">
                <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  No Products Found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery
                    ? "Try adjusting your search."
                    : "Get started by adding a new product."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                      <tr>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-left">Product</th>
                        <th className="p-3 text-left">Meta Title</th>
                        <th className="p-3 text-left">Meta Keywords</th>
                        <th className="p-3 text-left">Meta Description</th>
                        {!userRole?.includes("pepagora_manager") && (
                          <th className="p-3 text-center">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          className="border-t hover:bg-blue-50/50"
                        >
                          <td className="p-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover shadow-sm"
                              />
                            ) : (
                              <MdImageNotSupported className="w-12 h-12 text-gray-300" />
                            )}
                          </td>
                          <td className="p-3 font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="p-3">{product.metaTitle || "-"}</td>
                          <td className="p-3">
                            {product.metaKeyword ? (
                              <span className="inline-flex rounded-full border px-2 py-0.5 text-xs text-gray-700">
                                {product.metaKeyword}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td
                            className="p-3 max-w-sm truncate"
                            title={product.metaDescription}
                          >
                            {product.metaDescription || "-"}
                          </td>
                          {!userRole?.includes("pepagora_manager") && (
                            <td className="p-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => setProductToEdit(product)}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
                                >
                                  <TbEdit /> Edit
                                </button>
                                <button
                                  onClick={() => setProductToDelete(product)}
                                  className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
                                >
                                  <RiDeleteBin6Line /> Delete
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* --- Pagination --- */}
                <div className="flex items-center justify-between gap-3 border-t bg-white p-3 flex-wrap">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => page > 1 && setPage(page - 1)}
                      disabled={page === 1}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {getPaginationRange(page, totalPages, 1).map(
                      (p: number | string, idx: number) =>
                        p === "..." ? (
                          <span key={idx} className="px-2">
                            …
                          </span>
                        ) : (
                          <button
                            key={idx}
                            onClick={() => setPage(Number(p))}
                            className={`rounded-lg border px-3 py-1.5 text-sm ${p === page ? "bg-blue-600 text-white" : ""
                              }`}
                          >
                            {p}
                          </button>
                        )
                    )}
                    <button
                      onClick={() => page < totalPages && setPage(page + 1)}
                      disabled={page === totalPages}
                      className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>

  );
}
