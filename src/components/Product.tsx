import React, { useEffect, useMemo, useState } from "react";
import { products } from "../data/productData";
import type { Category, Product } from "../data/productData";

import {
  Sun,
  Gauge,
  CheckCircle2,
  ArrowRight,
  X,
  ShoppingBag,
  ShieldCheck,
  Eye,
  Zap,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";

const categories: Category[] = [
  "All Products",
  "Inverter Battery",
  "Solar PCU",
  "Solar Panel",
  "On-Grid",
  "Off-Grid",
  "Hybrid",
];

const PRODUCTS_PER_PAGE = 6;
const WHATSAPP_NUMBER = "918667559595";

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

const getDiscount = (price: number, oldPrice: number) =>
  oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="500"
          height="375"
          onError={() => setHasError(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary/40 text-muted-foreground">
          <ImageOff className="h-8 w-8" />
          <span className="text-[11px] font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

export default function Product() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All Products");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Products") return products;

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const firstProductNumber =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const lastProductNumber = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!selectedProduct) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  const bookProduct = (product: Product) => {
    const message = `Hello, I am interested in this solar product.

Product: ${product.name}
Category: ${product.category}
Capacity: ${product.power}
Price: ${formatPrice(product.price)}
 Warranty: ${product.warranty}

Please share more details and availability.`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-40 h-72 w-72 rounded-full bg-solar/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-72 w-72 rounded-full bg-earth/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-earth/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-earth-dark sm:text-xs">
            <Sun className="h-3.5 w-3.5" />
            Complete Solar Solutions
          </span>

          <h2
            id="products-heading"
            className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            Explore Our{" "}
            <span className="text-gradient-solar">Solar Products</span>
          </h2>

          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our wide range of solar energy products, including
            high-efficiency solar panels, inverter batteries, solar PCUs, and
            on-grid, off-grid and hybrid inverters, along with many more
            solutions to meet your energy needs.
          </p>
        </header>

        {/* CATEGORY FILTER */}
        <nav
          aria-label="Filter solar products by category"
          className="mb-7 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full border px-3.5 py-2 text-[11px] font-bold transition-all duration-200 sm:px-5 sm:text-xs ${
                activeCategory === category
                  ? "border-solar bg-solar text-white shadow-sm"
                  : "border-border bg-card text-foreground hover:border-solar hover:text-solar"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* PRODUCT COUNT */}
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            Showing{" "}
            <strong className="text-foreground">
              {firstProductNumber}–{lastProductNumber}
            </strong>{" "}
            of{" "}
            <strong className="text-foreground">
              {filteredProducts.length}
            </strong>{" "}
            products
          </p>

          <span className="rounded-full bg-solar/10 px-3 py-1 text-[10px] font-bold text-solar sm:text-xs">
            {activeCategory}
          </span>
        </div>

        {/* COMPACT PRODUCT GRID */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {currentProducts.map((product) => {
              const Icon = product.icon;
              const discount = getDiscount(product.price, product.oldPrice);

              return (
                <article
                  key={product.id}
                  className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-solar/50 hover:shadow-md"
                >
                  {/* COMPACT IMAGE */}
                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-white p-4 sm:h-44">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-solar px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white">
                      {product.tag}
                    </span>

                    {discount > 0 && (
                      <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-[9px] font-bold text-white">
                        {discount}% OFF
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      aria-label={`View ${product.name} details`}
                      className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-night text-white shadow-md transition-colors hover:bg-solar"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* COMPACT CONTENT */}
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-solar">
                        {product.category}
                      </span>

                      <Icon
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-solar"
                      />
                    </div>

                    <h3 className="mb-2 min-h-[2.75rem] text-sm font-bold leading-snug text-foreground sm:text-base">
                      {product.name}
                    </h3>

                    {/* <p className="mb-3 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                      {product.description}
                    </p> */}

                    {/* COMPACT SPECIFICATIONS */}
                    <div className="mb-3 grid grid-cols-3 divide-x divide-border rounded-lg bg-secondary/50 py-2">
                      <div className="px-1 text-center">
                        <Gauge className="mx-auto mb-1 h-3.5 w-3.5 text-solar" />
                        <p className="text-[11px] font-bold text-foreground">
                          {product.efficiency}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          Efficiency
                        </p>
                      </div>

                      <div className="px-1 text-center">
                        <Zap className="mx-auto mb-1 h-3.5 w-3.5 text-solar" />
                        <p className="text-[11px] font-bold text-foreground">
                          {product.power}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          Capacity
                        </p>
                      </div>

                      <div className="px-1 text-center">
                        <ShieldCheck className="mx-auto mb-1 h-3.5 w-3.5 text-solar" />
                        <p className="text-[11px] font-bold text-foreground">
                          {product.warranty}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          Warranty
                        </p>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="mb-3 mt-auto flex flex-wrap items-center gap-2">
                      <span className="text-lg font-extrabold text-solar">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice > product.price && (
                        <del className="text-[11px] text-muted-foreground">
                          {formatPrice(product.oldPrice)}
                        </del>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-solar px-2 py-2.5 text-[11px] font-bold text-solar transition-colors hover:bg-solar hover:text-white sm:text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => bookProduct(product)}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-solar px-2 py-2.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90 sm:text-xs"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Enquire
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No products found in this category.
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav
            aria-label="Product pages"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              aria-label="Previous page"
              className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:border-solar disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg border text-xs font-bold transition-colors ${
                    currentPage === page
                      ? "border-solar bg-solar text-white"
                      : "border-border bg-card text-foreground hover:border-solar hover:text-solar"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              aria-label="Next page"
              className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition-colors hover:border-solar disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProduct(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-card shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-solar hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* MODAL IMAGE */}
              <div className="relative flex min-h-[230px] items-center justify-center bg-white p-6 sm:min-h-[350px]">
                <ProductImage
                  src={selectedProduct.image}
                  alt={`${selectedProduct.name} product image`}
                  className="h-full max-h-[330px] w-full"
                />

                <span className="absolute left-4 top-4 rounded-full bg-solar px-3 py-1.5 text-[10px] font-bold text-white">
                  {selectedProduct.badge}
                </span>
              </div>

              {/* MODAL DETAILS */}
              <div className="p-5 sm:p-7 md:p-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-solar">
                  {selectedProduct.category}
                </span>

                <h2
                  id="product-modal-title"
                  className="mt-2 pr-8 text-xl font-extrabold leading-snug text-foreground sm:text-2xl"
                >
                  {selectedProduct.name}
                </h2>

                {/* PRICE */}
                <div className="mb-4 mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-extrabold text-solar">
                    {formatPrice(selectedProduct.price)}
                  </span>

                  {selectedProduct.oldPrice > selectedProduct.price && (
                    <del className="text-sm text-muted-foreground">
                      {formatPrice(selectedProduct.oldPrice)}
                    </del>
                  )}
                </div>

                {/* DESCRIPTION */}
                <p className="mb-5 text-xs leading-6 text-muted-foreground sm:text-sm">
                  {selectedProduct.description}
                </p>

                {/* SPECIFICATIONS */}
                <h3 className="mb-3 text-sm font-bold text-foreground">
                  Product Specifications
                </h3>

                <div className="mb-5 grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Category",
                      value: selectedProduct.category,
                    },
                    {
                      label: "Capacity",
                      value: selectedProduct.power,
                    },
                    {
                      label: "Efficiency",
                      value: selectedProduct.efficiency,
                    },
                    {
                      label: "Warranty",
                      value: selectedProduct.warranty,
                    },
                  ].map((specification) => (
                    <div
                      key={specification.label}
                      className="rounded-lg bg-secondary/60 p-3"
                    >
                      <p className="mb-1 text-[10px] text-muted-foreground">
                        {specification.label}
                      </p>

                      <p className="text-xs font-bold text-foreground sm:text-sm">
                        {specification.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FEATURES */}
                <h3 className="mb-3 text-sm font-bold text-foreground">
                  Key Features
                </h3>

                <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selectedProduct.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-solar"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* ENQUIRY */}
                <button
                  type="button"
                  onClick={() => bookProduct(selectedProduct)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-solar px-4 py-3 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:text-sm"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Enquire About This Product
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[10px] leading-5 text-muted-foreground">
                  Contact our team for product availability, installation
                  details and final pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
