// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axiosInstance from '../../lib/axiosInstance';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'react-toastify';

// // --- Icons ---
// import { TbEdit } from "react-icons/tb";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { LuSave, LuPlus } from "react-icons/lu";
// import { MdImageNotSupported } from "react-icons/md";

// // --- Utils ---
// import { getPaginationRange } from '@/components/GetPage';
// import Sidebar from '@/components/Sidebar';
// import RichTextEditor from '@/components/RichTextEditor';

// // --- Types ---
// type Category = {
//   _id: string;
//   main_cat_name: string;
// };

// type SubCategory = {
//   _id: string;
//   sub_cat_name: string;
//   sub_cat_img_url?: string;
//   mappedParent: string;
//   metaTitle?: string;
//   metaKeyword?: string;
//   metaDescription?: string;
//   description?: string;
// };

// type TokenPayload = {
//   sub: string;
//   role: string;
//   iat: number;
//   exp: number;
// };

// export default function SubcategoriesPage() {
//   // --- STATE ---
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [freeText, setFreeText] = useState<string>('');

//   // Modals
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [subcategoryToEdit, setSubcategoryToEdit] = useState<SubCategory | null>(null);
//   const [subcategoryToDelete, setSubcategoryToDelete] = useState<SubCategory | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Pagination & Search
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [limit] = useState(10);
//   const [searchQuery, setSearchQuery] = useState('');

//   const router = useRouter();



//   //   useEffect(() => {
//   //   const token = localStorage.getItem('access_token');
//   //   if (!token) {
//   //     router.push('/login');
//   //     return;
//   //   }
//   //   try {
//   //     const decoded = jwtDecode<TokenPayload>(token);
//   //     setUserRole(decoded.role);
//   //   } catch {
//   //     router.push('/login');
//   //   }
//   // }, [router]);
//   useEffect(() => {
//     const storedToken = localStorage.getItem('accessToken');
//     if (storedToken) {
//       try {
//         const decoded: TokenPayload = jwtDecode(storedToken);
//         setUserRole(decoded.role);
//       } catch (err) {
//         console.error('Invalid token:', err);
//         router.push('/login');
//       }
//     }
//   }, []);

//   // --- API LOGIC ---

//   // GET Subcategories
//   const fetchSubcategories = async (pageNum = page) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get('/subcategories', {
//         params: { page: pageNum, limit, search: searchQuery },
//       });

//       console.log('Fetched subcategories:', res.data.data.pagination.totalPages);
//       setSubCategories(res.data.data.data || []);
//       setTotalPages(res.data.data.pagination.totalPages || 1);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch subcategories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GET Categories (for dropdowns)
//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get('/categories');
//       console.log('Fetched categories:', res.data.data.data);
//       setCategories(res.data.data.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch categories");
//     }
//   };

//   // POST Add Subcategory
//   const handleAddSubcategory = async (formData: FormData) => {
//     try {
//       const payload = {
//         sub_cat_name: formData.get("sub_cat_name"),
//         mappedParent: formData.get("mappedParent"),
//         metaTitle: formData.get("metaTitle"),
//         metaKeyword: formData.get("metaKeyword"),
//         metaDescription: formData.get("metaDescription"),
//         sub_cat_img_url: formData.get("sub_cat_img_url"),
//         description: freeText,
//       };
//       await axiosInstance.post('/subcategories', payload);
//       toast.success("Subcategory added successfully!");
//       setIsAddModalOpen(false);
//       fetchSubcategories();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add subcategory");
//     }
//   };

//   // PUT Update Subcategory
//   const handleSaveEdit = async (updatedSub: SubCategory) => {
//     try {
//       const payload = {
//         sub_cat_name: updatedSub.sub_cat_name,
//         mappedParent: updatedSub.mappedParent,
//         metaTitle: updatedSub.metaTitle,
//         metaKeyword: updatedSub.metaKeyword,
//         metaDescription: updatedSub.metaDescription,
//         sub_cat_img_url: updatedSub.sub_cat_img_url,
//         description: freeText,
//       };
//       await axiosInstance.put(`/subcategories/${updatedSub._id}`, payload);
//       toast.success("Subcategory updated successfully!");
//       setSubcategoryToEdit(null);
//       fetchSubcategories();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update subcategory");
//     }
//   };

