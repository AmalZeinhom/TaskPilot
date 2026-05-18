// import { useState } from "react";

// export default function EditableText({ value, onSave }: any) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [tempValue, setTempValue] = useState(value);

//   return isEditing ? (
//     <input
//       autoFocus
//       value={tempValue}
//       onChange={(e) => setTempValue(e.target.value)}
//       onBlur={() => {
//         setIsEditing(false);

//         if (tempValue !== value) {
//           onSave(tempValue);
//         }
//       }}
//       onKeyDown={(e) => {
//         if (e.key === "Enter") {
//           (e.target as HTMLInputElement).blur();
//         }

//         if (e.key === "Escape") {
//           setTempValue(value);
//           setIsEditing(false);
//         }
//       }}
//       className="border px-2 py-1 rounded w-full"
//     />
//   ) : (
//     <h2 onClick={() => setIsEditing(true)} className="cursor-pointer">
//       {value}
//     </h2>
//   );
// }
import { useEffect, useState } from "react";

type EditableTextProps = {
  value: string;
  onSave: (value: string) => Promise<void>; // The function receive a parameter called value with string type. Promise means this is an async function. void because this function diesn't return a data, it is just for operation
  required?: boolean;
  loading?: boolean;
  className?: string;
  placeholder?: string;
};

export default function EditableText({
  value,
  onSave,
  required = false,
  loading = false,
  className = "",
  placeholder = "Enter Text"
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  //Sync local state with prop when the prop changes. Execute the code when the dependency(value) changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = async () => {
    const trimmedValue = tempValue.trim(); // trim() for removing spaces from only start & end.

    if (required && !trimmedValue) {
      setTempValue(value);
      setIsEditing(false);
      return;
    }

    //Prevent unnecessary calls
    if (trimmedValue === value) {
      setIsEditing(false);
      return;
    }

    await onSave(trimmedValue);

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        value={tempValue}
        disabled={loading}
        placeholder={placeholder}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }

          if (e.key === "Escape") {
            setTempValue(value);
            setIsEditing(false);
          }
        }}
        className={`border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-blue-500 disabled:opacity-50 ${className} `}
      />
    );
  }

  return (
    <div
      onClick={() => {
        if (!loading) {
          setIsEditing(true);
        }
      }}
      className={`cursor-pointer break-words ${loading ? "opacity-60 pointer-events-none" : ""} ${className}`}
    >
      {value || placeholder}
    </div>
  );
}
