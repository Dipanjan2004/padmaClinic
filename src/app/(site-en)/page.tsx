import { getPublicSiteData } from "@/features/website-content/queries";
import { HomePage, homeMetadata } from "@/features/website/HomePage";

export async function generateMetadata() {
  return homeMetadata("en", await getPublicSiteData());
}

export default function Page() {
  return <HomePage lang="en" />;
}
