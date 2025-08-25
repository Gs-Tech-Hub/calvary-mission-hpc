import { redirect } from "next/navigation";

export default function SermonsRedirectPage() {
  redirect("/dashboard/sermons");
}