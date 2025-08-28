// 'use client';

// import { useEffect, useState, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import axiosInstance from '../../lib/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'react-toastify';
// import RichTextEditor from "@/components/RichTextEditor"; // ✅ import it

// // --- ICONS ---
// import { MdImageNotSupported, MdSearch } from "react-icons/md";
// import { TbEdit } from "react-icons/tb";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { LuSave, LuLoader, LuPlus } from "react-icons/lu";
// import { FaBoxOpen } from "react-icons/fa";

// // --- UTILS ---
// import { getPaginationRange } from '@/components/GetPage';
// import Sidebar from '@/components/Sidebar';

// // --- TYPES ---
// type Subcategory = {
//   _id: string;
//   sub_cat_name: string;
// };

// type Product = {
//   _id: string;
//   name: string;
//   mappedParent?: string;
//   metaTitle?: string;
//   metaKeyword?: string;
//   metaDescription?: string;
//   imageUrl?: string;
//   description?: string;
// };

// type TokenPayload = {
//   sub: string;
//   role: string;
//   iat: number;
//   exp: number;
// };

// export default function ProductsPage() {
//   // --- STATE ---
//   const [products, setProducts] = useState<Product[]>([]);
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [description, setDescription] = useState<string>("");

//   // State for new product form
//   const [newProduct, setNewProduct] = useState<Partial<Product>>({
//     name: "",
//     metaTitle: "",
//     metaKeyword: "",
//     metaDescription: "",
//     description: "",
//     imageUrl: "",
//     mappedParent: "",
//   });


