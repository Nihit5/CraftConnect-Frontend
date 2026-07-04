import artisan1Img from "../../assets/products/artisan1.jpg";
import artisan2Img from "../../assets/products/artisan2.jpg";
import artisan3Img from "../../assets/products/artisan3.jpg";
import artisan4Img from "../../assets/products/artisan4.jpg";

const artisans = [
  {
    name: "Sita Maharjan",
    craft: "Master Potter",
    location: "Bhaktapur",
    rating: 4.9,
    projects: 48,
    bio: "Third-generation potter weaving stories into clay.",
    image: artisan1Img,
  },
  {
    name: "Krishna Tamang",
    craft: "Brass Artisan",
    location: "Patan",
    rating: 5.0,
    projects: 31,
    bio: "Lost-wax brass work passed down through four generations.",
    image: artisan2Img,
  },
  {
    name: "Anita Jha",
    craft: "Mithila Artist",
    location: "Janakpur",
    rating: 4.8,
    projects: 22,
    bio: "Bold Mithila folk art on paper, textiles, and home décor.",
    image: artisan3Img,
  },
  {
    name: "Ram Sharma",
    craft: "Clay Artisan",
    location: "Thimi",
    rating: 4.7,
    projects: 36,
    bio: "Traditional black clay techniques from the Kathmandu Valley.",
    image: artisan4Img,
  },
  {
    name: "Ganesh Tamang",
    craft: "Wood Carver",
    location: "Patan",
    rating: 4.9,
    projects: 27,
    bio: "Hand-carved panels and masks rooted in Newari tradition.",
    image: artisan2Img,
  },
  {
    name: "Maya Gurung",
    craft: "Textile Weaver",
    location: "Pokhara",
    rating: 4.6,
    projects: 19,
    bio: "Handwoven hemp and cotton pieces with mountain-inspired patterns.",
    image: artisan1Img,
  },
  {
    name: "Bina Shrestha",
    craft: "Paper Artisan",
    location: "Kathmandu",
    rating: 4.5,
    projects: 15,
    bio: "Lokta paper crafts and lamp shades made by hand.",
    image: artisan3Img,
  },
  {
    name: "Rina Maharjan",
    craft: "Jewelry Maker",
    location: "Patan",
    rating: 4.9,
    projects: 33,
    bio: "Silver filigree earrings and necklaces crafted in Patan workshops.",
    image: artisan4Img,
  },
];

function IconPin(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArtisanCard({ artisan }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(46,29,23,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(46,29,23,0.1)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={artisan.image}
          alt={artisan.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3.5 pt-12">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-white/75 uppercase">
            {artisan.craft}
          </p>
          <h3 className="font-serif text-base font-semibold text-white">
            {artisan.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-white/85">
            <span className="inline-flex items-center gap-0.5">
              <IconPin />
              {artisan.location}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <svg
                className="h-3 w-3 text-[#E8A317]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {artisan.rating}
            </span>
            <span>{artisan.projects} projects</span>
          </div>
        </div>
      </div>
      <div className="p-3.5">
        <p className="line-clamp-2 text-xs leading-relaxed text-[#6B6560]">
          {artisan.bio}
        </p>
        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-full bg-[#B25B3E] py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            Hire
          </button>
          <button
            type="button"
            className="flex-1 rounded-full border border-[#E0D5CC] bg-white py-2 text-xs font-medium text-[#2E1D17] transition-colors hover:border-[#B25B3E] hover:text-[#B25B3E]"
          >
            Message
          </button>
        </div>
      </div>
    </article>
  );
}

const Artisans = () => {
  return (
    <main className="w-full bg-[#FDF9F5]">
      <section className="bg-gradient-to-b from-[#F3E4D8] via-[#FAF3EC] to-[#FDF9F5] px-6 pb-8 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#B25B3E] uppercase">
            Artisans
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#2E1D17] sm:text-5xl">
            The hands behind the craft.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#6B6560] sm:text-lg">
            Browse portfolios, send a project request, and commission custom work
            directly from master makers.
          </p>
        </div>
      </section>

      <section className="px-6 pb-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.name} artisan={artisan} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Artisans;
