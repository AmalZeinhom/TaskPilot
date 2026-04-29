import Select from "react-select";

type OptionType = {
  label: string;
  value: string | null;
};

type AppSelectProps = {
  options: OptionType[];
  value?: OptionType | null;
  onChange: (option: OptionType | null) => void;
  placeholder?: string;
  className?: string; // Affect the wrapper arround the selector component.
  controlBg?: string; // Affect the selector control bacground itself.
};

const getCustomStyles = (controlBg?: string) => ({
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: controlBg || "#fff",
    borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    borderRadius: "6px",
    padding: "2px"
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#3b82f6" : "transparent",
    color: state.isFocused ? "#fff" : "#0D1A63",
    cursor: "pointer"
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8"
  })
});

export default function Selector({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  controlBg
}: AppSelectProps) {
  return (
    <div className={className}>
      <Select
        options={options}
        value={value}
        onChange={(option) => onChange(option as OptionType | null)}
        placeholder={placeholder}
        styles={getCustomStyles(controlBg)}
      />
    </div>
  );
}
//options={options}, left side is a special prop from react-select, that means the library is wainting a prop called options.
//right side is a variable from our component, inside AppSelectProps. (Take the options which came from our component, and gitve it to the react-select library.
