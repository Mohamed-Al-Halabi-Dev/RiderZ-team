import { memo } from "react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";

function RidesHeader({ count, search, onSearch, onClear }) {
  return (
    <header className="space-y-6">
      <nav aria-label="مسار" className="text-sm">
        <ol className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link to="/" className="transition-colors text-white/50 hover:text-[#F9EA02]">
              الرئيسية
            </Link>
          </li>
          <li className="text-white/30">/</li>
          <li className="font-bold text-white">الجولات</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            كل رحلة
            <br />
            <span className="text-[#F9EA02]">هي قصة جديدة</span>
          </h1>

          <p className="mt-4 text-sm font-semibold leading-7 text-white/60 sm:text-base">
            اختر مغامرتك القادمة من بين {count} جولة نشطة.
          </p>
        </div>

        <div className="w-full shrink-0 lg:max-w-sm">
          <SearchInput
            value={search}
            onChange={onSearch}
            onClear={onClear}
          />
        </div>
      </div>
    </header>
  );
}

export default memo(RidesHeader);