//   // Modals
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [productToEdit, setProductToEdit] = useState<Product | null>(null);
//   const [productToDelete, setProductToDelete] = useState<Product | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Pagination & Search
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(10);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     if (productToEdit) {
//       setDescription(productToEdit.description || "");
//     }
//   }, [productToEdit]);

//   useEffect(() => {
//     if (isAddModalOpen) {
//       setDescription("");
//     }
//   }, [isAddModalOpen]);




//   // --- FETCH PRODUCTS ---
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`/products`, {
//         params: { page, limit, search: searchQuery },
//       });
//       console.log(res);
//       setProducts(res.data.data.data);       // assuming your backend returns { data, totalPages }
//       setTotalPages(res.data.data.pagination.totalPages);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- FETCH SUBCATEGORIES (for dropdowns) ---
//   const fetchSubcategories = async () => {
//     try {
//       const res = await axiosInstance.get(`/subcategories`);

//       console.log("gfvhbjn",)
//       setSubcategories(res.data.data.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch subcategories");
//     }
//   };

//   // --- ADD PRODUCT ---
// const handleAddProduct = async (newProduct: Partial<Product>) => {
//   try {
//     console.log("Submitting new product:", newProduct);

//     await axiosInstance.post("/products", {
//       name: newProduct.name, // ✅ required
//       mappedParent: newProduct.mappedParent, // ✅ must be ObjectId
//       // imageUrl: newProduct.imageUrl || undefined, // must be full URL
//       metaTitle: newProduct.metaTitle || undefined,
//       metaKeyword: newProduct.metaKeyword || undefined,
//       metaDescription: newProduct.metaDescription || undefined,
//       description: newProduct.description || undefined,
//     });

//     toast.success("Product added successfully!");
//     setIsAddModalOpen(false);
//     fetchProducts();
//   } catch (err: any) {
//     console.error("Error adding product:", err.response?.data || err.message);
//     toast.error(err.response?.data?.message || "Failed to add product");
//   }
// };



//   // --- UPDATE PRODUCT ---
//   const handleSaveEdit = async (updatedProduct: Product) => {
//     try {
//       // Build only the fields backend expects
//       const payload = {
//         name: updatedProduct.name,
//         mappedParent: updatedProduct.mappedParent,   // required if backend uses it
//         metaTitle: updatedProduct.metaTitle,
//         metaKeyword: updatedProduct.metaKeyword,
//         metaDescription: updatedProduct.metaDescription,
//         imageUrl: updatedProduct.imageUrl,
//         description

//       };

//       console.log("bfvhk", updatedProduct?._id)

//       await axiosInstance.put(`/products/${updatedProduct?._id}`, payload);

//       toast.success("Product updated successfully!");
//       setProductToEdit(null);
//       fetchProducts();
//     } catch (err: any) {
//       console.error("Update failed:", err.response?.data || err.message);
//       toast.error("Failed to update product");
//     }
//   };

//   // --- DELETE PRODUCT ---
//   const handleDelete = async (product: Product) => {
//     try {
//       setIsDeleting(true);
//       await axiosInstance.delete(`/products/${product._id}`);
//       toast.success("Product deleted successfully!");
//       setProductToDelete(null);
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete product");
//     } finally {
//       setIsDeleting(false);
//     }
//   };
//   useEffect(() => {
//     fetchProducts();
//   }, [page, searchQuery]);

//   useEffect(() => {
//     fetchSubcategories();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       <Sidebar />
//       <main className="ml-60 p-6 md:p-8">
//         <div className="mx-auto max-w-7xl space-y-6">

//           {/* --- Add Product Modal --- */}
//           {/* ✅ Add Product Modal */}
//           {isAddModalOpen && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
//               <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]">

//                 {/* Header */}
//                 <div className="flex justify-between items-center p-4 border-b">
//                   <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
//                   <button
//                     onClick={() => setIsAddModalOpen(false)}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     &times;
//                   </button>
//                 </div>

//                 {/* ✅ Scrollable Body */}
//                 <div className="overflow-y-auto p-6 space-y-6 flex-1">

//                   {/* 2-column grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                     {/* Product Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Product Name
//                       </label>
//                       <input
//                         type="text"
//                         value={newProduct.name}
//                         onChange={(e) =>
//                           setNewProduct({ ...newProduct, name: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* mapped Parent */}
//                     <select name="mappedParent" required className="w-full rounded-lg border px-3" onChange={(e) =>
//                       setNewProduct({ ...newProduct, mappedParent: e.target.value })
//                     }>
//                       <option value="">-- Select Category --</option>
//                       {subcategories.map((c) => (
//                         <option key={c._id} value={c._id}>
//                           {c.sub_cat_name} 
//                         </option>
//                       ))}
//                     </select>
                    

//                     {/* Meta Title */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Image URL
//                       </label>
//                       <input
//                         type="image"
//                         value={newProduct.imageUrl}
//                         onChange={(e) =>
//                           setNewProduct({ ...newProduct, imageUrl: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     {/* Meta Title */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Meta Title
//                       </label>
//                       <input
//                         type="text"
//                         value={newProduct.metaTitle}
//                         onChange={(e) =>
//                           setNewProduct({ ...newProduct, metaTitle: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Meta Keyword */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Meta Keyword
//                       </label>
//                       <input
//                         type="text"
//                         value={newProduct.metaKeyword}
//                         onChange={(e) =>
//                           setNewProduct({ ...newProduct, metaKeyword: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>

//                   {/* ✅ Textarea + RichTextEditor in scrollable wrapper */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Meta Description
//                     </label>
//                     <textarea
//                       value={newProduct.metaDescription}
//                       onChange={(e) =>
//                         setNewProduct({ ...newProduct, metaDescription: e.target.value })
//                       }
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       rows={3}
//                     />
//                   </div>

//                   {/* Rich Text Editor */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description
//                     </label>
//                     <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
//                       <RichTextEditor
//                         value={newProduct.description || ""}
//                         onChange={(value) =>
//                           setNewProduct({ ...newProduct, description: value })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Sticky Footer */}
//                 <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
//                   <button
//                     onClick={() => setIsAddModalOpen(false)}
//                     className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleAddProduct(newProduct)}
//                     className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
//                   >
//                     Add Product
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}


//           {/* ---------------- EDIT PRODUCT MODAL ---------------- */}
//           {/* ✅ Edit Product Modal */}
//           {productToEdit && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
//               <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]">

//                 {/* Header */}
//                 <div className="flex justify-between items-center p-4 border-b">
//                   <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
//                   <button
//                     onClick={() => setProductToEdit(null)}
//                     className="text-gray-500 hover:text-gray-700 text-2xl"
//                   >
//                     &times;
//                   </button>
//                 </div>

//                 {/* ✅ Scrollable Body */}
//                 <div className="overflow-y-auto p-6 space-y-6 flex-1">

//                   {/* 2-column grid on desktop, 1-col on mobile */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                     {/* Product Name */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Product Name
//                       </label>
//                       <input
//                         type="text"
//                         value={productToEdit.name}
//                         onChange={(e) =>
//                           setProductToEdit({ ...productToEdit, name: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Meta Title */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Meta Title
//                       </label>
//                       <input
//                         type="text"
//                         value={productToEdit.metaTitle}
//                         onChange={(e) =>
//                           setProductToEdit({ ...productToEdit, metaTitle: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     {/* Meta Keyword */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Meta Keyword
//                       </label>
//                       <input
//                         type="text"
//                         value={productToEdit.metaKeyword}
//                         onChange={(e) =>
//                           setProductToEdit({ ...productToEdit, metaKeyword: e.target.value })
//                         }
//                         className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>

//                   {/* ✅ Textarea + RichTextEditor in scrollable wrapper */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Meta Description
//                     </label>
//                     <textarea
//                       value={productToEdit.metaDescription}
//                       onChange={(e) =>
//                         setProductToEdit({ ...productToEdit, metaDescription: e.target.value })
//                       }
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                       rows={3}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Description
//                     </label>
//                     <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
//                       <RichTextEditor
//                         value={productToEdit.description || ""}
//                         onChange={(value) =>
//                           setProductToEdit({ ...productToEdit, description: value })
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Sticky Footer */}
//                 <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
//                   <button
//                     onClick={() => setProductToEdit(null)}
//                     className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => handleSaveEdit(productToEdit)}
//                     className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- Delete Confirmation Modal --- */}
//           {productToDelete && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center /40 backdrop-blur-sm">
//               <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
//                 <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
//                 <p className="text-gray-600 mb-4">
//                   Are you sure you want to delete{" "}
//                   <span className="font-medium">{productToDelete.name}</span>?
//                   This action cannot be undone.
//                 </p>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     onClick={() => setProductToDelete(null)}
//                     className="rounded-lg border px-4 py-2"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       handleDelete(productToDelete)
//                       setProductToDelete(null);
//                     }}
//                     disabled={isDeleting}
//                     className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:opacity-50"
//                   >
//                     <RiDeleteBin6Line />
//                     {isDeleting ? "Deleting..." : "Delete"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- Header --- */}
//           <div className="flex items-center justify-between gap-4 flex-wrap">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
//                 Products
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 Manage all products and their details.
//               </p>
//             </div>
//             {!userRole?.includes("pepagora_manager") && (
//               <button
//                 onClick={() => setIsAddModalOpen(true)}
//                 className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
//               >
//                 <LuPlus /> Add Product
//               </button>
//             )}
//           </div>

