import * as React from "react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "./utils";

const SelectContext = React.createContext({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  selectedLabel: "",
  setSelectedLabel: () => {},
});

function Select({ value = "", onValueChange = () => {}, children }) {
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState("");
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (value === "") setSelectedLabel("");
  }, [value]);

  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, selectedLabel, setSelectedLabel }}>
      <div ref={ref} className="relative shrink-0">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, size: _size, ...props }) {
  const { open, setOpen } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9",
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { value, selectedLabel } = React.useContext(SelectContext);
  return <span>{selectedLabel || value || placeholder || ""}</span>;
}

function SelectContent({ className, children }) {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-full w-max bg-popover text-popover-foreground border shadow-md overflow-auto max-h-60",
        className,
      )}
    >
      <div className="p-1">{children}</div>
    </div>
  );
}

function SelectItem({ className, children, value, ...props }) {
  const { value: selectedValue, onValueChange, setOpen, setSelectedLabel } = React.useContext(SelectContext);
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none select-none",
        selectedValue === value && "font-semibold",
        className,
      )}
      onMouseDown={(e) => {
        e.preventDefault();
        onValueChange(value);
        setSelectedLabel(value === "" ? "" : String(children));
        setOpen(false);
      }}
      {...props}
    >
      {selectedValue === value && (
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
