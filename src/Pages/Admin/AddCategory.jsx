import { useCallback, useEffect, useRef, useState } from "react";
import AuthenticatedImage from "../../Components/AuthenticatedImage";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast";

const CATEGORY_LIST_URL = "/api/v1/category/list";
const CATEGORY_CREATE_URL = "/api/v1/category/create";
const CATEGORY_UPDATE_URL = "/api/v1/category/update";
const CATEGORY_DELETE_URL = "/api/v1/category/delete";

const inputClass =
  "h-11 w-full rounded-xl border border-[#E0D5CC] bg-white px-4 text-sm text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B25B3E]";

async function parseApiError(response, fallback) {
  let apiMessage = fallback;
  try {
    const rawBody = await response.text();
    if (!rawBody) return apiMessage;
    try {
      const data = JSON.parse(rawBody);
      if (data?.message) return data.message;
      if (data?.error) return data.error;
      if (data?.errors && Object.keys(data.errors).length > 0) {
        const [firstKey] = Object.keys(data.errors);
        const firstValue = data.errors[firstKey];
        return Array.isArray(firstValue)
          ? `${firstKey}: ${firstValue[0]}`
          : `${firstKey}: ${firstValue}`;
      }
    } catch {
      return rawBody;
    }
  } catch {
    // keep fallback message
  }
  return apiMessage;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function CategoryIcon({ imagePath, name, size = "md" }) {
  const sizeClass =
    size === "sm"
      ? "h-10 w-10 text-sm"
      : size === "lg"
        ? "h-16 w-16 text-xl"
        : "h-12 w-12 text-base";

  const fallback = (
    <span
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F2EBE4] to-[#E8DFD6] font-serif font-semibold text-[#B05B3B] ${sizeClass}`}
      aria-hidden
    >
      {name?.charAt(0)?.toUpperCase() || "?"}
    </span>
  );

  return (
    <AuthenticatedImage
      imagePath={imagePath}
      alt={name}
      className={`shrink-0 rounded-xl border border-[#EDE5DC] object-cover ${sizeClass}`}
      fallback={fallback}
    />
  );
}

function IconUploadField({
  file,
  existingImagePath,
  onChange,
  required = false,
}) {
  const inputRef = useRef(null);
  const [blobPreview, setBlobPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setBlobPreview(null);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setBlobPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const placeholder = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A59A90"
      strokeWidth={1.5}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#3D342E]">
        Category Icon
        {required && <span className="text-[#B25B3E]"> *</span>}
      </label>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D8D1C9] bg-[#FAF7F3]">
          {blobPreview ? (
            <img
              src={blobPreview}
              alt="Icon preview"
              className="h-full w-full object-cover"
            />
          ) : existingImagePath ? (
            <AuthenticatedImage
              imagePath={existingImagePath}
              alt="Current icon"
              className="h-full w-full object-cover"
              fallback={placeholder}
            />
          ) : (
            placeholder
          )}
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-10 rounded-full border border-[#E8C4A8] bg-[#FFF8F2] px-4 text-sm font-semibold text-[#B05B3B] transition-colors hover:bg-[#FFF0E8]"
          >
            {file ? "Change icon" : "Upload icon"}
          </button>
          <p className="mt-1.5 text-xs text-[#8E8075]">
            JPG or PNG, square image works best
          </p>
          {file && (
            <p className="mt-0.5 truncate text-xs text-[#6E625A]">
              {file.name}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0] ?? null;
          onChange(selected);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function CategoryModal({ mode, category, token, onClose, onSuccess }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(category?.name ?? "");
  const [iconFile, setIconFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      notify.error("Category name is required.");
      return;
    }

    if (!isEdit && !iconFile) {
      notify.error("Category icon is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", trimmedName);
      if (isEdit) {
        formData.append("id", String(category.id));
      }
      if (iconFile) {
        formData.append("image", iconFile);
      }

      const response = await fetch(
        isEdit ? CATEGORY_UPDATE_URL : CATEGORY_CREATE_URL,
        {
          method: isEdit ? "PUT" : "POST",
          headers: authHeaders(token),
          body: formData,
        },
      );

      if (!response.ok) {
        notify.error(
          await parseApiError(
            response,
            `Failed to ${isEdit ? "update" : "create"} category (${response.status}).`,
          ),
        );
        return;
      }

      notify.success(isEdit ? "Category updated." : "Category added.");
      onSuccess();
      onClose();
    } catch {
      notify.error(
        `Unable to ${isEdit ? "update" : "create"} category. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="w-full max-w-md rounded-2xl border border-[#E8DFD6] bg-[#FDF9F5] p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="category-modal-title"
              className="font-serif text-2xl font-semibold text-[#2E1D17]"
            >
              {isEdit ? "Edit Category" : "Add Category"}
            </h2>
            <p className="mt-1 text-sm text-[#6E625A]">
              {isEdit
                ? "Update the category name or replace its icon."
                : "Enter a name and upload an icon for the new category."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8E8075] transition-colors hover:bg-[#F2EBE4] hover:text-[#2E1D17]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium text-[#3D342E]"
            >
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Handmade Products"
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <IconUploadField
            file={iconFile}
            existingImagePath={isEdit ? category?.imagePath : null}
            onChange={setIconFile}
            required={!isEdit}
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-full border border-[#E0D5CC] bg-white text-sm font-medium text-[#6E625A] transition-colors hover:bg-[#F8F4EF] disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-full bg-[#B95E39] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save Changes"
                  : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryRow({ index, category, onEdit, onDelete, isDeleting }) {
  return (
    <li className="group flex items-center gap-4 rounded-2xl border border-[#EDE5DC] bg-white px-4 py-3.5 transition-shadow hover:shadow-sm sm:px-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2EBE4] font-serif text-sm font-semibold text-[#B05B3B]">
        {index}
      </span>

      <CategoryIcon imagePath={category.imagePath} name={category.name} />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#2E1D17] sm:text-base">
          {category.name}
        </p>
        <p className="mt-0.5 text-xs text-[#8E8075]">ID: {category.id}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-80 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8C4A8] bg-[#FFF8F2] text-[#B05B3B] transition-colors hover:bg-[#FFF0E8]"
          aria-label={`Edit ${category.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(category)}
          disabled={isDeleting}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0D4C8] bg-white text-[#C45C3E] transition-colors hover:bg-[#FFF5F0] disabled:opacity-60"
          aria-label={`Delete ${category.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>
    </li>
  );
}

const AddCategory = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(CATEGORY_LIST_URL, {
        headers: authHeaders(token),
      });

      if (!response.ok) {
        notify.error(
          await parseApiError(
            response,
            `Failed to load categories (${response.status}).`,
          ),
        );
        setCategories([]);
        return;
      }

      const result = await response.json();
      const list = Array.isArray(result?.data) ? result.data : [];
      setCategories(list);
    } catch {
      notify.error("Unable to load categories. Please try again.");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;

    try {
      setDeletingId(category.id);
      const response = await fetch(`${CATEGORY_DELETE_URL}/${category.id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      if (!response.ok) {
        notify.error(
          await parseApiError(
            response,
            `Failed to delete category (${response.status}).`,
          ),
        );
        return;
      }

      notify.success("Category deleted.");
      await fetchCategories();
    } catch {
      notify.error("Unable to delete category. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setModalMode("add");
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingCategory(null);
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
            Content Management
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#2E1D17] sm:text-4xl">
            Categories
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#6E625A] sm:text-base">
            Organize marketplace products with named categories and icons.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#B95E39] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#A65332] hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Category
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#EDE5DC] bg-[#FDF9F5]">
        <div className="flex items-center justify-between border-b border-[#EDE5DC] px-5 py-4 sm:px-6">
          <h2 className="font-serif text-xl font-semibold text-[#2E1D17]">
            Category List
          </h2>
          <span className="rounded-full bg-[#F2EBE4] px-3 py-1 text-xs font-semibold text-[#9E4F2F]">
            {categories.length} total
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[72px] animate-pulse rounded-2xl bg-[#EDE5DC]/60"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DFDCD0] bg-white px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2EBE4] text-[#B05B3B]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <p className="mt-4 font-serif text-lg font-semibold text-[#2E1D17]">
                No categories yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-[#6E625A]">
                Add your first category with a name and icon to get started.
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 h-10 rounded-full bg-[#B95E39] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Add Category
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <CategoryRow
                  key={category.id}
                  index={index + 1}
                  category={category}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  isDeleting={deletingId === category.id}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalMode && (
        <CategoryModal
          mode={modalMode}
          category={editingCategory}
          token={token}
          onClose={closeModal}
          onSuccess={fetchCategories}
        />
      )}
    </section>
  );
};

export default AddCategory;
