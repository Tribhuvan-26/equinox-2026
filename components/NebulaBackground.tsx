import { sanityAssets } from "@/lib/sanity-assets";
import { urlForImage } from "@/sanity/lib/image";

export default function NebulaBackground() {
  const bgUrl = sanityAssets["equinox_background.jpg"] 
    ? urlForImage(sanityAssets["equinox_background.jpg"]).url() 
    : "/equinox_background.jpg";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0A0A0C] pointer-events-none z-[-10]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
