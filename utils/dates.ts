function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseParts(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
}

export function formatDate(dateStr: string): string {
  const { year, month, day } = parseParts(dateStr);
  return `${pad(day)}.${pad(month)}.${year}.`;
}

export function formatBirthday(dateStr: string): string {
  const { month, day } = parseParts(dateStr);
  return `${pad(day)}.${pad(month)}.`;
}

export function yearsAtCompany(startDateStr: string): number {
  const { year, month, day } = parseParts(startDateStr);
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  let years = today.getFullYear() - year;
  if (todayMonth < month || (todayMonth === month && todayDay < day)) {
    years -= 1;
  }
  return years;
}

function nextAnniversaryDate(dateStr: string): Date {
  const { month, day } = parseParts(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let anniversary = new Date(today.getFullYear(), month - 1, day);
  anniversary.setHours(0, 0, 0, 0);
  if (anniversary < today) {
    anniversary = new Date(today.getFullYear() + 1, month - 1, day);
  }
  return anniversary;
}

export function daysUntilAnniversary(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const anniversary = nextAnniversaryDate(dateStr);
  return Math.round((anniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isAnniversaryThisMonthOrSoon(dateStr: string, lookaheadDays = 10): boolean {
  const { month, day } = parseParts(dateStr);
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  if (month === todayMonth && day >= todayDay) return true;
  return daysUntilAnniversary(dateStr) <= lookaheadDays;
}

export function upcomingAnniversaryMilestone(startDateStr: string): number {
  const { year } = parseParts(startDateStr);
  const anniversary = nextAnniversaryDate(startDateStr);
  return anniversary.getFullYear() - year;
}
