
"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: number;
  name: string;
  price: number | string;
  description: string;
  category: string;
};

const categories = [
  "All",
  "Starters",
  "Main Course",
  "Desserts",
  "Drinks",
];

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchMenu() {
    try {
      const response = await fetch("/api/menu", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setItems(data);
    } catch {
      setMessage("Unable to load menu. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          description,
          category,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setName("");
      setPrice("");
      setDescription("");
      setCategory("Main Course");
      setShowForm(false);
      setSelectedCategory("All");
      await fetchMenu();
      setMessage("Dish added successfully!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: number) {
    if (!window.confirm("Do you want to delete this dish?")) return;

    try {
      const response = await fetch("/api/menu", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await fetchMenu();
      setMessage("Dish deleted successfully!");
    } catch {
      setMessage("Unable to delete this dish.");
    }
  }

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <main className="bg-[#f8f5ed] text-[#29382d]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#ddd5c6] bg-[#f8f5ed]/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#home" className="font-serif text-2xl font-bold">
            Saffron <span className="text-[#b77b52]">&</span> Sage.
          </a>

          <div className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#home" className="hover:text-[#b77b52]">Home</a>
            <a href="#about" className="hover:text-[#b77b52]">Our Story</a>
            <a href="#why-us" className="hover:text-[#b77b52]">Our Values</a>
            <a href="#menu" className="hover:text-[#b77b52]">Menu</a>
            <a href="#visit" className="hover:text-[#b77b52]">Visit Us</a>
          </div>

          <a href="#reservations" className="rounded-full bg-[#314638] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b77b52]">
            Reserve a Table
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="hero-section relative flex min-h-[680px] items-center overflow-hidden px-6"
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl py-28">
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-[#e9bd91]">
            SAFFRON & SAGE · FRESH INGREDIENTS
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
            Where Every Bite
            <br />
            <span className="italic text-[#e9bd91]">
              Tells a Story.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">
            Discover exceptional flavours, beautifully prepared
            dishes and moments worth sharing.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#menu"
              className="rounded-full bg-[#e9bd91] px-9 py-4 font-bold text-[#26352b] transition hover:-translate-y-1 hover:bg-white"
            >
              EXPLORE OUR MENU →
            </a>

            <a
              href="#about"
              className="rounded-full border border-white px-9 py-4 font-bold text-white transition hover:bg-white hover:text-[#26352b]"
            >
              OUR STORY
            </a>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="about" className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b77b52]">
            OUR STORY
          </p>

          <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
            More Than Just a Meal.
          </h2>

          <p className="mt-7 leading-8 text-[#687267]">
            At Saffron & Sage, we believe great food creates
            beautiful memories. Our philosophy is simple:
            celebrate fresh ingredients, thoughtful preparation
            and flavours that bring people together.
          </p>

          <p className="mt-4 leading-8 text-[#687267]">
            From comforting favourites to delightful desserts,
            every dish represents our love for good food and
            meaningful dining experiences.
          </p>

          <a href="#menu" className="mt-8 inline-block border-b-2 border-[#314638] pb-2 font-semibold">
            Discover our menu →
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85"
            alt="Elegant restaurant dining experience"
            className="h-[440px] w-full object-cover transition duration-700 hover:scale-105"
          />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="bg-[#eae7dc] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b77b52]">
              THE SAFFRON EXPERIENCE
            </p>
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              What Makes Us Special
            </h2>
            <p className="mt-5 text-[#687267]">
              Every detail matters when it comes to creating
              an experience worth remembering.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: "✦",
                title: "Fresh Ingredients",
                description: "Thoughtfully selected ingredients and carefully prepared dishes.",
              },
              {
                number: "02",
                icon: "♨",
                title: "Crafted with Passion",
                description: "A love for flavours, creativity and beautiful food presentation.",
              },
              {
                number: "03",
                icon: "♡",
                title: "Memorable Moments",
                description: "A welcoming atmosphere designed for sharing special moments.",
              },
            ].map((feature) => (
              <div
                key={feature.number}
                className="group rounded-3xl bg-[#faf8f2] p-9 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <span className="text-4xl text-[#b77b52]">{feature.icon}</span>
                <p className="mt-6 text-xs font-bold tracking-widest text-[#b77b52]">
                  {feature.number}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-bold">
                  {feature.title}
                </h3>
                <p className="mt-4 leading-7 text-[#687267]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="bg-[#f3f0e7] px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b77b52]">
              FROM OUR KITCHEN
            </p>
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              Our Delicious Menu
            </h2>
            <p className="mt-5 text-[#687267]">
              Discover something delicious for every occasion.
            </p>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  selectedCategory === item
                    ? "bg-[#314638] text-white"
                    : "border border-[#d8d1c4] bg-white hover:bg-[#314638] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold">
                {selectedCategory === "All" ? "All Dishes" : selectedCategory}
              </h3>
              <p className="mt-1 text-sm text-[#687267]">
                {filteredItems.length} dishes available
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setMessage("");
              }}
              className="rounded-full bg-[#b77b52] px-6 py-3 font-bold text-white transition hover:bg-[#314638]"
            >
              {showForm ? "Close Form ×" : "+ Add Menu Item"}
            </button>
          </div>

          {/* ADD FORM */}
          {showForm && (
            <form onSubmit={addItem} className="mb-10 rounded-3xl bg-white p-7 shadow-lg">
              <h3 className="mb-6 font-serif text-2xl font-bold">
                Add a New Dish
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dish Name"
                  required
                  maxLength={255}
                  className="rounded-xl border p-4 outline-none focus:border-[#b77b52]"
                />

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price in PKR"
                  required
                  className="rounded-xl border p-4 outline-none focus:border-[#b77b52]"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border bg-white p-4 outline-none focus:border-[#b77b52]"
                >
                  {categories.slice(1).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dish Description"
                  required
                  className="rounded-xl border p-4 outline-none focus:border-[#b77b52]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 rounded-full bg-[#314638] px-8 py-4 font-bold text-white hover:bg-[#b77b52] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Menu Item"}
              </button>
            </form>
          )}

          {message && (
            <p role="status" className="mb-6 rounded-xl bg-white p-4 text-center">
              {message}
            </p>
          )}

          {/* MENU CARDS */}
          {loading ? (
            <p className="py-16 text-center">Loading delicious dishes...</p>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center">
              <h3 className="font-serif text-2xl font-bold">No dishes found</h3>
              <p className="mt-3 text-[#687267]">Add your first dish to this category.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#e2dacb] bg-[#faf8f2] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#e8eadf] px-4 py-2 text-xs font-bold uppercase">
                      {item.category}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#b77b52]">
                      Rs. {Number(item.price).toLocaleString("en-PK")}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl font-bold">
                    {item.name}
                  </h3>

                  <p className="mt-4 min-h-16 leading-7 text-[#687267]">
                    {item.description}
                  </p>

                  <div className="mt-7 flex justify-between border-t border-[#e2dacb] pt-5">
                    <span className="text-xs text-[#899085]">
                      Item #{item.id}
                    </span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-sm font-bold text-red-600 hover:text-red-800"
                    >
                      Remove ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VISIT US */}
      <section id="visit" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2">

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b77b52]">
              COME FIND US
            </p>
            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              Your Table Is Waiting.
            </h2>
            <p className="mt-6 leading-8 text-[#687267]">
              Whether it's a relaxed lunch, a special celebration
              or an evening with friends, we'd love to welcome you.
            </p>

            <div className="mt-9 space-y-7">
              <div>
                <h3 className="font-bold">Our Location</h3>
                <p className="mt-2 text-[#687267]">
                  Sample Address — Replace with your restaurant address.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Opening Hours</h3>
                <p className="mt-2 text-[#687267]">
                  Monday – Sunday: 12:00 PM – 11:00 PM
                  <br />
                  Sample hours — adjust as needed.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Contact</h3>
                <p className="mt-2 text-[#687267]">
                  Add your restaurant phone number here.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=85"
              alt="Beautiful restaurant interior"
              className="h-full min-h-[400px] w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* RESERVATIONS */}
      <section id="reservations" className="bg-[#314638] px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#e9bd91]">
            A PLACE AT OUR TABLE
          </p>
          <h2 className="font-serif text-4xl font-bold md:text-5xl">
            Make Your Visit Special.
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-8 text-white/75">
            Planning a special evening? Get in touch with us
            to enquire about reserving a table.
          </p>

          <a
            href="#visit"
            className="mt-9 inline-block rounded-full bg-[#e9bd91] px-9 py-4 font-bold text-[#26352b] transition hover:-translate-y-1 hover:bg-white"
          >
            Contact Us →
          </a>

          <p className="mt-5 text-xs text-white/60">
            Reservation enquiries are handled through contact. Online booking is not yet enabled.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1e3025] px-6 py-12 text-center text-white">
        <h2 className="font-serif text-3xl font-bold">
          Saffron <span className="text-[#e9bd91]">&</span> Sage.
        </h2>

        <p className="mt-4 text-sm text-white/60">
          Fresh flavours. Beautiful moments. Made with love.
        </p>

        <div className="mt-7 flex justify-center gap-6 text-sm text-white/75">
          <a href="#home" className="hover:text-[#e9bd91]">Home</a>
          <a href="#about" className="hover:text-[#e9bd91]">Our Story</a>
          <a href="#menu" className="hover:text-[#e9bd91]">Menu</a>
          <a href="#visit" className="hover:text-[#e9bd91]">Contact</a>
        </div>

        <p className="mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} Saffron & Sage. All rights reserved.
        </p>
      </footer>

    </main>
  );
}
