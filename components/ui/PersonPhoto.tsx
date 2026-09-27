import Image from "next/image";
import type { Person } from "@/content/team";

/** A team portrait at 4:5, or the person's initials on ink when no photo has been supplied yet. */
export function PersonPhoto({ person, sizes, className = "" }: { person: Person; sizes: string; className?: string }) {
  const words = person.name.split(" ");
  const initials = `${words[0][0]}${words.length > 1 ? words[words.length - 1][0] : ""}`;

  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-ink ${className}`}>
      {person.photo ? (
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out-expo hover:scale-[1.03]"
        />
      ) : (
        <span aria-hidden className="absolute bottom-4 left-4 text-[42px] font-medium tracking-[-0.03em] text-stone">
          {initials}
        </span>
      )}
    </div>
  );
}
