"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type CountryOption = {
  slug: string;
  name: string;
};

type UniversityOption = {
  slug: string;
  name: string;
  city: string;
  country: { slug: string };
  courses: { slug: string; name: string; tuitionFeeUsd: number }[];
};

const COUNTRY_CURRENCIES: Record<string, { code: string; symbol: string }> = {
  singapore: { code: "SGD", symbol: "$" },
  malaysia: { code: "MYR", symbol: "RM" },
  "united-arab-emirates": { code: "AED", symbol: "د.إ" },
  japan: { code: "JPY", symbol: "¥" },
  "south-korea": { code: "KRW", symbol: "₩" },
  thailand: { code: "THB", symbol: "฿" },
  india: { code: "INR", symbol: "₹" },
  china: { code: "CNY", symbol: "¥" },
  vietnam: { code: "VND", symbol: "₫" },
  philippines: { code: "PHP", symbol: "₱" },
  indonesia: { code: "IDR", symbol: "Rp" },
  pakistan: { code: "PKR", symbol: "Rs" },
  bangladesh: { code: "BDT", symbol: "৳" },
};

export function HomeSearch({ 
  countries,
  universities 
}: { 
  countries: CountryOption[],
  universities: UniversityOption[]
}) {
  const router = useRouter();
  const [country, setCountry] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [university, setUniversity] = React.useState<string>("");
  const [course, setCourse] = React.useState<string>("");
  const [budget, setBudget] = React.useState<string>("");
  const [focused, setFocused] = React.useState<string | null>(null);

  const currency = country ? COUNTRY_CURRENCIES[country] : { code: "USD", symbol: "$" };

  // Filter cities by selected country
  const cityOptions = React.useMemo(() => {
    if (!country) return [];
    const unisInCountry = universities.filter(u => u.country.slug === country);
    return Array.from(new Set(unisInCountry.map(u => u.city))).filter(Boolean).sort();
  }, [country, universities]);

  // When country changes, reset city and deeper fields
  React.useEffect(() => {
    if (city) {
      const isValid = cityOptions.includes(city);
      if (!isValid) {
        queueMicrotask(() => {
          setCity("");
          setUniversity("");
          setCourse("");
          setBudget("");
        });
      }
    }
  }, [country, cityOptions, city]);

  // Filter universities by selected country AND city
  const filteredUniversities = React.useMemo(() => {
    if (!country) return universities;
    let filtered = universities.filter(u => u.country.slug === country);
    if (city) {
      filtered = filtered.filter(u => u.city === city);
    }
    return filtered;
  }, [country, city, universities]);

  // When city changes, reset university if not in new city
  React.useEffect(() => {
    if (university) {
      const isValid = filteredUniversities.some(u => u.slug === university);
      if (!isValid) {
        queueMicrotask(() => {
          setUniversity("");
          setCourse("");
          setBudget("");
        });
      }
    }
  }, [city, filteredUniversities, university]);

  // Courses for selected university
  const courseOptions = React.useMemo(() => {
    if (!university) return [];
    const selected = universities.find(u => u.slug === university);
    return selected ? selected.courses : [];
  }, [university, universities]);

  // When university changes, reset course if not valid
  React.useEffect(() => {
    if (course) {
      const isValid = courseOptions.some(c => c.slug === course);
      if (!isValid) {
        queueMicrotask(() => {
          setCourse("");
          setBudget("");
        });
      }
    }
  }, [university, courseOptions, course]);

  // When course changes, calculate budget options
  const budgetOptions = React.useMemo(() => {
    if (!university) return [];
    let selectedCourses = courseOptions;
    if (course) {
      selectedCourses = courseOptions.filter(c => c.slug === course);
    }
    if (selectedCourses.length === 0) return [];
    // Extract unique tuition fees and sort them
    const fees = Array.from(new Set(selectedCourses.map(c => c.tuitionFeeUsd))).sort((a, b) => a - b);
    return fees;
  }, [university, courseOptions, course]);

  // Auto-select budget if there's only one
  React.useEffect(() => {
    if (budgetOptions.length === 1) {
      queueMicrotask(() => setBudget(budgetOptions[0].toString()));
    } else if (budget && budgetOptions.length > 0) {
      const isValid = budgetOptions.includes(Number(budget));
      if (!isValid) queueMicrotask(() => setBudget(""));
    }
  }, [budgetOptions, budget]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sp = new URLSearchParams();
    if (country) sp.set("country", country);
    if (city) sp.set("city", city);
    if (university) sp.set("university", university);
    if (course) sp.set("course", course);
    if (budget) sp.set("budget", budget);

    router.push(`/search?${sp.toString()}`);
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={onSubmit}>
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#212121] mb-2">
            Preferred Country
          </label>
          <select
            className={`w-full h-12 rounded-xl border-2 bg-white px-4 text-[#212121] outline-none transition ${
              focused === "country"
                ? "border-indigo-500 ring-2 ring-indigo-500/30"
                : "border-zinc-300 focus:border-indigo-500"
            }`}
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onFocus={() => setFocused("country")}
            onBlur={() => setFocused(null)}
          >
            <option value="" className="text-black">Select a country...</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug} className="text-black">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* City Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#212121] mb-2">
            Select City/State
          </label>
          <select
            className={`w-full h-12 rounded-xl border-2 bg-white px-4 text-[#212121] outline-none transition ${
              focused === "city"
                ? "border-indigo-500 ring-2 ring-indigo-500/30"
                : "border-zinc-300 focus:border-indigo-500"
            } disabled:opacity-50`}
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setFocused("city")}
            onBlur={() => setFocused(null)}
            disabled={!country || cityOptions.length === 0}
          >
            <option value="" className="text-black">
              {!country ? "Select a country first..." : cityOptions.length === 0 ? "No cities available" : "Any City / Select..."}
            </option>
            {cityOptions.map((cName) => (
              <option key={cName} value={cName} className="text-black">
                {cName}
              </option>
            ))}
          </select>
        </div>

        {/* University Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#212121] mb-2">
            Select University
          </label>
          <select
            className={`w-full h-12 rounded-xl border-2 bg-white px-4 text-[#212121] outline-none transition ${
              focused === "university"
                ? "border-indigo-500 ring-2 ring-indigo-500/30"
                : "border-zinc-300 focus:border-indigo-500"
            } disabled:opacity-50`}
            name="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            onFocus={() => setFocused("university")}
            onBlur={() => setFocused(null)}
            disabled={!country}
          >
            <option value="" className="text-black">
              {!country ? "Select a country first..." : "Select a university..."}
            </option>
            {filteredUniversities.map((u) => (
              <option key={u.slug} value={u.slug} className="text-black">
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#212121] mb-2">
            Select Course
          </label>
          <select
            className={`w-full h-12 rounded-xl border-2 bg-white px-4 text-[#212121] outline-none transition ${
              focused === "course"
                ? "border-indigo-500 ring-2 ring-indigo-500/30"
                : "border-zinc-300 focus:border-indigo-500"
            } disabled:opacity-50`}
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            onFocus={() => setFocused("course")}
            onBlur={() => setFocused(null)}
            disabled={!university || courseOptions.length === 0}
          >
            <option value="" className="text-black">
              {!university ? "Select a university first..." : courseOptions.length === 0 ? "No courses available" : "Any Course / Select..."}
            </option>
            {courseOptions.map((c) => (
              <option key={c.slug} value={c.slug} className="text-black">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#212121] mb-2">
            Course Budget per Year ({currency.code})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-semibold">
              {currency.symbol}
            </span>
            <select
              className={`w-full h-12 rounded-xl border-2 bg-white pl-8 pr-4 text-[#212121] outline-none transition ${
                focused === "budget"
                  ? "border-indigo-500 ring-2 ring-indigo-500/30"
                  : "border-zinc-300 focus:border-indigo-500"
              } disabled:opacity-50`}
              name="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onFocus={() => setFocused("budget")}
              onBlur={() => setFocused(null)}
              disabled={!university || budgetOptions.length === 0}
            >
              <option value="" className="text-black">
                {!university ? "Select a university first..." : budgetOptions.length === 0 ? "No budget info available" : "Select a budget..."}
              </option>
              {budgetOptions.map((b) => (
                <option key={b} value={b} className="text-black">
                  {b.toLocaleString()} {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold transition hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95"
        >
          <Search className="w-4 h-4" />
          Search Results
        </button>
      </form>

      <p className="mt-4 text-xs text-zinc-500 text-center">
        Fill in any or all fields to find universities, accommodations, and jobs
      </p>
    </div>
  );
}

