import { useState } from "react";

interface ChecklistItemProps {
  id: string;
  label: string;
  initialChecked: boolean;
  listId: string;
  authToken?: string;
}

export default function ChecklistItem({
  id,
  label,
  initialChecked,
  listId,
  authToken,
}: ChecklistItemProps) {
  const [checked, setChecked] = useState(initialChecked);
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    const newValue = !checked;
    setChecked(newValue);
    setSaving(true);

    try {
      const response = await fetch("/api/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          identifier: listId,
          checkboxId: id,
          checked: newValue,
          label,
        }),
      });

      if (!response.ok) {
        // Revert on failure
        setChecked(!newValue);
        console.error("Failed to save checkbox state");
      }
    } catch (error) {
      setChecked(!newValue);
      console.error("Error saving checkbox:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="flex items-start gap-3 list-none my-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={saving}
        className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer accent-amber-600 disabled:opacity-50"
      />
      <span
        className={`${checked ? "line-through text-gray-400" : ""} ${saving ? "opacity-50" : ""}`}
      >
        {label}
      </span>
    </li>
  );
}
