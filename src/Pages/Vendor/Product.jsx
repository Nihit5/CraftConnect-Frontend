import { useCallback, useEffect, useRef, useState } from "react";
import AuthenticatedImage from "../../Components/AuthenticatedImage";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast";

const PRODUCT_LIST_URL = "/api/v1/product/list";
const PRODUCT_CREATE_URL = "/api/v1/product/create";
const PRODUCT_UPDATE_URL = "/api/v1/product/update";
const PRODUCT_DELETE_URL = "/api/v1/product/delete";
const CATEGORY_LIST_URL = "/api/v1/category/list";

const inputClass =
  "h-11 w-full rounded-xl border border-[#E0D5CC] bg-white px-4 text-sm text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B25B3E]";

const selectClass =
  "box-border block h-11 w-full appearance-none rounded-xl border border-[#E0D5CC] bg-white bg-[length:16px] bg-[position:right_12px_center] bg-no-repeat px-4 pr-10 text-sm text-[#2E1D17] outline-none focus:border-[#B25B3E] disabled:cursor-not-allowed disabled:bg-[#FAF7F3] disabled:text-[#9A9189] [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%236B6560%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27m6%209%206%206%206-6%27/%3E%3C/svg%3E')]";

const textareaClass =
  "min-h-[96px] w-full resize-y rounded-xl border border-[#E0D5CC] bg-white px-4 py-3 text-sm text-[#2E1D17] outline-none placeholder:text-[#A59A90] focus:border-[#B25B3E]";

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

function formatPrice(price) {
  const value = Number(price);
  if (Number.isNaN(value)) return price ?? "—";
  return `Rs ${value.toLocaleString("en-NP")}`;
}

function getCategoryLabel(product, categories) {
  if (product?.categoryName) return product.categoryName;
  if (product?.category?.name) return product.category.name;
  const categoryId = product?.categoryId ?? product?.category?.id;
  const match = categories.find((item) => item.id === categoryId);
  return match?.name ?? "Uncategorized";
}