//   // DELETE Subcategory
//   const handleDelete = async (sub: SubCategory) => {
//     try {
//       setIsDeleting(true);
//       await axiosInstance.delete(`/subcategories/${sub._id}`);
//       toast.success("Subcategory deleted successfully!");
//       setSubcategoryToDelete(null);
//       fetchSubcategories();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete subcategory");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // --- EFFECTS ---
//   useEffect(() => {
//     fetchSubcategories();
//   }, [page, searchQuery]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);


//   return (
//   <div className="ml-60 flex min-h-screen bg-gray-50 relative">
//     <Sidebar />

//     <div className="flex-1 p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Subcategories</h1>
//         {userRole !== 'pepagora_manager' && (
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
//           >
//             <LuPlus /> Add Subcategory
//           </button>
//         )}
//       </div>

//       {/* Search */}
//       <div className="mb-6 flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search subcategories..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full max-w-sm rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <p className="text-gray-500">Loading subcategories...</p>
//         </div>
//       ) : subCategories.length === 0 ? (
//         <div className="text-center bg-white rounded-lg shadow p-10">
//           <p className="text-gray-600 text-lg">No subcategories found.</p>
//         </div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white rounded-xl shadow">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
//                   <th className="p-3 text-left">#</th>
//                   <th className="p-3 text-left">Image</th>
//                   <th className="p-3 text-left">Category</th>
//                   <th className="p-3 text-left">Subcategory</th>
//                   <th className="p-3 text-left">Meta Title</th>
//                   <th className="p-3 text-left">Meta Keywords</th>
//                   <th className="p-3 text-left">Meta Description</th>
//                   {userRole !== 'pepagora_manager' && (
//                     <th className="p-3 text-center">Actions</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {subCategories.map((subcat, index) => (
//                   <tr
//                     key={subcat._id}
//                     className={`border-t hover:bg-gray-50 ${
//                       index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                     }`}
//                   >
//                     <td className="p-3">{index + 1}</td>
//                     <td className="p-3">
//                       {subcat.sub_cat_img_url ? (
//                         <img
//                           src={subcat.sub_cat_img_url}
//                           alt={subcat.sub_cat_name}
//                           className="w-14 h-14 object-cover rounded-lg shadow-sm"
//                         />
//                       ) : (
//                         <MdImageNotSupported className="text-gray-400 w-14 h-14" />
//                       )}
//                     </td>
//                     <td className="p-3">
//                       {categories.find((c) => c._id === subcat.mappedParent)?.main_cat_name || '-'}
//                     </td>
//                     <td className="p-3 font-medium">{subcat.sub_cat_name}</td>
//                     <td className="p-3">{subcat.metaTitle || '-'}</td>
//                     <td className="p-3">{subcat.metaKeyword || '-'}</td>
//                     <td className="p-3 max-w-xs truncate">{subcat.metaDescription || '-'}</td>
//                     {userRole !== 'pepagora_manager' && (
//                       <td className="p-3 flex gap-2 justify-center">
//                         <button
//                           onClick={() => setSubcategoryToEdit(subcat)}
//                           className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
//                         >
//                           <TbEdit />
//                         </button>
//                         <button
//                           onClick={() => setSubcategoryToDelete(subcat)}
//                           className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
//                         >
//                           <RiDeleteBin6Line />
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-between items-center mt-6">
//             <div className="flex gap-2">
//               <button
//                 onClick={() => { if (page > 1) { setPage(page - 1); fetchSubcategories(page - 1); }}}
//                 disabled={page === 1}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               {getPaginationRange(page, totalPages, 1).map((p, idx) =>
//                 p === '...' ? (
//                   <span key={idx} className="px-3 py-1">...</span>
//                 ) : (
//                   <button
//                     key={idx}
//                     onClick={() => { setPage(Number(p)); fetchSubcategories(Number(p)); }}
//                     className={`px-3 py-1 rounded border ${
//                       p === page ? 'bg-blue-600 text-white' : ''
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 )
//               )}
//               <button
//                 onClick={() => { if (page < totalPages) { setPage(page + 1); fetchSubcategories(page + 1); }}}
//                 disabled={page === totalPages}
//                 className="px-3 py-1 rounded border disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">Go to page:</span>
//               <input
//                 type="number"
//                 min="1"
//                 max={totalPages}
//                 value={page}
//                 onChange={(e) => {
//                   const newPage = Number(e.target.value);
//                   if (newPage >= 1 && newPage <= totalPages) {
//                     setPage(newPage);
//                     fetchSubcategories(newPage);
//                   }
//                 }}
//                 className="w-16 border rounded px-2 py-1 text-center"
//               />
//               <span className="text-sm text-gray-600">of {totalPages}</span>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- Add Modal --- */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddSubcategory(new FormData(e.currentTarget));
//               }}
//               className="space-y-4"
//             >
//               <input
//                 type="text"
//                 name="sub_cat_name"
//                 placeholder="Subcategory Name"
//                 className="w-full rounded-lg border px-3 py-2"
//                 required
//               />
//               <select name="mappedParent" required className="w-full rounded-lg border px-3 py-2">
//                 <option value="">-- Select Category --</option>
//                 {categories.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.main_cat_name}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="metaTitle"
//                 placeholder="Meta Title"
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <input
//                 type="text"
//                 name="metaKeyword"
//                 placeholder="Meta Keywords"
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <textarea
//                 name="metaDescription"
//                 placeholder="Meta Description"
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <input
//                 type="text"
//                 name="sub_cat_img_url"
//                 placeholder="Image URL"
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <RichTextEditor value={freeText} onChange = {setFreeText} />
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsAddModalOpen(false)}
//                   className="rounded-lg border px-4 py-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Add
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- Edit Modal --- */}
//       {subcategoryToEdit && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveEdit(subcategoryToEdit);
//               }}
//               className="space-y-4"
//             >
//               <input
//                 type="text"
//                 name="sub_cat_name"
//                 value={subcategoryToEdit.sub_cat_name}
//                 onChange={(e) =>
//                   setSubcategoryToEdit({ ...subcategoryToEdit, sub_cat_name: e.target.value })
//                 }
//                 className="w-full rounded-lg border px-3 py-2"
//                 required
//               />
//               <select
//                 name="mappedParent"
//                 value={subcategoryToEdit.mappedParent}
//                 onChange={(e) =>
//                   setSubcategoryToEdit({ ...subcategoryToEdit, mappedParent: e.target.value })
//                 }
//                 required
//                 className="w-full rounded-lg border px-3 py-2"
//               >
//                 <option value="">-- Select Category --</option>
//                 {categories.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.main_cat_name}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="metaTitle"
//                 value={subcategoryToEdit.metaTitle || ''}
//                 onChange={(e) =>
//                   setSubcategoryToEdit({ ...subcategoryToEdit, metaTitle: e.target.value })
//                 }
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <input
//                 type="text"
//                 name="metaKeyword"
//                 value={subcategoryToEdit.metaKeyword || ''}
//                 onChange={(e) =>
//                   setSubcategoryToEdit({ ...subcategoryToEdit, metaKeyword: e.target.value })
//                 }
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <textarea
//                 name="metaDescription"
//                 value={subcategoryToEdit.metaDescription || ''}
//                 onChange={(e) =>
//                   setSubcategoryToEdit({ ...subcategoryToEdit, metaDescription: e.target.value })
//                 }
//                 className="w-full rounded-lg border px-3 py-2"
//               />
//               <RichTextEditor value={freeText} onChange={setFreeText} />
//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setSubcategoryToEdit(null)}
//                   className="rounded-lg border px-4 py-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
//                 >
//                   <LuSave /> Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- Delete Confirmation Modal --- */}
//       {subcategoryToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
//             <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
//             <p className="mb-6">
//               Are you sure you want to delete subcategory "
//               <span className="font-semibold">{subcategoryToDelete.sub_cat_name}</span>"?
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => setSubcategoryToDelete(null)}
//                 className="rounded-lg border px-4 py-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleDelete(subcategoryToDelete)}
//                 disabled={isDeleting}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
//               >
//                 {isDeleting ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// );
// }
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getPaginationRange } from '@/components/GetPage';
import axiosInstance from '../../lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import { MdImageNotSupported } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { LuSave, LuPlus } from 'react-icons/lu';
import { AnimatePresence, motion } from 'framer-motion';
import ReactTextEditor from '@/components/RichTextEditor';

