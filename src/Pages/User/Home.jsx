import { Link } from "react-router-dom";
import homeBackground from "../../assets/HomeBackground.png";
import bowlImg from "../../assets/products/bowl.jpg";
import textileImg from "../../assets/products/textile.jpg";
import brassImg from "../../assets/products/brass.jpg";
import notebookImg from "../../assets/products/notebook.jpg";
import artisan1Img from "../../assets/products/artisan1.jpg";
import artisan2Img from "../../assets/products/artisan2.jpg";
import artisan3Img from "../../assets/products/artisan3.jpg";
import artisan4Img from "../../assets/products/artisan4.jpg";

const CREAM = "#FDF9F5";

const categories = [
  { name: "Art and Paintings", count: 85, icon: "art" },
  { name: "Handmade Products", count: 240, icon: "handmade" },
  { name: "Fashion & Accessories", count: 180, icon: "fashion" },
  { name: "Home Décor", count: 340, icon: "decor" },
  { name: "Beauty and Wellness Products", count: 64, icon: "wellness" },
  { name: "Textile & Fabric Crafts", count: 210, icon: "textile" },
];

const products = [
  {
    title: "Himalayan Clay Bowl",
    artisan: "Ram Sharma",
    location: "Thimi",
    price: "2,400",
    rating: 4.8,
    tag: "POTTERY",
    isNew: true,
    image: bowlImg,
  },
  {
    title: "Silk Dhaka Top",
    artisan: "Sita Maharjan",
    location: "Bhaktapur",
    price: "4,500",
    rating: 4.9,
    tag: "TEXTILE",
    isNew: false,
    image: textileImg,
  },
  {
    title: "Brass Wall Hanging",
    artisan: "Krishna Tamang",
    location: "Patan",
    price: "8,200",
    rating: 5.0,
    tag: "METAL",
    isNew: false,
    image: brassImg,
  },
  {
    title: "Mithila Notebook",
    artisan: "Anita Jha",
    location: "Janakpur",
    price: "550",
    rating: 4.7,
    tag: "MITHILA",
    isNew: false,
    image: notebookImg,
  },
];

const artisans = [
  {
    name: "Sita Maharjan",
    title: "Master Potter",
    location: "Bhaktapur",
    tag: "POTTERY",
    rating: 4.9,
    image: artisan1Img,
  },
  {
    name: "Krishna Tamang",
    title: "Brass Artisan",
    location: "Patan",
    tag: "METAL",
    rating: 5.0,
    image: artisan2Img,
  },
  {
    name: "Anita Jha",
    title: "Mithila Artist",
    location: "Janakpur",
    tag: "MITHILA",
    rating: 4.8,
    image: artisan3Img,
  },
  {
    name: "Ram Sharma",
    title: "Clay Artisan",
    location: "Thimi",
    tag: "POTTERY",
    rating: 4.7,
    image: artisan4Img,
  },
];

const testimonials = [
  {
    quote:
      "I commissioned a custom wedding set from Sita. The attention to detail was extraordinary — each piece felt like a heirloom.",
    name: "Priya Sharma",
    location: "Kathmandu",
  },
  {
    quote:
      "CraftConnect made it so easy to find authentic brass work. Krishna's wall hanging is the centerpiece of our living room.",
    name: "David Chen",
    location: "Singapore",
  },
  {
    quote:
      "The Mithila notebooks I ordered as gifts were stunning. Anita even personalized them with our company logo.",
    name: "Sarah Miller",
    location: "London",
  },
];

function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#B25B3E] uppercase">
      {children}
    </p>
  );
}

function SectionHeading({ children, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#2E1D17] sm:text-4xl">
        {children}
      </h2>
      {action}
    </div>
  );
}

