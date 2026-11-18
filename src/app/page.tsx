
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch menu from NeonDB
  async function fetchMenu() {
    try {
      setError("");

      const response = await fetch("/api/menu", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load menu");
      }

      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  // Add new menu item
  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price) {
      setError("Please fill in all fields.");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          description,
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to add item");
      }

      setName("");
      setPrice("");
      setDescription("");
      setCategory("Main Course");
      setShowForm(false);
      setSelectedCategory("All");

      await fetchMenu();

      setSuccess("Your menu item was added successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete menu item
  async function deleteItem(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dish?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/menu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete item");
      }

      await fetchMenu();
      setSuccess("Menu item deleted successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  // Filter items by selected category
  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <main className="min-h-screen bg-[#f8f5ed] text-[#26352b]">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#e8e1d3] bg-[#f8f5ed]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a
            href="#home"
            className="font-serif text-2xl font-bold tracking-wide"
          >
            Saffron <span className="text-[#b76e48]">&</span> Sage.
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#home" className="transition hover:text-[#b76e48]">
              Home
            </a>
            <a href="#about" className="transition hover:text-[#b76e48]">
              Our Story
            </a>
            <a href="#menu" className="transition hover:text-[#b76e48]">
              Menu
            </a>
          </div>

          <a
            href="#menu"
            className="rounded-full bg-[#314638] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b76e48] hover:shadow-lg"
          >
            Explore Menu
          </a>

        </div>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="hero-section relative flex min-h-[620px] items-center overflow-hidden bg-cover bg-center px-6"
      >
        <div className="absolute inset-0 bg-[#17251c]/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl py-24">

          <p className="hero-text mb-5 text-sm font-semibold uppercase tracking-[0.35em] text-[#e9bd91]">
            Fresh Ingredients · Beautiful Moments
          </p>

          <h1 className="hero-text max-w-3xl font-serif text-5xl font-bold leading-tight text-white md:text-7xl">
            A Taste of
            <br />
            <span className="italic text-[#e9bd91]">
              Something Special.
            </span>
          </h1>

          <p className="hero-text mt-7 max-w-xl text-lg leading-8 text-white/85">
            Discover thoughtfully prepared dishes, fresh ingredients
            and unforgettable flavours in a warm and welcoming space.
          </p>

          <a
            href="#menu"
            className="hero-text mt-9 inline-block rounded-full bg-[#e9bd91] px-8 py-4 font-semibold text-[#26352b] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
          >
            Discover Our Menu →
          </a>

        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">

          <div className="reveal">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b76e48]">
              Welcome to Saffron & Sage
            </p>

            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              Good food brings
              <span className="italic text-[#b76e48]">
                {" "}people together.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-[#657064]">
              We believe every meal should be an experience.
              Our kitchen celebrates fresh ingredients, balanced
              flavours and the simple joy of sharing good food.
            </p>

            <a
              href="#menu"
              className="mt-8 inline-block border-b-2 border-[#314638] pb-2 font-semibold transition hover:text-[#b76e48]"
            >
              Explore the menu →
            </a>
          </div>

          <div className="reveal overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=85"
              alt="Elegant restaurant interior"
              className="h-[380px] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="bg-[#eeeade] px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center reveal">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#b76e48]">
              From Our Kitchen
            </p>

            <h2 className="font-serif text-4xl font-bold md:text-5xl">
              Our Delicious Menu
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-[#657064]">
              Explore our selection of delicious dishes,
              freshly prepared for you.
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ${
                  selectedCategory === item
                    ? "bg-[#314638] text-white shadow-lg"
                    : "border border-[#d4d0c4] bg-white text-[#314638] hover:bg-[#314638] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Menu Heading and Add Button */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

            <div>
              <h3 className="font-serif text-2xl font-bold">
                {selectedCategory === "All"
                  ? "All Dishes"
                  : selectedCategory}
              </h3>

              <p className="mt-1 text-sm text-[#657064]">
                {filteredItems.length} items available
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccess("");
              }}
              className="rounded-full bg-[#b76e48] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#965739]"
            >
              {showForm ? "Close Form ×" : "+ Add Menu Item"}
            </button>

          </div>

          {/* Add Item Form */}
          {showForm && (
            <form
              onSubmit={addItem}
              className="mb-10 rounded-3xl border border-[#ddd4c4] bg-white p-6 shadow-lg md:p-9"
            >
              <h3 className="mb-6 font-serif text-2xl font-bold">
                Add a New Dish
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Food Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Creamy Alfredo Pasta"
                    maxLength={255}
                    required
                    className="w-full rounded-xl border border-[#ddd4c4] p-4 outline-none transition focus:border-[#b76e48]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price (PKR)
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1250"
                    required
                    className="w-full rounded-xl border border-[#ddd4c4] p-4 outline-none transition focus:border-[#b76e48]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#ddd4c4] bg-white p-4 outline-none focus:border-[#b76e48]"
                  >
                    {categories.slice(1).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your delicious dish..."
                    rows={3}
                    required
                    className="w-full rounded-xl border border-[#ddd4c4] p-4 outline-none transition focus:border-[#b76e48]"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 rounded-full bg-[#314638] px-8 py-4 font-bold text-white transition hover:bg-[#b76e48] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Menu Item"}
              </button>

            </form>
          )}

          {/* Success and Error Messages */}
          {error && (
            <p
              role="alert"
              className="mb-6 rounded-xl bg-red-100 p-4 text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="mb-6 rounded-xl bg-green-100 p-4 text-green-800"
            >
              {success}
            </p>
          )}

          {/* Dynamic Menu Cards */}
          {loading ? (
            <p className="py-16 text-center text-[#657064]">
              Preparing your menu...
            </p>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-12 text-center">
              <p className="font-serif text-2xl font-bold">
                No dishes found!
              </p>

              <p className="mt-3 text-[#657064]">
                Add a dish to this category to get started.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-full bg-[#314638] px-6 py-3 font-semibold text-white"
              >
                + Add Dish
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="menu-card group rounded-2xl border border-[#e1dacb] bg-[#faf8f2] p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="mb-5 flex flex-wrap items-center justify-between gap-2">

                    <span className="rounded-full bg-[#e8eadf] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#314638]">
                      {item.category}
                    </span>

                    <span className="font-serif text-xl font-bold text-[#b76e48]">
                      Rs. {Number(item.price).toLocaleString("en-PK")}
                    </span>

                  </div>

                  <h3 className="font-serif text-2xl font-bold transition group-hover:text-[#b76e48]">
                    {item.name}
                  </h3>

                  <p className="mt-4 min-h-16 leading-7 text-[#657064]">
                    {item.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-[#e4ddcf] pt-5">

                    <span className="text-xs font-medium text-[#899085]">
                      Item #{item.id}
                    </span>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-sm font-semibold text-red-600 transition hover:text-red-800"
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

      {/* Footer */}
      <footer className="bg-[#25382d] px-6 py-12 text-center text-white">

        <h2 className="font-serif text-3xl font-bold">
          Saffron <span className="text-[#e9bd91]">&</span> Sage.
        </h2>

        <p className="mt-4 text-sm text-white/65">
          Fresh flavours. Beautiful moments. Made with love.
        </p>

        <p className="mt-8 text-xs text-white/45">
          © {new Date().getFullYear()} Saffron & Sage.
          All rights reserved.
        </p>

      </footer>

    </main>
  );
}
