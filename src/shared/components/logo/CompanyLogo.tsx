import React, { useState, useEffect } from "react";

interface CompanyLogoProps {
  companyName: string;
  isDark: boolean;
  sizeClasses?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyName,
  isDark,
  sizeClasses = "w-[22px] h-[22px] text-[9px]"
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const cleanName = companyName
    .trim()
    .split(/[\s,]+/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  useEffect(() => {
    if (!companyName.trim()) return;

    setImageError(false);

    // 1. Initial Guess (e.g. stripe -> stripe.com)
    const guessedUrl = `https://logo.clearbit.com/${cleanName}.com`;
    setLogoUrl(guessedUrl);

    // 2. Fetch autocomplete suggestions from Clearbit dynamically
    const controller = new AbortController();
    fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(companyName)}`, {
      signal: controller.signal
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Autocomplete request failed");
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].logo) {
          setLogoUrl(data[0].logo);
        }
      })
      .catch(() => {
        // Keep fallback guessedUrl
      });

    return () => controller.abort();
  }, [companyName, cleanName]);

  const firstLetter = companyName.trim().charAt(0).toUpperCase() || "?";

  const isStripe = cleanName.includes("stripe");
  const isGoogle = cleanName.includes("google");
  const isApple = cleanName.includes("apple");
  const isNetflix = cleanName.includes("netflix");
  const isMeta = cleanName.includes("meta") || cleanName.includes("facebook");

  let fallbackBg = isDark ? "bg-[#18181B] border-white/[0.04] text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600";
  let fallbackContent: React.ReactNode = <span className="font-bold tracking-tight">{firstLetter}</span>;

  if (isStripe) {
    fallbackBg = isDark ? "bg-[#635BFF]/10 border-[#635BFF]/15 text-[#7970FF]" : "bg-[#635BFF]/5 border-[#635BFF]/12 text-[#635BFF]";
  } else if (isGoogle) {
    fallbackBg = isDark ? "bg-[#4285F4]/10 border-[#4285F4]/15 text-[#4285F4]" : "bg-[#4285F4]/5 border-[#4285F4]/12 text-[#4285F4]";
    fallbackContent = (
      <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="currentColor" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
      </svg>
    );
  } else if (isApple) {
    fallbackBg = isDark ? "bg-zinc-800 border-white/5 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-zinc-800";
    fallbackContent = (
      <svg className="w-1/2 h-1/2 fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
      </svg>
    );
  } else if (isNetflix) {
    fallbackBg = isDark ? "bg-[#E50914]/10 border-[#E50914]/15 text-[#E50914]" : "bg-[#E50914]/5 border-[#E50914]/12 text-[#E50914]";
  } else if (isMeta) {
    fallbackBg = isDark ? "bg-[#0668E1]/10 border-[#0668E1]/15 text-[#3B82F6]" : "bg-[#0668E1]/5 border-[#0668E1]/12 text-[#0668E1]";
  }

  if (imageError || !logoUrl) {
    return (
      <div className={`${sizeClasses} rounded-full border ${fallbackBg} flex items-center justify-center shrink-0`}>
        {fallbackContent}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} rounded-full border ${isDark ? "border-white/[0.08]" : "border-zinc-200"} bg-white flex items-center justify-center shrink-0 overflow-hidden`}>
      <img
        src={logoUrl}
        alt={companyName}
        onError={() => setImageError(true)}
        className="w-full h-full object-contain p-1"
      />
    </div>
  );
};