function ViewAllLink({ to = "#" }) {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-[#6B6560] transition-colors hover:text-[#B25B3E]"
    >
      View all &gt;
    </Link>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? "text-[#E8A317]" : "text-[#E0D5CC]"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-medium text-[#6B6560]">{rating}</span>
    </div>
  );
}

function CategoryIcon({ type }) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#B25B3E",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "art":
      return (
        <svg {...props}>
          <path
            d="M12 3c-3.5 0-6 2.2-6 5.5S8.5 14 12 14s6-2.2 6-5.5S15.5 3 12 3Z"
            fill="#F5EDE4"
          />
          <path d="M8 8.5h.01M11 7h.01M14.5 9h.01M10 11h.01" strokeWidth={2} />
          <path d="M12 14v3M9 20h6M10.5 17H12" />
          <path d="M15 5l2-1.5 2 1.5-1 2.5h-2L15 5Z" fill="#B25B3E" stroke="none" />
        </svg>
      );
    case "handmade":
      return (
        <svg {...props}>
          <path
            d="M8 11V8a2 2 0 0 1 4 0v3M16 11V9a2 2 0 0 1 4 0v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-3a2 2 0 0 1 4 0v2"
            fill="#F5EDE4"
          />
          <path d="M12 11v8M9 15h6" />
          <circle cx="12" cy="6" r="1.5" fill="#B25B3E" stroke="none" />
        </svg>
      );
    case "fashion":
      return (
        <svg {...props}>
          <path d="M8 7h8l1.5 3.5L18 20H6l.5-9.5L8 7Z" fill="#F5EDE4" />
          <path d="M8 7 10 4h4l2 3M10 4v3M14 4v3" />
          <circle cx="12" cy="13" r="1.5" fill="#B25B3E" stroke="none" />
        </svg>
      );
    case "decor":
      return (
        <svg {...props}>
          <path d="M5 10h14v9H5z" fill="#F5EDE4" />
          <path d="M7 10V7a5 5 0 0 1 10 0v3" />
          <path d="M9 19v-4h6v4" />
          <path d="M12 3v1" />
          <circle cx="12" cy="14" r="1.5" fill="#B25B3E" stroke="none" />
        </svg>
      );
    case "wellness":
      return (
        <svg {...props}>
          <path
            d="M12 21c-4-3.5-7-7-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-3 7.5-7 11Z"
            fill="#F5EDE4"
          />
          <path d="M12 10v6M9.5 12.5h5" strokeWidth={1.2} />
        </svg>
      );
    case "textile":
      return (
        <svg {...props}>
          <ellipse cx="12" cy="6" rx="7" ry="3" fill="#F5EDE4" />
          <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 10c0 1.7 3.1 3 7 3s7-1.3 7-3M5 14c0 1.7 3.1 3 7 3s7-1.3 7-3" />
          <path d="M9 3l1.5 2M15 3l-1.5 2" strokeWidth={1.2} />
        </svg>
      );
    default:
      return null;
  }
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={homeBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl leading-tight font-semibold tracking-tight text-[#2E1D17] sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
            Connecting{" "}
            <em className="font-serif text-[#B25B3E] italic">craftsmanship</em>{" "}
            with community.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#2E1D17] sm:text-[17px]">
            Discover authentic handmade goods from Kathmandu Valley artisans.
            Every piece tells a story of tradition, skill, and care.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-full bg-[#B25B3E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Explore Crafts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#2E1D17]/15 bg-white px-6 py-3 text-sm font-medium text-[#2E1D17] transition-colors hover:bg-[#FDF9F5]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2E1D17] text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={10}
                  height={10}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Hire an Artisan
            </button>
          </div>

          <div className="mt-8 flex max-w-lg items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-sm">
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
              placeholder="Search crafts, artisans, or categories..."
              className="w-full bg-transparent text-sm text-[#2E1D17] placeholder:text-[#9A9189] focus:outline-none"
              aria-label="Search crafts, artisans, or categories"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="bg-[#FDF9F5] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>Explore</SectionLabel>
        <SectionHeading>Categories</SectionHeading>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to="/marketplace"
              className="flex flex-col items-center rounded-2xl bg-white px-4 py-6 text-center shadow-[0_2px_12px_rgba(46,29,23,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(46,29,23,0.1)]"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FAF4EE] to-[#F0E4D8] shadow-inner">
                <CategoryIcon type={cat.icon} />
              </div>
              <h3 className="text-[13px] font-semibold leading-snug text-[#2E1D17]">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-xs text-[#9A9189]">
                {cat.count} pieces
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section className="bg-[#FDF9F5] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>Trending now</SectionLabel>
        <SectionHeading action={<ViewAllLink to="/marketplace" />}>
          Handmade pieces this week
        </SectionHeading>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <article
              key={product.title}
              className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(46,29,23,0.06)]"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-start justify-between gap-2">
                  <span className="rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#6B6560] uppercase">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                  {product.isNew && (
                    <span className="rounded-full bg-[#B25B3E] px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase">
                      New
                    </span>
                  )}
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#6B6560] transition-colors hover:text-[#B25B3E]"
                    aria-label={`Save ${product.title}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
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
              </div>
              <div className="p-3">
                <h3 className="font-serif text-sm font-semibold text-[#2E1D17] sm:text-base">
                  {product.title}
                </h3>
                <p className="mt-0.5 text-xs text-[#9A9189]">
                  {product.artisan} · {product.location}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#B25B3E]">
                    Rs. {product.price}
                  </p>
                  <Stars rating={product.rating} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtisansSection() {
  return (
    <section className="bg-[#FDF9F5] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>Meet the makers</SectionLabel>
        <SectionHeading action={<ViewAllLink to="/artisans" />}>
          Our Artisans
        </SectionHeading>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {artisans.map((artisan) => (
            <article
              key={artisan.name}
              className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(46,29,23,0.06)]"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={artisan.image}
                  alt={artisan.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-start justify-between gap-2">
                  <span className="rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#6B6560] uppercase">
                    {artisan.tag}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#6B6560] transition-colors hover:text-[#B25B3E]"
                    aria-label={`Message ${artisan.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-serif text-sm font-semibold text-[#2E1D17] sm:text-base">
                  {artisan.name}
                </h3>
                <p className="mt-0.5 text-xs text-[#9A9189]">
                  {artisan.title} · {artisan.location}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#B25B3E] transition-opacity hover:opacity-80"
                  >
                    Hire
                  </button>
                  <Stars rating={artisan.rating} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-[#FDF9F5] px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <SectionLabel>Testimonials</SectionLabel>
        <SectionHeading>Stories from our community</SectionHeading>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(46,29,23,0.06)]"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-[#E8A317]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="flex-1 font-serif text-lg leading-relaxed text-[#2E1D17] italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-5">
                <p className="text-sm font-semibold text-[#2E1D17]">
                  {item.name}
                </p>
                <p className="text-sm text-[#9A9189]">{item.location}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-gradient-to-br from-[#B25B3E] to-[#9A4A30] px-8 py-12 sm:flex-row sm:items-center sm:px-12 sm:py-14">
          <div className="max-w-lg">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Have something in mind? Let an artisan make it.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Post a custom request and connect with skilled makers across the
              Kathmandu Valley.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#2E1D17] transition-opacity hover:opacity-90"
            >
              Find an artisan
            </button>
            <button
              type="button"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Join CraftConnect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const Home = () => {
  return (
    <main className="w-full" style={{ backgroundColor: CREAM }}>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      <ArtisansSection />
      <TestimonialsSection />
      <CtaBanner />
    </main>
  );
};

export default Home;
