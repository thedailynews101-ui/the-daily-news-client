"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateWidgetSetting, useWidgetSetting } from "@/hooks/widgets/use-widget-settings";
import type { MiddleWidget } from "@/types/widget";

export function ManageWidgetsView() {
  const { data, isLoading, isError, error } = useWidgetSetting();
  const updateMutation = useUpdateWidgetSetting();
  const [selection, setSelection] = React.useState<MiddleWidget>("QUOTE");

  React.useEffect(() => {
    if (data?.middleWidget) {
      setSelection(data.middleWidget);
    }
  }, [data?.middleWidget]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Manage Widgets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose which engagement widget appears between Weather and Games on the homepage.
          Weather and Games are always shown.
        </p>
      </div>

      {isLoading && <Skeleton className="h-48 w-full max-w-xl" />}

      {isError && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load widget settings."}
        </p>
      )}

      {data && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Homepage middle widget</CardTitle>
            <CardDescription>
              Currently: {data.middleWidget === "QUOTE" ? "Quotation" : "Public Opinion"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <label className="flex items-start gap-3 rounded-lg border border-border p-3">
              <input
                type="radio"
                name="middleWidget"
                checked={selection === "QUOTE"}
                onChange={() => setSelection("QUOTE")}
                disabled={updateMutation.isPending}
              />
              <span>
                <span className="block font-medium">Quotation</span>
                <span className="text-sm text-muted-foreground">
                  Show the active quote from Manage Quotes.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-border p-3">
              <input
                type="radio"
                name="middleWidget"
                checked={selection === "PUBLIC_OPINION"}
                onChange={() => setSelection("PUBLIC_OPINION")}
                disabled={updateMutation.isPending}
              />
              <span>
                <span className="block font-medium">Public Opinion</span>
                <span className="text-sm text-muted-foreground">
                  Show the active MCQ from Public Opinion.
                </span>
              </span>
            </label>
            <Button
              disabled={updateMutation.isPending || selection === data.middleWidget}
              onClick={() => updateMutation.mutate(selection)}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
