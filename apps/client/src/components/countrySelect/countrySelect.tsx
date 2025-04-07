import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

const countries = [
  { code: "US", name: "United States" },
  { code: "BR", name: "Brazil" },
  { code: "DE", name: "Germany" },
];

export function CountrySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}