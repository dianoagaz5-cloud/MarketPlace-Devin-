import type { Metadata } from "next";
import { AboutLanding } from "./about-landing";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Marketplace multi-vendeurs au Bénin : notre mission, notre vision, comment ça marche.",
};

export default function AboutPage() {
  return <AboutLanding />;
}