type Subcategory = {
  _id: string;
  sub_cat_name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  mappedParent: string; 
  sub_cat_img_url?: string;
};
type Category = {
  _id: string;
  main_cat_name: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  main_cat_image?: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function SubcategoriesPage() {
  const router = useRouter();

  // --- data
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- pagination & search
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [goToPageInput, setGoToPageInput] = useState<string>('');

  // --- auth/role
  const [userRole, setUserRole] = useState<string | null>(null);
  const isManagerViewOnly = useMemo(() => userRole === 'pepagora_manager', [userRole]);

  // --- modals & editing
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- form states
  const [formName, setFormName] = useState('');
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaKeyword, setFormMetaKeyword] = useState('');
  const [formMetaDescription, setFormMetaDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [mappedParent, setMappedParent] = useState<string | null>(null);
  const [formDescription, setFormDescription] = useState('');

  const [expandedId, setExpandedId] = useState<string | null>(null);
  // read role from token
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        const decoded: TokenPayload = jwtDecode(storedToken);
        setUserRole(decoded.role);
      } catch {
        router.push('/login');
      }
    }
  }, []);

  // fetch subcategories
  const fetchSubcategories = async (pageToFetch = page) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/subcategories', {
        params: { page: pageToFetch, limit, search: searchQuery || undefined },
      });
      const items = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      const pagination = res.data.data.pagination || {};
      setSubcategories(items);
      setTotalPages(pagination.totalPages || 1);
      setTotalItems(pagination.totalItems || items.length || 0);
    } catch (err) {
      console.error(err);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/categories');
      const items = Array.isArray(res.data.data.data) ? res.data.data.data : [];
      setCategories(items);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  // Create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/subcategories', {
        sub_cat_name: formName,
        metaTitle: formMetaTitle,
        metaKeyword: formMetaKeyword,
        metaDescription: formMetaDescription,
        imageUrl: formImageUrl,
        mappedParent: mappedParent,
        description: formDescription,
      });
      toast.success('Subcategory created');
      setShowAddModal(false);
      fetchSubcategories(1);
      setPage(1);
    } catch {
      toast.error('Create failed');
    }
  };

  // Start edit
  const startEdit = (s: Subcategory) => {
    setEditingId(s._id);
    setFormName(s.sub_cat_name);
    setFormMetaTitle(s.metaTitle || '');
    setFormMetaKeyword(s.metaKeyword || '');
    setFormMetaDescription(s.metaDescription || '');
    setFormImageUrl(s.sub_cat_img_url || '');
    setMappedParent(s.mappedParent || null);
    setFormDescription((s as any).description || '');
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await axiosInstance.put(`/subcategories/${editingId}`, {
        sub_cat_name: formName,
        metaTitle: formMetaTitle,
        metaKeyword: formMetaKeyword,
        metaDescription: formMetaDescription,
        imageUrl: formImageUrl,
        mappedParent: mappedParent,
        description: formDescription,
      });
      toast.success('Subcategory updated');
      setShowEditModal(false);
      setEditingId(null);
      fetchSubcategories(page);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await axiosInstance.delete(`/subcategories/${deletingId}`);
      toast.success('Deleted');
      setShowDeleteModal(false);
      setDeletingId(null);
      if (subcategories.length === 1 && page > 1) {
        setPage(page - 1);
        fetchSubcategories(page - 1);
      } else {
        fetchSubcategories(page);
      }
    } catch {
      toast.error('Delete failed');
    }
  };

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
    fetchSubcategories(p);
  };
  const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <div className="rounded-2xl border bg-white shadow-sm p-4 min-w-[140px]">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
    </div>
  );

  const tooLong = (s?: string) => (s ? s.length > 120 : false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Sidebar />

      <main className="ml-60 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Subcategories</h1>
              <p className="text-gray-500 text-sm">Create, edit and manage product subcategories.</p>
            </div>
            {!isManagerViewOnly && (
              <button
                onClick={() => {
                  setFormName('');
                  setFormMetaTitle('');
                  setFormMetaKeyword('');
                  setFormMetaDescription('');
                  setFormImageUrl('');
                  setFormDescription('');
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
              >
                <LuPlus /> Add Subcategory
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            <Stat label="Total Subcategories" value={totalItems} />
            <Stat label="Page" value={`${page} / ${totalPages}`} />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* Search */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
              <input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="🔍 Search subcategories..."
                className="w-64 rounded-lg border px-3 py-1.5 text-sm"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-600">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Subcategory</th>
                    <th className="p-3">Meta Title</th>
                    <th className="p-3">Meta Keywords</th>
                    <th className="p-3">Meta Description</th>
                    {!isManagerViewOnly && <th className="p-3 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading &&
                    Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                  {!loading && subcategories.length === 0 && (
                    <tr>
                      <td colSpan={isManagerViewOnly ? 5 : 6} className="p-6 text-center text-gray-500">
                        No subcategories found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    subcategories.map((s) => (
                      <tr key={s._id} className="border-t hover:bg-blue-50/40">
                        {/* Image */}
                        <td className="p-3 align-top">
                          {s.sub_cat_img_url ? (
                            <a href={s.sub_cat_img_url} target="_blank" rel="noreferrer">
                              <img src={s.sub_cat_img_url} alt={s.sub_cat_name} className="h-14 w-14 rounded-lg object-cover shadow-sm" />
                            </a>
                          ) : (
                            <MdImageNotSupported className="h-14 w-14 text-gray-300" />
                          )}
                        </td>

                        {/* Name */}
                        <td className="p-3 align-top font-medium text-gray-900">{s.sub_cat_name}</td>

                        <td className="p-3 align-top">{s.metaTitle || '-'}</td>

                        <td className="p-3 align-top">
                          {s.metaKeyword ? (
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-700">
                              {s.metaKeyword}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="p-3 align-top max-w-sm">
                          {s.metaDescription ? (
                            <>
                              <div className="text-gray-700 line-clamp-3" title={s.metaDescription}>
                                {expandedId === s._id || !tooLong(s.metaDescription)
                                  ? s.metaDescription
                                  : s.metaDescription.slice(0, 120) + '...'}
                              </div>
                              {tooLong(s.metaDescription) && (
                                <button
                                  onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {expandedId === s._id ? 'Read less' : 'Read more'}
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        {!isManagerViewOnly && (
                          <td className="p-3 align-top text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => startEdit(s)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700"
                              >
                                <TbEdit /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingId(s._id);
                                  setShowDeleteModal(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-white hover:bg-rose-700"
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

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 border-t bg-white p-3 flex-wrap">
              <p className="text-sm text-gray-600">
                Page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                {getPaginationRange(page, totalPages, 1).map((p, i) =>
                  p === '...' ? (
                    <span key={i} className="px-2 text-gray-500">…</span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => setPage(Number(p))}
                      className={`rounded-lg border px-3 py-1.5 text-sm ${p === page ? 'bg-blue-600 text-white' : ''}`}
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
                <div className="flex items-center gap-1 ml-2">
                  <input
                    type="number"
                    value={goToPageInput}
                    onChange={(e) => setGoToPageInput(e.target.value)}
                    className="w-16 rounded-lg border px-2 py-1 text-sm"
                    placeholder="Go to"
                  />
                  <button
                    onClick={() => goToPage(goToPageInput)}
                    className="rounded-lg border px-3 py-1.5 text-sm"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modals */}
      {/* <AnimatePresence>
        {showAddModal && (
          <Modal title="Add Subcategory" onClose={() => setShowAddModal(false)}>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Subcategory Name" value={formName} onChange={setFormName} required />
              <Input label="Image URL" value={formImageUrl} onChange={setFormImageUrl} />
              <Input label="Meta Title" value={formMetaTitle} onChange={setFormMetaTitle} />
              <Input label="Meta Keywords" value={formMetaKeyword} onChange={setFormMetaKeyword} />
              <Textarea label="Meta Description" value={formMetaDescription} onChange={setFormMetaDescription} />
              <label className="block text-sm">
                <span className="block text-gray-700 mb-1">Description</span>
                <ReactTextEditor value={formDescription} onChange={setFormDescription} />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <LuPlus /> Create
                </button>
              </div>
            </form>
          </Modal>
        )}

        {showEditModal && (
          <Modal title="Edit Subcategory" onClose={() => setShowEditModal(false)}>
            <div className="space-y-4">
              <Input label="Subcategory Name" value={formName} onChange={setFormName} />
              <Input label="Image URL" value={formImageUrl} onChange={setFormImageUrl} />
              <Input label="Meta Title" value={formMetaTitle} onChange={setFormMetaTitle} />
              <Input label="Meta Keywords" value={formMetaKeyword} onChange={setFormMetaKeyword} />
              <Textarea label="Meta Description" value={formMetaDescription} onChange={setFormMetaDescription} />
              <label className="block text-sm">
                <span className="block text-gray-700 mb-1">Description</span>
                <ReactTextEditor value={formDescription} onChange={setFormDescription} />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
                <button onClick={saveEdit} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                  <LuSave /> Save
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal title="Delete Subcategory" onClose={() => setShowDeleteModal(false)}>
            <p className="mb-4 text-gray-600">Are you sure you want to delete this subcategory?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
              <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700">
                <RiDeleteBin6Line /> Delete
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- Reusable components -----------------
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  >
    <div className="relative bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 z-10">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  </motion.div>
);

const Input = ({ label, value, onChange, required = false }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) => (
  <label className="block text-sm">
    <span className="block text-gray-700 mb-1">{label}</span>
    <input required={required} type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
  </label>
);

const Textarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block text-sm">
    <span className="block text-gray-700 mb-1">{label}</span>
    <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border px-3 py-2" rows={3} />
  </label>
);

const SkeletonRow = () => (
  <tr className="animate-pulse border-t">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="p-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
    ))}
  </tr>
); */}


      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <Modal title="Add Subcategory" onClose={() => setShowAddModal(false)}>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input label="Subcategory Name" value={formName} onChange={setFormName} required />
              <Input label="Image URL" value={formImageUrl} onChange={setFormImageUrl} />
              <select name="mappedParent" required className="w-full rounded-lg border px-3 py-2">
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>                   {c.main_cat_name}
                  </option>
                ))}
              </select>
              <Input label="Meta Title" value={formMetaTitle} onChange={setFormMetaTitle} />
              <Input label="Meta Keywords" value={formMetaKeyword} onChange={setFormMetaKeyword} />
              <Textarea label="Meta Description" value={formMetaDescription} onChange={setFormMetaDescription} />
              <label className="block text-sm">
                <span className="block text-gray-700 mb-1">Description</span>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                  <ReactTextEditor value={formDescription} onChange={setFormDescription} />
                </div>
              </label>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <LuPlus /> Create
                </button>
              </div>
            </form>
          </Modal>
        )}

        {showEditModal && (
          <Modal title="Edit Subcategory" onClose={() => setShowEditModal(false)}>
            <div className="space-y-4">
              <Input label="Subcategory Name" value={formName} onChange={setFormName} />
              {/* <Input label="Image URL" value={formImageUrl} onChange={setFormImageUrl} /> */}
              <select name="mappedParent" required className="w-full rounded-lg border px-3 py-2">
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>                   {c.main_cat_name}
                  </option>
                ))}
              </select>
              <Input label="Meta Title" value={formMetaTitle} onChange={setFormMetaTitle} />
              <Input label="Meta Keywords" value={formMetaKeyword} onChange={setFormMetaKeyword} />
              <Textarea label="Meta Description" value={formMetaDescription} onChange={setFormMetaDescription} />
              <label className="block text-sm">
                <span className="block text-gray-700 mb-1">Description</span>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                  <ReactTextEditor value={formDescription} onChange={setFormDescription} />
                </div>
              </label>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
                <button onClick={saveEdit} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                  <LuSave /> Save
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal title="Delete Subcategory" onClose={() => setShowDeleteModal(false)}>
            <p className="mb-4 text-gray-600">Are you sure you want to delete this subcategory?</p>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
              <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700">
                <RiDeleteBin6Line /> Delete
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------- Reusable components -----------------
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  >
    <div className="relative bg-white rounded-2xl shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-y-auto p-6 flex-1">{children}</div>
    </div>
  </motion.div>
);

const Input = ({ label, value, onChange, required = false }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) => (
  <label className="block text-sm">
    <span className="block text-gray-700 mb-1">{label}</span>
    <input
      required={required}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </label>
);

const Textarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block text-sm">
    <span className="block text-gray-700 mb-1">{label}</span>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none"
      rows={4}
    />
  </label>
);

const SkeletonRow = () => (
  <tr className="animate-pulse border-t">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="p-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
      </td>
    ))}
  </tr>
);
