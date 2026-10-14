"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateEventGroup,
  useCreateEventItem,
  useDeleteEventGroup,
  useDeleteEventItem,
  useUpdateEventGroup,
  useUpdateEventItem,
} from "@/hooks/events/use-event-mutations";
import { useEventGroups } from "@/hooks/events/use-events";
import {
  eventGroupFormSchema,
  eventItemFormSchema,
  type EventGroupFormValues,
  type EventItemFormValues,
} from "@/schemas/event.schema";
import type { EventGroup, EventItem } from "@/types/event";

type ManageEventsViewProps = {
  /** When embedded under Homepage curator, use a shorter heading. */
  embedded?: boolean;
};

function GroupForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: EventGroupFormValues;
  submitLabel: string;
  pending: boolean;
  onSubmit: (values: EventGroupFormValues) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = React.useState(initial);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setValues(initial);
    setError(null);
  }, [initial]);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = eventGroupFormSchema.safeParse(values);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Invalid group");
          return;
        }
        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="group-title">Main title</Label>
          <Input
            id="group-title"
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Competitions"
            disabled={pending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="group-position">Position</Label>
          <Input
            id="group-position"
            value={values.position ?? ""}
            onChange={(e) => setValues((prev) => ({ ...prev, position: e.target.value }))}
            placeholder="0"
            disabled={pending}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function ItemForm({
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: {
  initial: EventItemFormValues;
  submitLabel: string;
  pending: boolean;
  onSubmit: (values: EventItemFormValues) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = React.useState(initial);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setValues(initial);
    setError(null);
  }, [initial]);

  return (
    <form
      className="flex flex-col gap-3 rounded-md border border-border p-3"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = eventItemFormSchema.safeParse(values);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? "Invalid event");
          return;
        }
        setError(null);
        onSubmit(parsed.data);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Event title</Label>
          <Input
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Ted Talk"
            disabled={pending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Link</Label>
          <Input
            value={values.url}
            onChange={(e) => setValues((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com"
            disabled={pending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Position</Label>
          <Input
            value={values.position ?? ""}
            onChange={(e) => setValues((prev) => ({ ...prev, position: e.target.value }))}
            placeholder="0"
            disabled={pending}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="outline" disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function EventItemRow({ item }: { item: EventItem }) {
  const [editing, setEditing] = React.useState(false);
  const updateMutation = useUpdateEventItem();
  const deleteMutation = useDeleteEventItem();
  const busy = updateMutation.isPending || deleteMutation.isPending;

  if (editing) {
    return (
      <ItemForm
        initial={{
          title: item.title,
          url: item.url,
          position: String(item.position),
        }}
        submitLabel="Update event"
        pending={updateMutation.isPending}
        onCancel={() => setEditing(false)}
        onSubmit={(values) => {
          updateMutation.mutate(
            {
              id: item.id,
              payload: {
                title: values.title,
                url: values.url,
                ...(values.position?.trim() ? { position: Number(values.position) } : {}),
              },
            },
            { onSuccess: () => setEditing(false) }
          );
        }}
      />
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium">{item.title}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          {item.url}
        </a>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={busy}
          onClick={() => {
            if (window.confirm(`Delete "${item.title}"?`)) {
              deleteMutation.mutate(item.id);
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function EventGroupCard({ group }: { group: EventGroup }) {
  const [editing, setEditing] = React.useState(false);
  const [addingItem, setAddingItem] = React.useState(false);
  const updateMutation = useUpdateEventGroup();
  const deleteMutation = useDeleteEventGroup();
  const createItemMutation = useCreateEventItem();
  const busy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card>
      <CardHeader className="gap-2">
        {editing ? (
          <GroupForm
            initial={{ title: group.title, position: String(group.position) }}
            submitLabel="Update title"
            pending={updateMutation.isPending}
            onCancel={() => setEditing(false)}
            onSubmit={(values) => {
              updateMutation.mutate(
                {
                  id: group.id,
                  payload: {
                    title: values.title,
                    ...(values.position?.trim() ? { position: Number(values.position) } : {}),
                  },
                },
                { onSuccess: () => setEditing(false) }
              );
            }}
          />
        ) : (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{group.title}</CardTitle>
              <CardDescription className="mt-1">
                {group.items.length} event{group.items.length === 1 ? "" : "s"} · position{" "}
                {group.position}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing(true)}>
                Edit title
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete "${group.title}" and all of its events? This cannot be undone.`
                    )
                  ) {
                    deleteMutation.mutate(group.id);
                  }
                }}
              >
                Delete group
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {group.items.map((item) => (
          <EventItemRow key={item.id} item={item} />
        ))}

        {addingItem ? (
          <ItemForm
            initial={{ title: "", url: "https://", position: "0" }}
            submitLabel="Add event"
            pending={createItemMutation.isPending}
            onCancel={() => setAddingItem(false)}
            onSubmit={(values) => {
              createItemMutation.mutate(
                {
                  groupId: group.id,
                  payload: {
                    title: values.title,
                    url: values.url,
                    ...(values.position?.trim() ? { position: Number(values.position) } : {}),
                  },
                },
                { onSuccess: () => setAddingItem(false) }
              );
            }}
          />
        ) : (
          <Button size="sm" variant="outline" onClick={() => setAddingItem(true)}>
            Add event under this title
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ManageEventsView({ embedded = false }: ManageEventsViewProps) {
  const { data: groups = [], isLoading, isError } = useEventGroups();
  const createGroupMutation = useCreateEventGroup();
  const [createKey, setCreateKey] = React.useState(0);

  return (
    <div className="flex flex-col gap-6">
      {!embedded && (
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Manage Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create main titles and linked events for the homepage Fixed News column.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{embedded ? "Fixed News — events" : "New main title"}</CardTitle>
          <CardDescription>
            {embedded
              ? "Add or remove event groups and linked items. Article pinning is not available here."
              : "Each title (e.g. Competitions) can hold multiple linked events."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GroupForm
            key={createKey}
            initial={{ title: "", position: "0" }}
            submitLabel="Create title"
            pending={createGroupMutation.isPending}
            onSubmit={(values) => {
              createGroupMutation.mutate(
                {
                  title: values.title,
                  ...(values.position?.trim() ? { position: Number(values.position) } : {}),
                },
                { onSuccess: () => setCreateKey((key) => key + 1) }
              );
            }}
          />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-6 text-sm text-destructive">
            Could not load events. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && groups.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No event groups yet</CardTitle>
            <CardDescription>Create a main title to start adding linked events.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <EventGroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
