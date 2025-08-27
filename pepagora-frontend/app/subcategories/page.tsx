'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../lib/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// --- Icons ---
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuSave, LuPlus } from "react-icons/lu";
import { MdImageNotSupported } from "react-icons/md";

// --- Utils ---
import { getPaginationRange } from '@/components/GetPage';
import Sidebar from '@/components/Sidebar';
import RichTextEditor from '@/components/RichTextEditor';

// --- Types ---
type Category = {
  _id: string;
  main_cat_name: string;
};

type SubCategory = {
  _id: string;
  sub_cat_name: string;
  sub_cat_img_url?: string;
  mappedParent: string;
  metaTitle?: string;
  metaKeyword?: string;
  metaDescription?: string;
  description?: string;
};

type TokenPayload = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
};

export default function SubcategoriesPage() {
  // --- STATE ---
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [freeText, setFreeText] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState<SubCategory | null>(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<SubCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();



  //   useEffect(() => {
  //   const token = localStorage.getItem('access_token');
  //   if (!token) {
  //     router.push('/login');
  //     return;
  //   }
  //   try {
  //     const decoded = jwtDecode<TokenPayload>(token);
  //     setUserRole(decoded.role);
  //   } catch {
  //     router.push('/login');
  //   }
  // }, [router]);
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        const decoded: TokenPayload = jwtDecode(storedToken);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/login');
      }
    }
  }, []);

  // --- API LOGIC ---

  // GET Subcategories
  const fetchSubcategories = async (pageNum = page) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/subcategories', {
        params: { page: pageNum, limit, search: searchQuery },
      });

      console.log('Fetched subcategories:', res.data.data.pagination.totalPages);
      setSubCategories(res.data.data.data || []);
      setTotalPages(res.data.data.pagination.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  // GET Categories (for dropdowns)
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories');
      console.log('Fetched categories:', res.data.data.data);
      setCategories(res.data.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  // POST Add Subcategory
  const handleAddSubcategory = async (formData: FormData) => {
    try {
      const payload = {
        sub_cat_name: formData.get("sub_cat_name"),
        mappedParent: formData.get("mappedParent"),
        metaTitle: formData.get("metaTitle"),
        metaKeyword: formData.get("metaKeyword"),
        metaDescription: formData.get("metaDescription"),
        sub_cat_img_url: formData.get("sub_cat_img_url"),
        freeText: freeText,
      };
      await axiosInstance.post('/subcategories', payload);
      toast.success("Subcategory added successfully!");
      setIsAddModalOpen(false);
      fetchSubcategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subcategory");
    }
  };

  // PUT Update Subcategory
  const handleSaveEdit = async (updatedSub: SubCategory) => {
    try {
      const payload = {
        sub_cat_name: updatedSub.sub_cat_name,
        mappedParent: updatedSub.mappedParent,
        metaTitle: updatedSub.metaTitle,
        metaKeyword: updatedSub.metaKeyword,
        metaDescription: updatedSub.metaDescription,
        sub_cat_img_url: updatedSub.sub_cat_img_url,
        freeText: freeText,
      };
      await axiosInstance.put(`/subcategories/${updatedSub._id}`, payload);
      toast.success("Subcategory updated successfully!");
      setSubcategoryToEdit(null);
      fetchSubcategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subcategory");
    }
  };

  // DELETE Subcategory
  const handleDelete = async (sub: SubCategory) => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/subcategories/${sub._id}`);
      toast.success("Subcategory deleted successfully!");
      setSubcategoryToDelete(null);
      fetchSubcategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subcategory");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchSubcategories();
  }, [page, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
  <div className="ml-60 flex min-h-screen bg-gray-50 relative">
    <Sidebar />

    <div className="flex-1 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subcategories</h1>
        {userRole !== 'pepagora_manager' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
          >
            <LuPlus /> Add Subcategory
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search subcategories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-sm rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading subcategories...</p>
        </div>
      ) : subCategories.length === 0 ? (
        <div className="text-center bg-white rounded-lg shadow p-10">
          <p className="text-gray-600 text-lg">No subcategories found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Subcategory</th>
                  <th className="p-3 text-left">Meta Title</th>
                  <th className="p-3 text-left">Meta Keywords</th>
                  <th className="p-3 text-left">Meta Description</th>
                  {userRole !== 'pepagora_manager' && (
                    <th className="p-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {subCategories.map((subcat, index) => (
                  <tr
                    key={subcat._id}
                    className={`border-t hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      {subcat.sub_cat_img_url ? (
                        <img
                          src={subcat.sub_cat_img_url}
                          alt={subcat.sub_cat_name}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <MdImageNotSupported className="text-gray-400 w-14 h-14" />
                      )}
                    </td>
                    <td className="p-3">
                      {categories.find((c) => c._id === subcat.mappedParent)?.main_cat_name || '-'}
                    </td>
                    <td className="p-3 font-medium">{subcat.sub_cat_name}</td>
                    <td className="p-3">{subcat.metaTitle || '-'}</td>
                    <td className="p-3">{subcat.metaKeyword || '-'}</td>
                    <td className="p-3 max-w-xs truncate">{subcat.metaDescription || '-'}</td>
                    {userRole !== 'pepagora_manager' && (
                      <td className="p-3 flex gap-2 justify-center">
                        <button
                          onClick={() => setSubcategoryToEdit(subcat)}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <TbEdit />
                        </button>
                        <button
                          onClick={() => setSubcategoryToDelete(subcat)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <button
                onClick={() => { if (page > 1) { setPage(page - 1); fetchSubcategories(page - 1); }}}
                disabled={page === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Prev
              </button>
              {getPaginationRange(page, totalPages, 1).map((p, idx) =>
                p === '...' ? (
                  <span key={idx} className="px-3 py-1">...</span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => { setPage(Number(p)); fetchSubcategories(Number(p)); }}
                    className={`px-3 py-1 rounded border ${
                      p === page ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => { if (page < totalPages) { setPage(page + 1); fetchSubcategories(page + 1); }}}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const newPage = Number(e.target.value);
                  if (newPage >= 1 && newPage <= totalPages) {
                    setPage(newPage);
                    fetchSubcategories(newPage);
                  }
                }}
                className="w-16 border rounded px-2 py-1 text-center"
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
          </div>
        </>
      )}

      {/* --- Add Modal --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSubcategory(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="sub_cat_name"
                placeholder="Subcategory Name"
                className="w-full rounded-lg border px-3 py-2"
                required
              />
              <select name="mappedParent" required className="w-full rounded-lg border px-3 py-2">
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.main_cat_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="metaTitle"
                placeholder="Meta Title"
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                type="text"
                name="metaKeyword"
                placeholder="Meta Keywords"
                className="w-full rounded-lg border px-3 py-2"
              />
              <textarea
                name="metaDescription"
                placeholder="Meta Description"
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                type="text"
                name="sub_cat_img_url"
                placeholder="Image URL"
                className="w-full rounded-lg border px-3 py-2"
              />
              <RichTextEditor value={freeText} onChange = {setFreeText} />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {subcategoryToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Subcategory</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(subcategoryToEdit);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="sub_cat_name"
                value={subcategoryToEdit.sub_cat_name}
                onChange={(e) =>
                  setSubcategoryToEdit({ ...subcategoryToEdit, sub_cat_name: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
                required
              />
              <select
                name="mappedParent"
                value={subcategoryToEdit.mappedParent}
                onChange={(e) =>
                  setSubcategoryToEdit({ ...subcategoryToEdit, mappedParent: e.target.value })
                }
                required
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.main_cat_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="metaTitle"
                value={subcategoryToEdit.metaTitle || ''}
                onChange={(e) =>
                  setSubcategoryToEdit({ ...subcategoryToEdit, metaTitle: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
              <input
                type="text"
                name="metaKeyword"
                value={subcategoryToEdit.metaKeyword || ''}
                onChange={(e) =>
                  setSubcategoryToEdit({ ...subcategoryToEdit, metaKeyword: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
              <textarea
                name="metaDescription"
                value={subcategoryToEdit.metaDescription || ''}
                onChange={(e) =>
                  setSubcategoryToEdit({ ...subcategoryToEdit, metaDescription: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
              <RichTextEditor value={freeText} onChange={setFreeText} />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubcategoryToEdit(null)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <LuSave /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {subcategoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete subcategory "
              <span className="font-semibold">{subcategoryToDelete.sub_cat_name}</span>"?
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubcategoryToDelete(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(subcategoryToDelete)}
                disabled={isDeleting}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}