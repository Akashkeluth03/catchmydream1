"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type CountryOption = {
  slug: string;
  name: string;
  topStudentCities: string[];
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

// Approximate USD -> local currency rates (1 USD = X local units).
// Update these or replace with a live rates API if available.
const CURRENCY_RATES: Record<string, number> = {
  singapore: 1.35,
  malaysia: 4.5,
  "united-arab-emirates": 3.67,
  japan: 150,
  "south-korea": 1300,
  thailand: 34,
  india: 83,
  china: 7,
  vietnam: 24000,
  philippines: 56,
  indonesia: 15500,
  pakistan: 280,
  bangladesh: 105,
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
  const conversionRate = country ? (CURRENCY_RATES[country] ?? 1) : 1;

  // Filter cities by selected country (using both university data and country's top cities)
  const cityOptions = React.useMemo(() => {
    if (!country) return [];
    const selectedCountryObj = countries.find(c => c.slug === country);
    const citiesFromCountry = selectedCountryObj?.topStudentCities || [];
    const unisInCountry = universities.filter(u => u.country.slug === country);
    const citiesFromUnis = unisInCountry.map(u => u.city);
    
    return Array.from(new Set([...citiesFromCountry, ...citiesFromUnis]))
      .filter(Boolean)
      .sort();
  }, [country, countries, universities]);

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

  // Display universities in the UI: if a city is selected but there are none
  // in that city, fall back to showing all universities in the country.
  const displayUniversities = React.useMemo(() => {
    if (!country) return universities;
    const byCountry = universities.filter(u => u.country.slug === country);
    if (city) {
      const byCity = byCountry.filter(u => u.city === city);
      return byCity.length > 0 ? byCity : byCountry;
    }
    return byCountry;
  }, [country, city, universities]);

  // External university suggestions fetched from Google when none exist in DB
  const [externalUniversities, setExternalUniversities] = React.useState<Array<{ name: string; city?: string; id: string }>>([]);
  const [externalLoading, setExternalLoading] = React.useState(false);

  // If no universities found for selected city, try fetching suggestions
  React.useEffect(() => {
    let cancelled = false;
    async function fetchExternal() {
      if (!country || !city) return;
      if (displayUniversities.length > 0) return;
      setExternalLoading(true);
      try {
        const res = await fetch(`/api/google/universities?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setExternalUniversities(data || []);
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) setExternalLoading(false);
      }
    }
    fetchExternal();
    return () => {
      cancelled = true;
    };
  }, [country, city, displayUniversities.length]);

  const optionsToShow = displayUniversities.length > 0 ? displayUniversities : externalUniversities;

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
            <option value="">Select a country...</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
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
            <option value="">
              {!country ? "Select a country first..." : cityOptions.length === 0 ? "No cities available" : "Any City / Select..."}
            </option>
            {cityOptions.map((cName) => (
              <option key={cName} value={cName}>
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
            <option value="">
              {!country
                ? "Select a country first..."
                : city && filteredUniversities.length === 0
                ? "No universities in selected city — showing all in country"
                : displayUniversities.length === 0
                ? "No universities available"
                : "Select a university..."
              }
            </option>
            {optionsToShow.map((u: any) => (
              <option key={u.slug ?? u.id} value={u.slug ?? u.name}>
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
            <option value="">
              {!university ? "Select a university first..." : courseOptions.length === 0 ? "No courses available" : "Any Course / Select..."}
            </option>
            {courseOptions.map((c) => (
              <option key={c.slug} value={c.slug}>
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
              <option value="">
                {!university ? "Select a university first..." : budgetOptions.length === 0 ? "No budget info available" : "Select a budget..."}
              </option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {(Math.round(b * conversionRate)).toLocaleString()} {currency.code}
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

