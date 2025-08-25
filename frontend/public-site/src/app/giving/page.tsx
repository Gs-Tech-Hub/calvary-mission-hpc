import { redirect } from "next/navigation";

export default function GivingRedirectPage() {
  redirect("/dashboard/giving");
}