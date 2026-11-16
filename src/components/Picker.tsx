import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PickerProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

// A row of chips under a stage for choosing what it replays. One option is always selected.
const Picker = ({ label, options, value, onChange }: PickerProps) => (
  <ToggleGroup
    type="single"
    value={value}
    onValueChange={(next) => next && onChange(next)}
    aria-label={label}
    className="flex-wrap justify-start gap-2 border-t p-3 font-mono text-xs"
  >
    <span className="mr-1 text-faint">{label}</span>
    {options.map((option) => (
      <ToggleGroupItem
        key={option.value}
        value={option.value}
        className="h-9 rounded-md border px-2.5 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:border-primary/60 data-[state=on]:bg-secondary data-[state=on]:text-foreground"
      >
        {option.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

export default Picker;
