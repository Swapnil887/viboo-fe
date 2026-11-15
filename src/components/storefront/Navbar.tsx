"use client";

import Link from "next/link";
import { Search, UserRound, Heart, ShoppingBag, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Boys", href: "/boys" },
  { label: "Girls", href: "/girls" },
  { label: "Clothing", href: "/clothing" },
  { label: "Accessories", href: "/accessories" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left text-2xl font-bold">
                  viboo.
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-gray-700 transition hover:text-black"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-[#B77950]"
        >
          viboo.
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-[#B77950]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search - Desktop */}
          <div className="hidden w-48 items-center rounded-full border px-3 md:flex">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="h-9 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            />
          </div>

          {/* Search - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Account */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="My account"
            className="hidden sm:inline-flex"
          >
            <UserRound className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Wishlist"
            className="hidden sm:inline-flex"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" aria-label="Shopping cart">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
