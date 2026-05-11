import { Calendar1Icon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerProps = {
  selectedDate: Date | null;
  onDateChange(date: Date | null): void;
  className?: string;
  inputClassName?: string;
};

export default function CustomDatePicker({
  selectedDate,
  onDateChange,
  className = "",
  inputClassName = ""
}: DatePickerProps) {
  return (
    <div
      className={`relative w-full focus-within:ring-2
        focus-within:ring-blue-500
        transition ${className}`}
    >
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        minDate={new Date()}
        placeholderText="Pick a Date"
        className={`w-full h-11 rounded-md outline-none bg-transparent ${inputClassName}`}
      />

      <Calendar1Icon
        size={20}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  );
}
