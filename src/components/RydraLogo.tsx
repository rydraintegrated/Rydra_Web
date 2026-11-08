import Image from "next/image";

export function RydraLogo({
  size = "md",
  variant = "auto",
  full = true,
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light" | "auto";
  full?: boolean;
  className?: string;
}) {
  const fullDims = {
    sm: { width: 110, height: 29 },
    md: { width: 136, height: 36 },
    lg: { width: 164, height: 43 },
    xl: { width: 200, height: 53 },
  };

  const markDims = {
    sm: { width: 42, height: 32 },
    md: { width: 54, height: 40 },
    lg: { width: 72, height: 54 },
    xl: { width: 90, height: 67 },
  };

  if (full) {
    const dim = fullDims[size] || fullDims.md;
    const src = variant === "light" ? "/logo.png" : "/logo-white.png";
    return (
      <Image
        src={src}
        alt="Rydra"
        width={dim.width}
        height={dim.height}
        className={`object-contain ${className}`}
        priority
      />
    );
  }

  const dim = markDims[size] || markDims.md;
  const src = variant === "light" ? "/ry-logo.png" : "/ry-logo-white.png";
  return (
    <Image
      src={src}
      alt="Rydra"
      width={dim.width}
      height={dim.height}
      className={`object-contain ${className}`}
      priority
    />
  );
}

