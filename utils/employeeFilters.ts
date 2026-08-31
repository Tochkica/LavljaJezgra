import type { Employee } from "@/hooks/useEmployees";

export type EmployeeFilterType = "position" | "team" | "arrival";

const FIELD_BY_FILTER_TYPE: Record<EmployeeFilterType, keyof Employee> = {
  position: "position",
  team: "team",
  arrival: "startDate",
};

export interface FilterOption {
  value: string;
  count: number;
}

export function getFilterOptions(employees: Employee[], filterType: EmployeeFilterType): FilterOption[] {
  const field = FIELD_BY_FILTER_TYPE[filterType];
  const counts = new Map<string, number>();

  employees.forEach((e) => {
    const value = e[field];
    if (!value) return;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => (a.value < b.value ? -1 : 1));
}
