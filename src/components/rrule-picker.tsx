import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Toggle } from "./ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Frequency = "DAILY" | "WEEKLY";

const DAYS_OF_WEEK = [
  { value: "MO", label: "M" },
  { value: "TU", label: "T" },
  { value: "WE", label: "W" },
  { value: "TH", label: "T" },
  { value: "FR", label: "F" },
  { value: "SA", label: "S" },
  { value: "SU", label: "S" },
] as const;

interface RRulePickerProps {
  value: string;
  onChange: (rrule: string) => void;
}

function parseRRule(rrule: string): { frequency: Frequency; days: string[] } {
  const freqMatch = rrule.match(/FREQ=(\w+)/);
  const frequency = (freqMatch?.[1] as Frequency) || "DAILY";

  const daysMatch = rrule.match(/BYDAY=([A-Z,]+)/);
  const days = daysMatch ? daysMatch[1].split(",") : [];

  return { frequency, days };
}

function buildRRule(frequency: Frequency, days: string[]): string {
  if (frequency === "WEEKLY" && days.length > 0) {
    return `FREQ=WEEKLY;BYDAY=${days.join(",")}`;
  }
  return `FREQ=${frequency}`;
}

export function RRulePicker({ value, onChange }: RRulePickerProps) {
  const parsed = parseRRule(value);
  const [frequency, setFrequency] = useState<Frequency>(parsed.frequency);
  const [selectedDays, setSelectedDays] = useState<string[]>(parsed.days);

  useEffect(() => {
    const newRRule = buildRRule(frequency, frequency === "WEEKLY" ? selectedDays : []);
    if (newRRule !== value) {
      onChange(newRRule);
    }
  }, [frequency, selectedDays, onChange, value]);

  const handleFrequencyChange = (newFreq: Frequency | null) => {
    if (!newFreq) return;
    setFrequency(newFreq);

    // Set default days when switching to weekly
    if (newFreq === "WEEKLY" && selectedDays.length === 0) {
      setSelectedDays(["MO", "TU", "WE", "TH", "FR"]);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        // Don't allow deselecting if it's the last day
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Frequency</Label>
        <Select value={frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frequency === "WEEKLY" && (
        <div className="flex flex-col gap-2">
          <Label>Days</Label>
          <div className="flex gap-1">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day.value);
              return (
                <Toggle
                  key={day.value}
                  variant="outline"
                  pressed={isSelected}
                  onPressedChange={() => toggleDay(day.value)}
                >
                  {day.label}
                </Toggle>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
