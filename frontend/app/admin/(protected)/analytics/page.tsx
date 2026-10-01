"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getLabs } from "@/services/lab.service";
import { getLabItems } from "@/services/lab-item.service";
import { getLabCategories } from "@/services/lab-category.service";

import { Lab } from "@/types/lab";
import { LabItem } from "@/types/lab-item";
import { LabCategory } from "@/types/lab-category";

/* -------------------------------------------------------------------------- */
/*  Settings                                                                  */
/* -------------------------------------------------------------------------- */

// Items at or below this quantity count as "low stock"
const LOW_STOCK_THRESHOLD = 5;

const rs = (value: number) => `Rs. ${Math.round(value).toLocaleString()}`;

type Tab = "overview" | "labs" | "items" | "categories";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "labs", label: "Labs" },
  { id: "items", label: "Lab items" },
  { id: "categories", label: "Categories" },
];

const stockConfig = {
  healthy: { label: "In stock", color: "#16a34a" },
  low: { label: "Low stock", color: "#f59e0b" },
  out: { label: "Out of stock", color: "#dc2626" },
} satisfies ChartConfig;

const priceBucketConfig = {
  items: { label: "Items", color: "#4f46e5" },
} satisfies ChartConfig;

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [items, setItems] = useState<LabItem[]>([]);
  const [categories, setCategories] = useState<LabCategory[]>([]);

  const [tab, setTab] = useState<Tab>("overview");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // silent = refresh in the background without the loading skeleton,
  // so the page updates in place when labs or items change.
  const loadData = useCallback(async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [labsResponse, itemsResponse, categoriesResponse] =
        await Promise.all([getLabs(), getLabItems(), getLabCategories()]);

      setLabs(labsResponse.labs || []);
      setItems(itemsResponse.labItems || []);
      setCategories(categoriesResponse.categories || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load analytics:", err);
      // A failed background refresh keeps the data already on screen.
      if (!silent) {
        setError(
          "We couldn't load your analytics. Check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load on mount, then keep numbers in sync with labs, items and
  // categories that were added, edited, or deleted on other pages.
  useEffect(() => {
    loadData();

    const refresh = () => loadData(true);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    const interval = window.setInterval(refresh, 30000);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, [loadData]);

  /* ------------------------------------------------------------------------ */
  /*  Derived data                                                            */
  /* ------------------------------------------------------------------------ */

  const data = useMemo(() => {
    const itemMap = new Map(items.map((item) => [item._id, item]));
    const categoryMap = new Map(categories.map((c) => [c._id, c]));

    const getCategoryId = (item: LabItem) =>
      typeof item.category === "string"
        ? item.category
        : item.category?._id || "";

    // How many labs include each item (only counts items that still exist)
    const usage = new Map<string, number>();

    const labRows = labs.map((lab) => {
      const ids = Array.isArray(lab.labItems)
        ? lab.labItems.map((entry) =>
            typeof entry === "string" ? entry : entry._id,
          )
        : [];
      const existing = ids.filter((id) => itemMap.has(id));

      existing.forEach((id) => usage.set(id, (usage.get(id) || 0) + 1));

      const itemsCost = existing.reduce(
        (sum, id) => sum + Number(itemMap.get(id)?.price || 0),
        0,
      );
      const price = Number(lab.price || 0);

      return {
        id: lab._id,
        title: lab.title,
        price,
        itemCount: existing.length,
        itemsCost,
        difference: price - itemsCost,
        hasImage: Boolean(lab.image),
      };
    });

    const itemRows = items.map((item) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const categoryId = getCategoryId(item);

      return {
        id: item._id,
        title: item.title,
        price,
        quantity,
        value: price * quantity,
        categoryId,
        categoryName: categoryMap.get(categoryId)?.name || "Uncategorized",
        labsUsing: usage.get(item._id) || 0,
        hasImage: Boolean(item.image),
        hasDescription: Boolean(item.description?.trim()),
        hasSpecification: Boolean(item.specification?.trim()),
      };
    });

    /* ---- Stock ---- */
    const outOfStock = itemRows.filter((i) => i.quantity === 0);
    const lowStock = itemRows
      .filter((i) => i.quantity > 0 && i.quantity <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.quantity - b.quantity);
    const healthy = itemRows.filter((i) => i.quantity > LOW_STOCK_THRESHOLD);

    const totalUnits = itemRows.reduce((sum, i) => sum + i.quantity, 0);
    const inventoryValue = itemRows.reduce((sum, i) => sum + i.value, 0);

    const stockStatus = [
      { status: "healthy", value: healthy.length, fill: "var(--color-healthy)" },
      { status: "low", value: lowStock.length, fill: "var(--color-low)" },
      { status: "out", value: outOfStock.length, fill: "var(--color-out)" },
    ];

    /* ---- Averages ---- */
    const avgLabPrice = labRows.length
      ? labRows.reduce((sum, l) => sum + l.price, 0) / labRows.length
      : 0;
    const avgItemPrice = itemRows.length
      ? itemRows.reduce((sum, i) => sum + i.price, 0) / itemRows.length
      : 0;
    const avgItemsPerLab = labRows.length
      ? labRows.reduce((sum, l) => sum + l.itemCount, 0) / labRows.length
      : 0;

    /* ---- Categories ---- */
    const categoryRows = categories.map((category) => {
      const inCategory = itemRows.filter((i) => i.categoryId === category._id);
      const units = inCategory.reduce((sum, i) => sum + i.quantity, 0);
      const value = inCategory.reduce((sum, i) => sum + i.value, 0);

      return {
        id: category._id,
        name: category.name,
        description: category.description || "",
        itemCount: inCategory.length,
        units,
        value,
        avgPrice: inCategory.length
          ? inCategory.reduce((sum, i) => sum + i.price, 0) / inCategory.length
          : 0,
      };
    });

    const uncategorized = itemRows.filter(
      (i) => !i.categoryId || !categoryMap.has(i.categoryId),
    );
    if (uncategorized.length > 0) {
      categoryRows.push({
        id: "uncategorized",
        name: "Uncategorized",
        description: "Items without a valid category",
        itemCount: uncategorized.length,
        units: uncategorized.reduce((sum, i) => sum + i.quantity, 0),
        value: uncategorized.reduce((sum, i) => sum + i.value, 0),
        avgPrice:
          uncategorized.reduce((sum, i) => sum + i.price, 0) /
          uncategorized.length,
      });
    }
    categoryRows.sort((a, b) => b.itemCount - a.itemCount);

    /* ---- Price ranges for items ---- */
    const maxItemPrice = Math.max(0, ...itemRows.map((i) => i.price));
    const bucketSize = Math.max(1, Math.ceil(maxItemPrice / 5 / 100) * 100);
    const priceBuckets = Array.from({ length: 5 }, (_, index) => {
      const min = index * bucketSize;
      const max = (index + 1) * bucketSize;
      return {
        range:
          index === 4 ? `${min.toLocaleString()}+` : `${min.toLocaleString()}–${max.toLocaleString()}`,
        items: itemRows.filter((i) =>
          index === 4 ? i.price >= min : i.price >= min && i.price < max,
        ).length,
      };
    });

    /* ---- Attention list ---- */
    const unusedItems = itemRows.filter((i) => i.labsUsing === 0);
    const labsWithoutItems = labRows.filter((l) => l.itemCount === 0);
    const emptyCategories = categoryRows.filter(
      (c) => c.id !== "uncategorized" && c.itemCount === 0,
    );
    const itemsMissingImage = itemRows.filter((i) => !i.hasImage);
    const labsMissingImage = labRows.filter((l) => !l.hasImage);
    const itemsMissingDetails = itemRows.filter(
      (i) => !i.hasDescription || !i.hasSpecification,
    );

    const attention = [
      {
        label: "Items out of stock",
        count: outOfStock.length,
        href: "/admin/lab-items",
        tone: "red" as const,
      },
      {
        label: `Items low on stock (${LOW_STOCK_THRESHOLD} or fewer)`,
        count: lowStock.length,
        href: "/admin/lab-items",
        tone: "amber" as const,
      },
      {
        label: "Items not used in any lab",
        count: unusedItems.length,
        href: "/admin/labs",
        tone: "slate" as const,
      },
      {
        label: "Labs with no items",
        count: labsWithoutItems.length,
        href: "/admin/labs",
        tone: "amber" as const,
      },
      {
        label: "Items without a category",
        count: uncategorized.length,
        href: "/admin/lab-items",
        tone: "amber" as const,
      },
      {
        label: "Categories with no items",
        count: emptyCategories.length,
        href: "/admin/lab-category",
        tone: "slate" as const,
      },
      {
        label: "Items missing description or specification",
        count: itemsMissingDetails.length,
        href: "/admin/lab-items",
        tone: "slate" as const,
      },
      {
        label: "Items without an image",
        count: itemsMissingImage.length,
        href: "/admin/lab-items",
        tone: "slate" as const,
      },
      {
        label: "Labs without an image",
        count: labsMissingImage.length,
        href: "/admin/labs",
        tone: "slate" as const,
      },
    ].filter((entry) => entry.count > 0);

    return {
      labRows,
      itemRows,
      categoryRows,
      outOfStock,
      lowStock,
      healthy,
      totalUnits,
      inventoryValue,
      stockStatus,
      avgLabPrice,
      avgItemPrice,
      avgItemsPerLab,
      priceBuckets,
      attention,
    };
  }, [labs, items, categories]);

  /* ---- Chart data (top N) ---- */
  const labPriceChart = useMemo(
    () =>
      [...data.labRows]
        .sort((a, b) => b.price - a.price)
        .slice(0, 8)
        .map((l) => ({ name: l.title, value: l.price })),
    [data.labRows],
  );

  const itemsPerLabChart = useMemo(
    () =>
      [...data.labRows]
        .sort((a, b) => b.itemCount - a.itemCount)
        .slice(0, 8)
        .map((l) => ({ name: l.title, value: l.itemCount })),
    [data.labRows],
  );

  const itemsByCategoryChart = useMemo(
    () =>
      data.categoryRows
        .filter((c) => c.itemCount > 0)
        .slice(0, 8)
        .map((c) => ({ name: c.name, value: c.itemCount })),
    [data.categoryRows],
  );

  const unitsByCategoryChart = useMemo(
    () =>
      [...data.categoryRows]
        .filter((c) => c.units > 0)
        .sort((a, b) => b.units - a.units)
        .slice(0, 8)
        .map((c) => ({ name: c.name, value: c.units })),
    [data.categoryRows],
  );

  const mostUsedChart = useMemo(
    () =>
      [...data.itemRows]
        .filter((i) => i.labsUsing > 0)
        .sort((a, b) => b.labsUsing - a.labsUsing)
        .slice(0, 8)
        .map((i) => ({ name: i.title, value: i.labsUsing })),
    [data.itemRows],
  );

  const valueByItemChart = useMemo(
    () =>
      [...data.itemRows]
        .filter((i) => i.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 8)
        .map((i) => ({ name: i.title, value: i.value })),
    [data.itemRows],
  );

  const stockByItemChart = useMemo(
    () =>
      [...data.itemRows]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 8)
        .map((i) => ({ name: i.title, value: i.quantity })),
    [data.itemRows],
  );

  /* ------------------------------------------------------------------------ */
  /*  Loading / error                                                         */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{error}</span>
          <button
            onClick={() => loadData()}
            className="shrink-0 font-medium underline underline-offset-2 hover:text-red-900"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*  Render                                                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Labs, lab items, categories, and stock in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={refreshing ? "animate-spin" : ""}
            >
              <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b"
        aria-label="Analytics sections"
      >
        {TABS.map((entry) => (
          <button
            key={entry.id}
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === entry.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {/* ==================== OVERVIEW ==================== */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Labs" value={String(labs.length)} />
            <StatCard label="Lab items" value={String(items.length)} />
            <StatCard label="Categories" value={String(categories.length)} />
            <StatCard
              label="Units in stock"
              value={data.totalUnits.toLocaleString()}
              hint="Total quantity across all items"
            />
            <StatCard
              label="Inventory value"
              value={rs(data.inventoryValue)}
              hint="Price × quantity across all items"
            />
            <StatCard
              label="Average lab price"
              value={rs(data.avgLabPrice)}
              hint={`${data.avgItemsPerLab.toFixed(1)} items per lab on average`}
            />
            <StatCard
              label="Average item price"
              value={rs(data.avgItemPrice)}
            />
            <StatCard
              label="Out of stock"
              value={String(data.outOfStock.length)}
              tone={data.outOfStock.length > 0 ? "red" : undefined}
              hint={`${data.lowStock.length} more running low`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock health</CardTitle>
                <CardDescription>
                  How your lab items are doing on stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <EmptyChart message="Add lab items to see stock health." />
                ) : (
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <ChartContainer
                      config={stockConfig}
                      className="h-56 w-56 shrink-0"
                    >
                      <PieChart>
                        <ChartTooltip
                          content={<ChartTooltipContent hideLabel nameKey="status" />}
                        />
                        <Pie
                          data={data.stockStatus}
                          dataKey="value"
                          nameKey="status"
                          innerRadius={60}
                          strokeWidth={3}
                        >
                          {data.stockStatus.map((entry) => (
                            <Cell key={entry.status} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    <ul className="w-full space-y-3 text-sm">
                      {data.stockStatus.map((entry) => {
                        const config =
                          stockConfig[entry.status as keyof typeof stockConfig];
                        return (
                          <li
                            key={entry.status}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="flex items-center gap-2 text-foreground">
                              <span
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: config.color }}
                              />
                              {config.label}
                            </span>
                            <span className="font-medium text-foreground">
                              {entry.value}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Needs attention</CardTitle>
                <CardDescription>
                  Things worth fixing or reviewing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.attention.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    Everything looks good. Nothing needs attention right now.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {data.attention.map((entry) => (
                      <li
                        key={entry.label}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <span className="flex items-center gap-3 text-sm text-foreground">
                          <CountBadge count={entry.count} tone={entry.tone} />
                          {entry.label}
                        </span>
                        <Link
                          href={entry.href}
                          className="shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Review
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Items by category"
              description="How many lab items belong to each category"
            >
              <HorizontalBars
                data={itemsByCategoryChart}
                label="Items"
                color="#4f46e5"
                emptyMessage="Add lab items to see them grouped by category."
              />
            </ChartCard>

            <ChartCard
              title="Most used items"
              description="Items included in the most labs"
            >
              <HorizontalBars
                data={mostUsedChart}
                label="Labs"
                color="#0d9488"
                emptyMessage="Add lab items to your labs to see which are used most."
              />
            </ChartCard>
          </div>
        </div>
      )}

      {/* ==================== LABS ==================== */}
      {tab === "labs" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total labs" value={String(labs.length)} />
            <StatCard
              label="Average lab price"
              value={rs(data.avgLabPrice)}
            />
            <StatCard
              label="Highest priced"
              value={
                data.labRows.length
                  ? rs(Math.max(...data.labRows.map((l) => l.price)))
                  : "–"
              }
            />
            <StatCard
              label="Lowest priced"
              value={
                data.labRows.length
                  ? rs(Math.min(...data.labRows.map((l) => l.price)))
                  : "–"
              }
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Lab prices"
              description="Your highest priced labs"
            >
              <HorizontalBars
                data={labPriceChart}
                label="Price (Rs.)"
                color="#4f46e5"
                emptyMessage="Add labs to compare their prices."
              />
            </ChartCard>

            <ChartCard
              title="Items per lab"
              description="Labs with the most lab items"
            >
              <HorizontalBars
                data={itemsPerLabChart}
                label="Items"
                color="#0d9488"
                emptyMessage="Add labs to see how many items each includes."
              />
            </ChartCard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All labs</CardTitle>
              <CardDescription>
                The difference compares each lab's price with the combined price
                of its items (one of each).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.labRows.length === 0 ? (
                <EmptyChart message="No labs yet." />
              ) : (
                <DataTable
                  headers={[
                    "Lab",
                    "Price",
                    "Items",
                    "Items total",
                    "Difference",
                  ]}
                  alignRightFrom={1}
                >
                  {[...data.labRows]
                    .sort((a, b) => b.price - a.price)
                    .map((lab) => (
                      <tr key={lab.id} className="border-t">
                        <td className="px-4 py-3 font-medium text-foreground">
                          <Link
                            href={`/admin/labs/edit/${lab.id}`}
                            className="hover:text-indigo-600"
                          >
                            {lab.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right">{rs(lab.price)}</td>
                        <td className="px-4 py-3 text-right">
                          {lab.itemCount === 0 ? (
                            <span className="text-amber-600">None</span>
                          ) : (
                            lab.itemCount
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {lab.itemCount === 0 ? "–" : rs(lab.itemsCost)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {lab.itemCount === 0 ? (
                            "–"
                          ) : lab.difference >= 0 ? (
                            <span className="text-green-700">
                              +{rs(lab.difference)}
                            </span>
                          ) : (
                            <span className="text-amber-700">
                              −{rs(Math.abs(lab.difference))}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </DataTable>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================== LAB ITEMS ==================== */}
      {tab === "items" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total lab items" value={String(items.length)} />
            <StatCard
              label="Units in stock"
              value={data.totalUnits.toLocaleString()}
            />
            <StatCard
              label="Inventory value"
              value={rs(data.inventoryValue)}
            />
            <StatCard
              label="Average item price"
              value={rs(data.avgItemPrice)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Stock by item"
              description="Items with the most units on hand"
            >
              <HorizontalBars
                data={stockByItemChart}
                label="Units"
                color="#4f46e5"
                emptyMessage="Add lab items to see stock levels."
              />
            </ChartCard>

            <ChartCard
              title="Inventory value by item"
              description="Price × quantity for your most valuable items"
            >
              <HorizontalBars
                data={valueByItemChart}
                label="Value (Rs.)"
                color="#0d9488"
                emptyMessage="Items with a price and stock will show up here."
              />
            </ChartCard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Price ranges</CardTitle>
              <CardDescription>
                How many items fall into each price range (Rs.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <EmptyChart message="Add lab items to see price ranges." />
              ) : (
                <ChartContainer
                  config={priceBucketConfig}
                  className="h-64 w-full"
                >
                  <BarChart data={data.priceBuckets}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="range"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis hide allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="items"
                      fill="var(--color-items)"
                      radius={6}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All lab items</CardTitle>
              <CardDescription>
                Sorted by inventory value. "Used in" shows how many labs include
                the item.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.itemRows.length === 0 ? (
                <EmptyChart message="No lab items yet." />
              ) : (
                <DataTable
                  headers={[
                    "Item",
                    "Category",
                    "Price",
                    "Quantity",
                    "Value",
                    "Used in",
                    "Status",
                  ]}
                  alignRightFrom={2}
                  lastLeft
                >
                  {[...data.itemRows]
                    .sort((a, b) => b.value - a.value)
                    .map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-3 font-medium text-foreground">
                          <Link
                            href={`/admin/lab-items/edit/${item.id}`}
                            className="hover:text-indigo-600"
                          >
                            {item.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-left text-muted-foreground">
                          {item.categoryName}
                        </td>
                        <td className="px-4 py-3 text-right">{rs(item.price)}</td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{rs(item.value)}</td>
                        <td className="px-4 py-3 text-right">
                          {item.labsUsing === 0 ? (
                            <span className="text-muted-foreground">
                              No labs
                            </span>
                          ) : (
                            `${item.labsUsing} ${item.labsUsing === 1 ? "lab" : "labs"}`
                          )}
                        </td>
                        <td className="px-4 py-3 text-left">
                          <StockBadge quantity={item.quantity} />
                        </td>
                      </tr>
                    ))}
                </DataTable>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================== CATEGORIES ==================== */}
      {tab === "categories" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Categories" value={String(categories.length)} />
            <StatCard
              label="Largest category"
              value={data.categoryRows[0]?.name || "–"}
              hint={
                data.categoryRows[0]
                  ? `${data.categoryRows[0].itemCount} items`
                  : undefined
              }
            />
            <StatCard
              label="Empty categories"
              value={String(
                data.categoryRows.filter(
                  (c) => c.id !== "uncategorized" && c.itemCount === 0,
                ).length,
              )}
            />
            <StatCard
              label="Uncategorized items"
              value={String(
                data.categoryRows.find((c) => c.id === "uncategorized")
                  ?.itemCount || 0,
              )}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Items by category"
              description="Number of lab items in each category"
            >
              <HorizontalBars
                data={itemsByCategoryChart}
                label="Items"
                color="#4f46e5"
                emptyMessage="Add lab items to see them grouped by category."
              />
            </ChartCard>

            <ChartCard
              title="Units in stock by category"
              description="Total quantity on hand per category"
            >
              <HorizontalBars
                data={unitsByCategoryChart}
                label="Units"
                color="#0d9488"
                emptyMessage="Stocked items will show up here."
              />
            </ChartCard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All categories</CardTitle>
              <CardDescription>
                Item counts, stock, and value for every category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.categoryRows.length === 0 ? (
                <EmptyChart message="No categories yet." />
              ) : (
                <DataTable
                  headers={[
                    "Category",
                    "Items",
                    "Units",
                    "Avg. price",
                    "Inventory value",
                  ]}
                  alignRightFrom={1}
                >
                  {data.categoryRows.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {category.id === "uncategorized" ? (
                            category.name
                          ) : (
                            <Link
                              href={`/admin/lab-category/edit/${category.id}`}
                              className="hover:text-indigo-600"
                            >
                              {category.name}
                            </Link>
                          )}
                        </p>
                        {category.description && (
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {category.itemCount === 0 ? (
                          <span className="text-amber-600">Empty</span>
                        ) : (
                          category.itemCount
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{category.units}</td>
                      <td className="px-4 py-3 text-right">
                        {category.itemCount === 0 ? "–" : rs(category.avgPrice)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {rs(category.value)}
                      </td>
                    </tr>
                  ))}
                </DataTable>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "red";
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle
          className={`truncate text-2xl lg:text-3xl ${
            tone === "red" ? "text-red-600" : ""
          }`}
        >
          {value}
        </CardTitle>
      </CardHeader>
      {hint && (
        <CardContent className="text-xs text-muted-foreground">
          {hint}
        </CardContent>
      )}
    </Card>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function HorizontalBars({
  data,
  label,
  color,
  emptyMessage,
}: {
  data: { name: string; value: number }[];
  label: string;
  color: string;
  emptyMessage: string;
}) {
  if (data.length === 0) return <EmptyChart message={emptyMessage} />;

  const config = { value: { label, color } } satisfies ChartConfig;

  return (
    <div style={{ height: Math.max(200, data.length * 44) }}>
      <ChartContainer config={config} className="h-full w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={110}
            fontSize={12}
            tickFormatter={(v: string) =>
              v.length > 14 ? `${v.slice(0, 13)}…` : v
            }
          />
          <XAxis type="number" hide allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-lg bg-muted/40 px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function DataTable({
  headers,
  alignRightFrom,
  lastLeft,
  children,
}: {
  headers: string[];
  alignRightFrom: number;
  lastLeft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            {headers.map((header, index) => {
              const isLast = index === headers.length - 1;
              const right =
                index >= alignRightFrom && !(lastLeft && isLast);
              return (
                <th
                  key={header}
                  className={`px-4 py-3 font-medium ${
                    right ? "text-right" : "text-left"
                  }`}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
        Out of stock
      </span>
    );
  }
  if (quantity <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
        {quantity} left
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
      In stock
    </span>
  );
}

function CountBadge({
  count,
  tone,
}: {
  count: number;
  tone: "red" | "amber" | "slate";
}) {
  const styles = {
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${styles[tone]}`}
    >
      {count}
    </span>
  );
}