import { useMemo, useState } from "react";
import bowlImg from "../../assets/products/bowl.jpg";
import textileImg from "../../assets/products/textile.jpg";
import brassImg from "../../assets/products/brass.jpg";
import notebookImg from "../../assets/products/notebook.jpg";

const CATEGORIES = [
  "All",
  "Art and Paintings",
  "Handmade Products",
  "Fashion & Accessories",
  "Home Décor",
  "Beauty and Wellness Products",
  "Textile & Fabric Crafts",
];

const marketplaceProducts = [
  {
    title: "Hand-thrown Terracotta Vase",
    artisan: "Sita Maharjan",
    location: "Bhaktapur",
    price: "2,400",
    rating: 4.9,
    tag: "POTTERY",
    category: "Handmade Products",
    image: bowlImg,
  },
  {
    title: "Mithila Art Journal",
    artisan: "Anita Jha",
    location: "Janakpur",
    price: "650",
    rating: 4.8,
    tag: "MITHILA",
    category: "Art and Paintings",
    image: notebookImg,
  },
  {
    title: "Wood Carving Panel",
    artisan: "Ganesh Tamang",
    location: "Patan",
    price: "5,800",
    rating: 4.7,
    tag: "WOODWORK",
    category: "Home Décor",
    image: brassImg,
  },
  {
    title: "Brass Incense Holder",
    artisan: "Krishna Tamang",
    location: "Patan",
    price: "1,200",
    rating: 5.0,
    tag: "METAL",
    category: "Home Décor",
    image: brassImg,
  },
  {
    title: "Hemp Tote Bag",
    artisan: "Maya Gurung",
    location: "Pokhara",
    price: "1,800",
    rating: 4.6,
    tag: "TEXTILE",
    category: "Fashion & Accessories",
    image: textileImg,
  },
  {
    title: "Dhaka Cotton Table Runner",
    artisan: "Sita Maharjan",
    location: "Bhaktapur",
    price: "3,200",
    rating: 4.9,
    tag: "TEXTILE",
    category: "Textile & Fabric Crafts",
    image: textileImg,
  },
  {
    title: "Black Clay Tea Set",
    artisan: "Ram Sharma",
    location: "Thimi",
    price: "4,500",
    rating: 4.8,
    tag: "POTTERY",
    category: "Handmade Products",
    image: bowlImg,
  },
  {
    title: "Mithila Coaster Set",
    artisan: "Anita Jha",
    location: "Janakpur",
    price: "480",
    rating: 4.7,
    tag: "MITHILA",
    category: "Art and Paintings",
    image: notebookImg,
  },
  {
    title: "Lokta Paper Lamp Shade",
    artisan: "Bina Shrestha",
    location: "Kathmandu",
    price: "2,100",
    rating: 4.5,
    tag: "PAPER",
    category: "Home Décor",
    image: bowlImg,
  },
  {
    title: "Woven Wall Tapestry",
    artisan: "Maya Gurung",
    location: "Pokhara",
    price: "6,400",
    rating: 4.9,
    tag: "TEXTILE",
    category: "Textile & Fabric Crafts",
    image: textileImg,
  },
  {
    title: "Brass Singing Bowl",
    artisan: "Krishna Tamang",
    location: "Patan",
    price: "9,500",
    rating: 5.0,
    tag: "METAL",
    category: "Handmade Products",
    image: brassImg,
  },
  {
    title: "Tamang Wood Mask",
    artisan: "Ganesh Tamang",
    location: "Patan",
    price: "7,200",
    rating: 4.8,
    tag: "WOODWORK",
    category: "Art and Paintings",
    image: notebookImg,
  },
  {
    title: "Herbal Wellness Gift Set",
    artisan: "Priya Karki",
    location: "Kathmandu",
    price: "1,950",
    rating: 4.6,
    tag: "WELLNESS",
    category: "Beauty and Wellness Products",
    image: textileImg,
  },
  {
    title: "Silver Filigree Earrings",
    artisan: "Rina Maharjan",
    location: "Patan",
    price: "3,600",
    rating: 4.9,
    tag: "JEWELRY",
    category: "Fashion & Accessories",
    image: brassImg,
  },
  {
    title: "Hand-painted Canvas",
    artisan: "Anita Jha",
    location: "Janakpur",
    price: "8,800",
    rating: 4.7,
    tag: "PAINTING",
    category: "Art and Paintings",
    image: notebookImg,
  },
  {
    title: "Macramé Wall Hanging",
    artisan: "Bina Shrestha",
    location: "Kathmandu",
    price: "2,750",
    rating: 4.8,
    tag: "DECOR",
    category: "Home Décor",
    image: textileImg,
  },
];

function StarRating({ rating }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-[#6B6560]">
      <svg
        className="h-3.5 w-3.5 text-[#E8A317]"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {rating}
    </span>
  );
}

function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(46,29,23,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(46,29,23,0.1)]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#6B6560] uppercase">
          {product.tag}
        </span>
        <button
          type="button"
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#6B6560] transition-colors hover:text-[#B25B3E]"
          aria-label={`Save ${product.title}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-sm font-semibold leading-snug text-[#2E1D17] sm:text-[15px]">
            {product.title}
          </h3>
          <StarRating rating={product.rating} />
        </div>
        <p className="mt-1 text-xs text-[#9A9189]">
          by {product.artisan} · {product.location}
        </p>
        <p className="mt-2 font-serif text-base font-semibold text-[#B25B3E]">
          Rs {product.price}
        </p>
      </div>
    </article>
  );
}

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return marketplaceProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.artisan.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query) ||
        product.tag.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="w-full bg-[#FDF9F5]">
      <section className="bg-gradient-to-b from-[#F3E4D8] via-[#FAF3EC] to-[#FDF9F5] px-6 pb-8 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#B25B3E] uppercase">
            Marketplace
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#2E1D17] sm:text-5xl">
            Handmade, with story.
          </h1>
          <p className="mt-3 max-w-xl font-serif text-base text-[#2E1D17] sm:text-lg">
            Curated from artisan workshops across Nepal — every piece signed by
            its maker.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9A9189"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm text-[#2E1D17] placeholder:text-[#9A9189] focus:outline-none"
                aria-label="Search products"
              />
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#E0D5CC] bg-white px-6 py-3.5 text-sm font-medium text-[#2E1D17] shadow-sm transition-colors hover:border-[#B25B3E] hover:text-[#B25B3E]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m3-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#B25B3E] text-white"
                      : "border border-[#E0D5CC] bg-white text-[#2E1D17] hover:border-[#B25B3E] hover:text-[#B25B3E]",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-[#6B6560]">
              No products found. Try a different search or category.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Marketplace;