function ProductImage({ imagePath, name, size = "md" }) {
  const sizeClass =
    size === "sm" ? "h-10 w-10 text-sm" : "h-14 w-14 text-base";

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

function ImageUploadField({
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
        Product Image
        {required && <span className="text-[#B25B3E]"> *</span>}
      </label>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D8D1C9] bg-[#FAF7F3]">
          {blobPreview ? (
            <img
              src={blobPreview}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
          ) : existingImagePath ? (
            <AuthenticatedImage
              imagePath={existingImagePath}
              alt="Current product"
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
            {file ? "Change image" : "Upload image"}
          </button>
          <p className="mt-1.5 text-xs text-[#8E8075]">JPG or PNG recommended</p>
          {file && (
            <p className="mt-0.5 truncate text-xs text-[#6E625A]">{file.name}</p>
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

function ProductModal({
  mode,
  product,
  categories,
  token,
  onClose,
  onSuccess,
}) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product?.price != null ? String(product.price) : "",
  );
  const [quantity, setQuantity] = useState(
    product?.quantity != null ? String(product.quantity) : "",
  );
  const [categoryId, setCategoryId] = useState(
    String(product?.categoryId ?? product?.category?.id ?? ""),
  );
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      notify.error("Product name is required.");
      return;
    }
    if (!trimmedDescription) {
      notify.error("Description is required.");
      return;
    }
    if (!price || Number(price) <= 0) {
      notify.error("Enter a valid price.");
      return;
    }
    if (!quantity || Number(quantity) < 0) {
      notify.error("Enter a valid quantity.");
      return;
    }
    if (!categoryId) {
      notify.error("Please select a category.");
      return;
    }
    if (!isEdit && !imageFile) {
      notify.error("Product image is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("description", trimmedDescription);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("categoryId", categoryId);

      if (isEdit) {
        formData.append("id", String(product.id));
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        isEdit ? PRODUCT_UPDATE_URL : PRODUCT_CREATE_URL,
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
            `Failed to ${isEdit ? "update" : "create"} product (${response.status}).`,
          ),
        );
        return;
      }

      notify.success(isEdit ? "Product updated." : "Product added.");
      onSuccess();
      onClose();
    } catch {
      notify.error(
        `Unable to ${isEdit ? "update" : "create"} product. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E8DFD6] bg-[#FDF9F5] p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="product-modal-title"
              className="font-serif text-2xl font-semibold text-[#2E1D17]"
            >
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
            <p className="mt-1 text-sm text-[#6E625A]">
              {isEdit
                ? "Update product details or replace the image."
                : "Fill in the details to list a new product."}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="product-name"
              className="mb-2 block text-sm font-medium text-[#3D342E]"
            >
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Handcrafted Ceramic Bowl"
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="product-description"
              className="mb-2 block text-sm font-medium text-[#3D342E]"
            >
              Description
            </label>
            <textarea
              id="product-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your product..."
              className={textareaClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-medium text-[#3D342E]"
              >
                Price (Rs)
              </label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label
                htmlFor="product-quantity"
                className="mb-2 block text-sm font-medium text-[#3D342E]"
              >
                Quantity
              </label>
              <input
                id="product-quantity"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="0"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="product-category"
              className="mb-2 block text-sm font-medium text-[#3D342E]"
            >
              Category
            </label>
            <select
              id="product-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={selectClass}
              required
              disabled={categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1.5 text-xs text-[#B25B3E]">
                No categories available. Ask admin to add categories first.
              </p>
            )}
          </div>

          <ImageUploadField
            file={imageFile}
            existingImagePath={isEdit ? product?.imagePath : null}
            onChange={setImageFile}
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
              disabled={isSubmitting || categories.length === 0}
              className="h-11 flex-1 rounded-full bg-[#B95E39] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Adding..."
                : isEdit
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductRow({
  index,
  product,
  categories,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const categoryLabel = getCategoryLabel(product, categories);

  return (
    <li className="group flex flex-col gap-3 rounded-2xl border border-[#EDE5DC] bg-white px-4 py-3.5 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:gap-4 sm:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2EBE4] font-serif text-sm font-semibold text-[#B05B3B]">
          {index}
        </span>

        <ProductImage imagePath={product.imagePath} name={product.name} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[#2E1D17] sm:text-base">
            {product.name}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-[#8E8075]">
            {product.description}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#6E625A]">
            <span className="rounded-full bg-[#F2EBE4] px-2 py-0.5 font-medium text-[#9E4F2F]">
              {categoryLabel}
            </span>
            <span>{formatPrice(product.price)}</span>
            <span>Qty: {product.quantity ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 sm:opacity-80 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8C4A8] bg-[#FFF8F2] text-[#B05B3B] transition-colors hover:bg-[#FFF0E8]"
          aria-label={`Edit ${product.name}`}
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
          onClick={() => onDelete(product)}
          disabled={isDeleting}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F0D4C8] bg-white text-[#C45C3E] transition-colors hover:bg-[#FFF5F0] disabled:opacity-60"
          aria-label={`Delete ${product.name}`}
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

const Product = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(CATEGORY_LIST_URL, {
        headers: authHeaders(token),
      });

      if (!response.ok) return [];

      const result = await response.json();
      return Array.isArray(result?.data) ? result.data : [];
    } catch {
      return [];
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productResponse, categoryList] = await Promise.all([
        fetch(PRODUCT_LIST_URL, { headers: authHeaders(token) }),
        fetchCategories(),
      ]);

      setCategories(categoryList);

      if (!productResponse.ok) {
        notify.error(
          await parseApiError(
            productResponse,
            `Failed to load products (${productResponse.status}).`,
          ),
        );
        setProducts([]);
        return;
      }

      const result = await productResponse.json();
      const list = Array.isArray(result?.data) ? result.data : [];
      setProducts(list);
    } catch {
      notify.error("Unable to load products. Please try again.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    try {
      setDeletingId(product.id);
      const response = await fetch(`${PRODUCT_DELETE_URL}/${product.id}`, {
        method: "DELETE",
        headers: authHeaders(token),
      });

      if (!response.ok) {
        notify.error(
          await parseApiError(
            response,
            `Failed to delete product (${response.status}).`,
          ),
        );
        return;
      }

      notify.success("Product deleted.");
      await fetchProducts();
    } catch {
      notify.error("Unable to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalMode("add");
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
            Inventory
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#2E1D17] sm:text-4xl">
            Products
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#6E625A] sm:text-base">
            Add and manage your product listings for the marketplace.
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
          Add Product
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#EDE5DC] bg-[#FDF9F5]">
        <div className="flex items-center justify-between border-b border-[#EDE5DC] px-5 py-4 sm:px-6">
          <h2 className="font-serif text-xl font-semibold text-[#2E1D17]">
            Product List
          </h2>
          <span className="rounded-full bg-[#F2EBE4] px-3 py-1 text-xs font-semibold text-[#9E4F2F]">
            {products.length} total
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[88px] animate-pulse rounded-2xl bg-[#EDE5DC]/60"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
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
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <path d="M3.3 7.3 12 12l8.7-4.7M12 22V12" />
                </svg>
              </div>
              <p className="mt-4 font-serif text-lg font-semibold text-[#2E1D17]">
                No products yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-[#6E625A]">
                Add your first product with name, description, price, and image.
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-5 h-10 rounded-full bg-[#B95E39] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Add Product
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {products.map((product, index) => (
                <ProductRow
                  key={product.id}
                  index={index + 1}
                  product={product}
                  categories={categories}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  isDeleting={deletingId === product.id}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalMode && (
        <ProductModal
          mode={modalMode}
          product={editingProduct}
          categories={categories}
          token={token}
          onClose={closeModal}
          onSuccess={fetchProducts}
        />
      )}
    </section>
  );
};

export default Product;
