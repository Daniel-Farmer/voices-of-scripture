import { HeroSection } from "@/components/landing/HeroSection";
import { CharacterGallery } from "@/components/landing/CharacterGallery";
import { SignOutButton } from "@/components/SignOutButton";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="absolute right-4 top-4 z-10">
        <SignOutButton />
      </div>
      <HeroSection />
      <CharacterGallery />
    </main>
  );
}
