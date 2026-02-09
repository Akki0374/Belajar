"use client";

import { FilterBy_Date_SiteId } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-siteid";
import PageSiteInfo from "@/app/(project)/gefr/_component/gefr/ui-v4/site-info";
import { TwH3 } from "@/app/(project)/gefr/_component/typography/typography";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function Page() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-4">
      <TwH3 text="Site Info" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_SiteId />
      </div>
      <PageSiteInfo apiPath={"site-info"} aggregateBy="CELL_NAME" filterLabel="Cell Name" />
    </div>
  );
}
