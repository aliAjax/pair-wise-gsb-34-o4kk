import { HazardSeverityText } from "../../constants/HazardSeverity";

export function HazardSeverityTag({ value }: { value: string }) {
  return (
    <span className={"badge severity-" + String(value).toLowerCase()}>
      {HazardSeverityText[value as keyof typeof HazardSeverityText] ?? value}
    </span>
  );
}
