export interface Paddle {
  brand: string;
  paddle_name: string;
  year_released: string;
  approval_body: string;
  shape: string;
  face_material: string;
  grit_type: string;
  build_style: string;
  paddle_type: string;
  core_thickness_mm: string;
  grip_length_in: string;
  grip_size_in: string;
  weight_oz: string;
  swingweight: string;
  twistweight: string;
  balance_point_mm: string;
  spin_rating: string;
  spin_rpm: string;
  power_mph: string;
  pop_mph: string;
}

export function num(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

export function formatStat(key: string, val: string): string {
  if (!val || val === "") return "—";
  switch (key) {
    case "weight_oz": return `${val} oz`;
    case "core_thickness_mm": return `${val} mm`;
    case "grip_length_in": return `${val}"`;
    case "grip_size_in": return `${val}"`;
    case "swingweight": return val;
    case "twistweight": return val;
    case "balance_point_mm": return `${val} mm`;
    case "spin_rpm": return `${val} RPM`;
    case "power_mph": return `${val} mph`;
    case "pop_mph": return `${val} mph`;
    default: return val;
  }
}

export const statLabels: Record<string, string> = {
  brand: "Brand",
  paddle_name: "Paddle",
  year_released: "Year",
  approval_body: "Approval",
  shape: "Shape",
  face_material: "Face Material",
  grit_type: "Grit Type",
  build_style: "Build Style",
  paddle_type: "Paddle Type",
  core_thickness_mm: "Core Thickness",
  grip_length_in: "Grip Length",
  grip_size_in: "Grip Size",
  weight_oz: "Weight",
  swingweight: "Swingweight",
  twistweight: "Twistweight",
  balance_point_mm: "Balance Point",
  spin_rating: "Spin Rating",
  spin_rpm: "Spin RPM",
  power_mph: "Power",
  pop_mph: "Pop",
};
