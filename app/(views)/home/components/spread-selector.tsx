import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

const spreads = [
  { value: "single_card", name: "Single Card", cards: 1 },
  { value: "three_card", name: "Three Card", cards: 3 },
  { value: "celtic_cross", name: "Celtic Cross", cards: 10 },
  //   "love",
  //   "career",
  //   "daily",
  //   "year_ahead",
  //   "birthday",
  //   "spiritual_guidance",
];

export function SpreadSelector({ onSpreadSelect, selectedSpread }) {
  const handleSpreadSelect = (spreadValue) => {
    const selectedSpread = spreads.find((spread) => spread.value === spreadValue);
    onSpreadSelect(selectedSpread);
  };
  return (
    <Select onValueChange={handleSpreadSelect} value={selectedSpread?.value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choose a spread" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Spreads</SelectLabel>
          {spreads.map((spread) => (
            <SelectItem value={spread.value}>{spread.name}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