//           {/* --- Table --- */}
//           <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
//             {loading ? (
//               <div className="flex justify-center items-center h-60">
//                 <LuLoader className="text-4xl text-blue-600 animate-spin" />
//               </div>
//             ) : products.length === 0 ? (
//               <div className="text-center p-12">
//                 <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400" />
//                 <h3 className="mt-2 text-lg font-semibold text-gray-900">
//                   No Products Found
//                 </h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   {searchQuery
//                     ? "Try adjusting your search."
//                     : "Get started by adding a new product."}
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-gray-50 text-xs uppercase text-gray-600">
//                       <tr>
//                         <th className="p-3 text-left">Image</th>
//                         <th className="p-3 text-left">Product</th>
//                         <th className="p-3 text-left">Meta Title</th>
//                         <th className="p-3 text-left">Meta Keywords</th>
//                         <th className="p-3 text-left">Meta Description</th>
//                         {!userRole?.includes("pepagora_manager") && (
//                           <th className="p-3 text-center">Actions</th>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {products.map((product) => (
//                         <tr
//                           key={product._id}
//                           className="border-t hover:bg-blue-50/50"
//                         >
//                           <td className="p-3">
//                             {product.imageUrl ? (
//                               <img
//                                 src={product.imageUrl}
//                                 alt={product.name}
//                                 className="w-12 h-12 rounded-lg object-cover shadow-sm"
//                               />
//                             ) : (
//                               <MdImageNotSupported className="w-12 h-12 text-gray-300" />
//                             )}
//                           </td>
//                           <td className="p-3 font-medium text-gray-900">
//                             {product.name}
//                           </td>
//                           <td className="p-3">{product.metaTitle || "-"}</td>
//                           <td className="p-3">
//                             {product.metaKeyword ? (
//                               <span className="inline-flex rounded-full border px-2 py-0.5 text-xs text-gray-700">
//                                 {product.metaKeyword}
//                               </span>
//                             ) : (
//                               <span className="text-gray-400">-</span>
//                             )}
//                           </td>
//                           <td
//                             className="p-3 max-w-sm truncate"
//                             title={product.metaDescription}
//                           >
//                             {product.metaDescription || "-"}
//                           </td>
//                           {!userRole?.includes("pepagora_manager") && (
//                             <td className="p-3 text-center">
//                               <div className="flex gap-2 justify-center">
//                                 <button
//                                   onClick={() => setProductToEdit(product)}
//                                   className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
//                                 >
//                                   <TbEdit /> Edit
//                                 </button>
//                                 <button
//                                   onClick={() => setProductToDelete(product)}
//                                   className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
//                                 >
//                                   <RiDeleteBin6Line /> Delete
//                                 </button>
//                               </div>
//                             </td>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* --- Pagination --- */}
//                 <div className="flex items-center justify-between gap-3 border-t bg-white p-3 flex-wrap">
//                   <p className="text-sm text-gray-600">
//                     Page {page} of {totalPages}
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => page > 1 && setPage(page - 1)}
//                       disabled={page === 1}
//                       className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
//                     >
//                       Prev
//                     </button>
//                     {getPaginationRange(page, totalPages, 1).map(
//                       (p: number | string, idx: number) =>
//                         p === "..." ? (
//                           <span key={idx} className="px-2">
//                             …
//                           </span>
//                         ) : (
//                           <button
//                             key={idx}
//                             onClick={() => setPage(Number(p))}
//                             className={`rounded-lg border px-3 py-1.5 text-sm ${p === page ? "bg-blue-600 text-white" : ""
//                               }`}
//                           >
//                             {p}
//                           </button>
//                         )
//                     )}
//                     <button
//                       onClick={() => page < totalPages && setPage(page + 1)}
//                       disabled={page === totalPages}
//                       className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>

