import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function PracticeV2Page() { redirect("/?view=practice"); }
