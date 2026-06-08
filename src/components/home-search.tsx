"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Map, Building2, GraduationCap, Banknote, MapPin } from "lucide-react";

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

  // Filter cities by selected country
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

  // When country changes, reset deep fields
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

  const displayUniversities = React.useMemo(() => {
    if (!country) return universities;
    const byCountry = universities.filter(u => u.country.slug === country);
    if (city) {
      const byCity = byCountry.filter(u => u.city === city);
      return byCity.length > 0 ? byCity : byCountry;
    }
    return byCountry;
  }, [country, city, universities]);

  const [externalUniversities, setExternalUniversities] = React.useState<Array<{ name: string; city?: string; id: string }>>([]);
  const [externalLoading, setExternalLoading] = React.useState(false);

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

  const courseOptions = React.useMemo(() => {
    if (!university) return [];
    const selected = universities.find(u => u.slug === university);
    return selected ? selected.courses : [];
  }, [university, universities]);

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

  const budgetOptions = React.useMemo(() => {
    if (!university) return [];
    let selectedCourses = courseOptions;
    if (course) {
      selectedCourses = courseOptions.filter(c => c.slug === course);
    }
    if (selectedCourses.length === 0) return [];
    const fees = Array.from(new Set(selectedCourses.map(c => c.tuitionFeeUsd))).sort((a, b) => a - b);
    return fees;
  }, [university, courseOptions, course]);

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
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10" onSubmit={onSubmit}>
        
        {/* Country */}
        <div className="relative group lg:col-span-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Map className={`w-4 h-4 ${country ? 'text-indigo-400' : 'text-zinc-500'} transition-colors`} />
          </div>
          <select
            className="w-full h-12 rounded-xl appearance-none glass-input pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="" className="text-zinc-800">Country</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug} className="text-zinc-800">{c.name}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="relative group lg:col-span-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className={`w-4 h-4 ${city ? 'text-cyan-400' : 'text-zinc-500'} transition-colors`} />
          </div>
          <select
            className="w-full h-12 rounded-xl appearance-none glass-input pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!country || cityOptions.length === 0}
          >
            <option value="" className="text-zinc-800">
              {!country ? "City (Requires Country)" : cityOptions.length === 0 ? "No cities" : "Any City"}
            </option>
            {cityOptions.map((cName) => (
              <option key={cName} value={cName} className="text-zinc-800">{cName}</option>
            ))}
          </select>
        </div>

        {/* University */}
        <div className="relative group lg:col-span-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Building2 className={`w-4 h-4 ${university ? 'text-purple-400' : 'text-zinc-500'} transition-colors`} />
          </div>
          <select
            className="w-full h-12 rounded-xl appearance-none glass-input pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-purple-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            disabled={!country}
          >
            <option value="" className="text-zinc-800">
              {!country ? "University" : displayUniversities.length === 0 ? "No universities" : "Any University"}
            </option>
            {optionsToShow.map((u: any) => (
              <option key={u.slug ?? u.id} value={u.slug ?? u.name} className="text-zinc-800">{u.name}</option>
            ))}
          </select>
        </div>

        {/* Course */}
        <div className="relative group lg:col-span-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <GraduationCap className={`w-4 h-4 ${course ? 'text-pink-400' : 'text-zinc-500'} transition-colors`} />
          </div>
          <select
            className="w-full h-12 rounded-xl appearance-none glass-input pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-pink-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            disabled={!university || courseOptions.length === 0}
          >
            <option value="" className="text-zinc-800">
              {!university ? "Course" : courseOptions.length === 0 ? "No courses" : "Any Course"}
            </option>
            {courseOptions.map((c) => (
              <option key={c.slug} value={c.slug} className="text-zinc-800">{c.name}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="lg:col-span-1">
          <button
            type="submit"
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:bg-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Search</span>
            <span className="lg:hidden">Find Programs</span>
          </button>
        </div>
      </form>
    </div>
  );
}