//   );
// }




// app/admin/products/page.tsx (replace your current products page)
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getPaginationRange } from '@/components/GetPage';
import axiosInstance from '../../lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import RichTextEditor from '@/components/RichTextEditor';
import { MdImageNotSupported } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { LuPlus } from 'react-icons/lu';
import { AnimatePresence } from 'framer-motion';

type Product = {
  _id: string;
  name: string;
  mappedParent?: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  imageUrl?: string;
  description?: string;
};

type Subcategory = {
  _id: string;
  sub_cat_name: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

function SkeletonRow() {
  return (
    <tr className="border-t">
      <td className="p-3"><div className="h-4 bg-gray-200 rounded w-8" /></td>
      <td className="p-3"><div className="h-10 w-10 bg-gray-200 rounded" /></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded w-48" /></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded w-32" /></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
      <td className="p-3"><div className="h-4 bg-gray-200 rounded w-80" /></td>
      <td className="p-3" />
    </tr>
  );
}

export default function ProductsPage() {
  const router = useRouter();

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  // paging & search
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [goToPageInput, setGoToPageInput] = useState<string>('');

  // auth/role
  const [userRole, setUserRole] = useState<string | null>(null);
  const isManagerViewOnly = useMemo(() => userRole === 'pepagora_manager', [userRole]);

  // modals & editing
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // form states (add/edit)
  const [formName, setFormName] = useState('');
  const [formMappedParent, setFormMappedParent] = useState<string | null>(null);
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaKeyword, setFormMetaKeyword] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // helpers
  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored) {
      try {
        const decoded: TokenPayload = jwtDecode(stored);
        setUserRole(decoded.role);
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  // fetch subcategories for dropdown
  const fetchSubcategories = async () => {
    try {
      const res = await axiosInstance.get('/subcategories', { params: { limit: 1000 } }); // fetch list for dropdown
      const items = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setSubcategories(items);
    } catch (err) {
      console.error('fetchSubcategories', err);
      setSubcategories([]);
    }
  };

  // fetch products (server-side search + pagination)
  const fetchProducts = async (pageToFetch = page) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/products', {
        params: { page: pageToFetch, limit, search: searchQuery || undefined },
      });
      const items = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      const pagination = res.data.data.pagination || {};
      setProducts(items);
      setTotalPages(pagination.totalPages || 1);
      setTotalItems(pagination.totalItems || items.length || 0);
    } catch (err) {
      console.error('fetchProducts', err);
      setProducts([]);
      if ((err as any)?.response?.status === 401) router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // effects
  useEffect(() => { fetchSubcategories(); }, []);
  useEffect(() => { fetchProducts(page); /* eslint-disable-next-line */ }, [page, searchQuery]);

  // create
  const handleCreate = async (e?: React.FormEvent) => {
  e?.preventDefault?.();
  try {
    setLoading(true);
    await axiosInstance.post('/products', {
      name: formName, // required
      mappedParent: formMappedParent || undefined, // only send if selected
      imageUrl: formImageUrl || undefined,         // only send if not empty
      metaTitle: formMetaTitle || undefined,
      metaKeyword: formMetaKeyword || undefined,
      metaDescription: formMetaDescription || undefined,
      description: formDescription || undefined,
    });

    toast.success('Product created');
    setShowAddModal(false);

    // reset form
    setFormName('');
    setFormMappedParent(''); // <-- use empty string instead of null
    setFormMetaTitle('');
    setFormMetaKeyword('');
    setFormMetaDescription('');
    setFormImageUrl('');
    setFormDescription('');

    // reload
    setPage(1);
    fetchProducts(1);
  } catch (err: any) {
    console.error("Error adding product:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Create failed");
  } finally {
    setLoading(false);
  }
};

  // start edit
  const startEdit = (p: Product) => {
    setEditingId(p._id);
    setFormName(p.name || '');
    setFormMappedParent(p.mappedParent || null);
    setFormMetaTitle(p.metaTitle || '');
    setFormMetaKeyword(p.metaKeyword || '');
    setFormMetaDescription(p.metaDescription || '');
    setFormImageUrl(p.imageUrl || '');
    setFormDescription(p.description || '');
    setShowEditModal(true);
  };

  // save edit
  const saveEdit = async () => {
  if (!editingId) return;
  try {
    setLoading(true);

    const payload = {
      name: formName,
      mappedParent: formMappedParent || undefined, // only send if selected
      imageUrl: formImageUrl || undefined,
      metaTitle: formMetaTitle || undefined,
      metaKeyword: formMetaKeyword || undefined,
      metaDescription: formMetaDescription || undefined,
      description: formDescription || undefined,
    };

    await axiosInstance.put(`/products/${editingId}`, payload);

    toast.success("Product updated successfully!");
    setShowEditModal(false);
    setEditingId(null);
    fetchProducts(page);
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};


  // delete
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/products/${deletingId}`);
      toast.success('Deleted');
      setShowDeleteModal(false);
      setDeletingId(null);
      // if last item on page was deleted, move back page
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
        fetchProducts(page - 1);
      } else {
        fetchProducts(page);
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  // search handler (server-side)
  const onSearchChange = (v: string) => {
    setSearchQuery(v);
    setPage(1);
  };

  const goToPage = (input: string) => {
    const p = Number(input);
    if (!Number.isFinite(p) || p < 1 || p > totalPages) {
      toast.error(`Page must be between 1 and ${totalPages}`);
      return;
    }
    setPage(p);
    setGoToPageInput('');
    fetchProducts(p);
  };

  const tooLong = (s?: string) => (s ? s.length > 120 : false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Sidebar />

      <main className="ml-60 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500 text-sm">Create, edit and manage products (matches Subcategories UI).</p>
            </div>

            {!isManagerViewOnly && (
              <button
                onClick={() => {
                  setFormName(''); setFormMappedParent(null); setFormMetaTitle(''); setFormMetaKeyword(''); setFormMetaDescription(''); setFormImageUrl(''); setFormDescription('');
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
              >
                <LuPlus /> Add Product
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="rounded-2xl border bg-white shadow-sm p-4 min-w-[140px]">
              <p className="text-xs text-gray-500">Total Products</p>
              <p className="text-xl font-semibold text-gray-800">{totalItems}</p>
            </div>
            <div className="rounded-2xl border bg-white shadow-sm p-4 min-w-[140px]">
              <p className="text-xs text-gray-500">Page</p>
              <p className="text-xl font-semibold text-gray-800">{page} / {totalPages}</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* Search */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="🔍 Search products..."
                className="w-64 rounded-lg border px-3 py-1.5 text-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-600">
                  <tr>
                    <th className="p-3">S. NO</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Meta Title</th>
                    <th className="p-3">Meta Keywords</th>
                    <th className="p-3">Meta Description</th>
                    {!isManagerViewOnly && <th className="p-3 text-center">Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                  {!loading && products.length === 0 && (
                    <tr>
                      <td colSpan={isManagerViewOnly ? 6 : 7} className="p-6 text-center text-gray-500">No products found.</td>
                    </tr>
                  )}

                  {!loading && products.map((prod, idx) => (
                    <tr key={prod._id} className={`border-t hover:bg-blue-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="p-3 align-top">{(page - 1) * limit + idx + 1}</td>
                      <td className="p-3 align-top">
                        {prod.imageUrl ? (
                          <a href={prod.imageUrl} target="_blank" rel="noreferrer">
                            <img src={prod.imageUrl} alt={prod.name} className="h-14 w-14 rounded-lg object-cover shadow-sm" />
                          </a>
                        ) : (
                          <MdImageNotSupported className="h-14 w-14 text-gray-300" />
                        )}
                      </td>
                      <td className="p-3 align-top font-medium text-gray-900">{prod.name}</td>
                      <td className="p-3 align-top">{prod.metaTitle || '-'}</td>
                      <td className="p-3 align-top">
                        {prod.metaKeyword ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs text-gray-700">{prod.metaKeyword}</span>
                        ) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="p-3 align-top max-w-sm">
                        {prod.metaDescription ? (
                          <>
                            <div className="text-gray-700 line-clamp-3" title={prod.metaDescription}>
                              {tooLong(prod.metaDescription) ? prod.metaDescription.slice(0, 120) + '...' : prod.metaDescription}
                            </div>
                          </>
                        ) : <span className="text-gray-400">-</span>}
                      </td>
                      {!isManagerViewOnly && (
                        <td className="p-3 align-top text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => startEdit(prod)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"><TbEdit /> Edit</button>
                            <button onClick={() => { setDeletingId(prod._id); setShowDeleteModal(true); }} className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"><RiDeleteBin6Line /> Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 border-t bg-white p-3 flex-wrap">
              <p className="text-sm text-gray-600">Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span></p>

              <div className="flex items-center gap-2">
                <button onClick={() => page > 1 && setPage(page - 1)} disabled={page === 1} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">Prev</button>

                {getPaginationRange(page, totalPages, 1).map((p, i) =>
                  p === '...' ? <span key={i} className="px-2">…</span> : (
                    <button key={i} onClick={() => setPage(Number(p))} className={`rounded-lg border px-3 py-1.5 text-sm ${p === page ? 'bg-blue-600 text-white' : ''}`}>{p}</button>
                  )
                )}

                <button onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">Next</button>

                <div className="flex items-center gap-1 ml-2">
                  <input type="number" value={goToPageInput} onChange={(e) => setGoToPageInput(e.target.value)} className="w-16 rounded-lg border px-2 py-1 text-sm" placeholder="Go to" />
                  <button onClick={() => goToPage(goToPageInput)} className="rounded-lg border px-3 py-1.5 text-sm">Go</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------- Modals ---------- */}
      <AnimatePresence>
        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add Product</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder="Product Name" />
                <select value={formMappedParent ?? ''} onChange={(e) => setFormMappedParent(e.target.value || null)} className="w-full rounded-lg border px-3 py-2">
                  <option value="">-- Select Subcategory --</option>
                  {subcategories.map(s => <option key={s._id} value={s._id}>{s.sub_cat_name}</option>)}
                </select>
                <input value={formMetaTitle} onChange={(e) => setFormMetaTitle(e.target.value)} placeholder="Meta Title" className="w-full rounded-lg border px-3 py-2" />
                <input value={formMetaKeyword} onChange={(e) => setFormMetaKeyword(e.target.value)} placeholder="Meta Keywords" className="w-full rounded-lg border px-3 py-2" />
                <textarea value={formMetaDescription} onChange={(e) => setFormMetaDescription(e.target.value)} placeholder="Meta Description" className="w-full rounded-lg border px-3 py-2" rows={3} />
                <input value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} placeholder="Image URL" className="w-full rounded-lg border px-3 py-2" />
                <label className="block text-sm">
                  <span className="block text-gray-700 mb-1">Description</span>
                  <RichTextEditor value={formDescription} onChange={setFormDescription} />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
              <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="space-y-4">
                <input required value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder="Product Name" />
                <select value={formMappedParent ?? ''} onChange={(e) => setFormMappedParent(e.target.value || null)} className="w-full rounded-lg border px-3 py-2">
                  <option value="">-- Select Subcategory --</option>
                  {subcategories.map(s => <option key={s._id} value={s._id}>{s.sub_cat_name}</option>)}
                </select>
                <input value={formMetaTitle} onChange={(e) => setFormMetaTitle(e.target.value)} placeholder="Meta Title" className="w-full rounded-lg border px-3 py-2" />
                <input value={formMetaKeyword} onChange={(e) => setFormMetaKeyword(e.target.value)} placeholder="Meta Keywords" className="w-full rounded-lg border px-3 py-2" />
                <textarea value={formMetaDescription} onChange={(e) => setFormMetaDescription(e.target.value)} placeholder="Meta Description" className="w-full rounded-lg border px-3 py-2" rows={3} />
                {/* <input value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} placeholder="Image URL" className="w-full rounded-lg border px-3 py-2" /> */}
                <label className="block text-sm">
                  <span className="block text-gray-700 mb-1">Description</span>
                  <RichTextEditor value={formDescription} onChange={setFormDescription} />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingId(null); }} className="rounded-lg border px-4 py-2">Cancel</button>
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => { setShowDeleteModal(false); setDeletingId(null); }} className="rounded-lg border px-4 py-2">Cancel</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
