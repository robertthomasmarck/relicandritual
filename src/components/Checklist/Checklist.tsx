import { useState, useEffect } from "react";
import ChecklistItem from "./ChecklistItem";

interface ChecklistProps {
  listId: string;
  items: Array<{ id: string; label: string; defaultChecked: boolean }>;
  authToken?: string;
}

interface CheckedState {
  [key: string]: boolean;
}

export default function Checklist({ listId, items, authToken }: ChecklistProps) {
  const [checkedState, setCheckedState] = useState<CheckedState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current state from Sanity on mount
    fetch(`/api/checklist?id=${encodeURIComponent(listId)}`)
      .then((res) => res.json())
      .then((data) => {
        const state: CheckedState = {};
        data.items?.forEach((item: { id: string; checked: boolean }) => {
          state[item.id] = item.checked;
        });
        setCheckedState(state);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listId]);

  if (loading) {
    return (
      <div className="animate-pulse text-gray-400 py-4">
        Loading checklist...
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <ChecklistItem
          key={item.id}
          id={item.id}
          label={item.label}
          initialChecked={checkedState[item.id] ?? item.defaultChecked}
          listId={listId}
          authToken={authToken}
        />
      ))}
    </ul>
  );
}
