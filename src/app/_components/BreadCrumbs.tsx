"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BreadCrumbs({ className }: { className?: string }) {
  const path = usePathname();
  const trail = [["Home", "/"]] as [string, string][];
  trail.push(
    ...path
      .split("/")
      .map(
        (p, i, a) =>
          [p, a.slice(0, i).join("/").toLowerCase() || "/"] as [string, string],
      )
      .filter((e) => e.at(0)?.length !== 0),
  );
  if (!trail.length) return null;
  return (
    <div className={className}>
      <nav className="sm:hidden" aria-label="Back">
        <Link
          href={trail.at(-1)!.at(-1)!}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft
            className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          Back
        </Link>
      </nav>
      <nav className="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-2">
          {trail.map(([k, v], i) => (
            <li key={k}>
              <div className="flex items-center">
                {i !== 0 && i !== trail.length && (
                  <ChevronRight
                    className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={v}
                  className="text-sm font-medium capitalize text-gray-300 hover:text-gray-100"
                >
                  {k}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
