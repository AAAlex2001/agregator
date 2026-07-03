type Palette = { fill: string; fold: string };

const PALETTES: Record<string, Palette> = {
  pdf: { fill: "#E5482F", fold: "#B4321F" },
  doc: { fill: "#2B7CD3", fold: "#1F5DA0" },
  xls: { fill: "#1E9E5A", fold: "#157543" },
  img: { fill: "#8257E5", fold: "#5E3DB3" },
  zip: { fill: "#EF9C1B", fold: "#C87A0A" },
  file: { fill: "#7A869A", fold: "#5A6474" },
};

function fileExt(nameOrUrl: string): string {
  const clean = nameOrUrl.split("?")[0].split("#")[0];
  const tail = clean.split(".").pop() ?? "";
  return tail.toLowerCase();
}

function paletteKey(ext: string): keyof typeof PALETTES {
  if (ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx") return "doc";
  if (ext === "xls" || ext === "xlsx") return "xls";
  if (ext === "jpg" || ext === "jpeg" || ext === "png") return "img";
  if (ext === "zip" || ext === "rar" || ext === "7z") return "zip";
  return "file";
}

export function FileTypeIcon({ name, className }: { name: string; className?: string }) {
  const ext = fileExt(name);
  const palette = PALETTES[paletteKey(ext)];
  const label = (ext || "file").toUpperCase().slice(0, 4);
  return (
    <svg viewBox="0 0 40 48" width={40} height={48} className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 7a4 4 0 0 1 4-4h16l9 9v29a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z"
        fill={palette.fill}
      />
      <path d="M26 3l9 9h-6a3 3 0 0 1-3-3z" fill={palette.fold} />
      <text
        x="20"
        y="34"
        textAnchor="middle"
        fontFamily="Montserrat"
        fontWeight="800"
        fontSize="9"
        letterSpacing="0.3"
        fill="#ffffff"
      >
        {label}
      </text>
    </svg>
  );
}
