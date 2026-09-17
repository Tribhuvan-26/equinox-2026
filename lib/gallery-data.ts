import { GridItem } from "@/components/DraggableGrid";

export interface GalleryPhoto extends GridItem {
  id: string;
  title: string;
  edition: string;
  category: "Pitch & Keynote" | "Hackathons" | "Expos & Bidding" | "Competitions" | "Moments & Gala";
  date: string;
  description: string;
  stats?: string;
  placeholderNumber: number;
}

export const GALLERY_CATEGORIES = [
  "All Moments",
  "Pitch & Keynote",
  "Hackathons",
  "Expos & Bidding",
  "Competitions",
  "Moments & Gala",
] as const;

// 12 customizable placeholder slots configured to look into /gallery/photo-{n}.jpg
export const PREVIOUS_EVENT_PHOTOS: GalleryPhoto[] = [
  {
    id: "gallery-photo-1",
    placeholderNumber: 1,
    title: "Event Highlight 01",
    edition: "Equinox Archive",
    category: "Pitch & Keynote",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-1.jpg to showcase this moment.",
    stats: "Pitch Finale",
    image: {
      src: "/gallery/photo-1.jpg",
      alt: "Event Photo 1 Placeholder",
    },
  },
  {
    id: "gallery-photo-2",
    placeholderNumber: 2,
    title: "Event Highlight 02",
    edition: "Equinox Archive",
    category: "Hackathons",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-2.jpg to showcase this moment.",
    stats: "Hackathon Sprint",
    image: {
      src: "/gallery/photo-2.jpg",
      alt: "Event Photo 2 Placeholder",
    },
  },
  {
    id: "gallery-photo-3",
    placeholderNumber: 3,
    title: "Event Highlight 03",
    edition: "Equinox Archive",
    category: "Expos & Bidding",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-3.jpg to showcase this moment.",
    stats: "Auction Arena",
    image: {
      src: "/gallery/photo-3.jpg",
      alt: "Event Photo 3 Placeholder",
    },
  },
  {
    id: "gallery-photo-4",
    placeholderNumber: 4,
    title: "Event Highlight 04",
    edition: "Equinox Archive",
    category: "Expos & Bidding",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-4.jpg to showcase this moment.",
    stats: "Startup Expo",
    image: {
      src: "/gallery/photo-4.jpg",
      alt: "Event Photo 4 Placeholder",
    },
  },
  {
    id: "gallery-photo-5",
    placeholderNumber: 5,
    title: "Event Highlight 05",
    edition: "Equinox Archive",
    category: "Competitions",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-5.jpg to showcase this moment.",
    stats: "Case Strategy",
    image: {
      src: "/gallery/photo-5.jpg",
      alt: "Event Photo 5 Placeholder",
    },
  },
  {
    id: "gallery-photo-6",
    placeholderNumber: 6,
    title: "Event Highlight 06",
    edition: "Equinox Archive",
    category: "Competitions",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-6.jpg to showcase this moment.",
    stats: "Brand Battles",
    image: {
      src: "/gallery/photo-6.jpg",
      alt: "Event Photo 6 Placeholder",
    },
  },
  {
    id: "gallery-photo-7",
    placeholderNumber: 7,
    title: "Event Highlight 07",
    edition: "Equinox Archive",
    category: "Moments & Gala",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-7.jpg to showcase this moment.",
    stats: "E-Cell Conclave",
    image: {
      src: "/gallery/photo-7.jpg",
      alt: "Event Photo 7 Placeholder",
    },
  },
  {
    id: "gallery-photo-8",
    placeholderNumber: 8,
    title: "Event Highlight 08",
    edition: "Equinox Archive",
    category: "Moments & Gala",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-8.jpg to showcase this moment.",
    stats: "Awards Gala",
    image: {
      src: "/gallery/photo-8.jpg",
      alt: "Event Photo 8 Placeholder",
    },
  },
  {
    id: "gallery-photo-9",
    placeholderNumber: 9,
    title: "Event Highlight 09",
    edition: "Equinox Archive",
    category: "Pitch & Keynote",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-9.jpg to showcase this moment.",
    stats: "Keynote Hall",
    image: {
      src: "/gallery/photo-9.jpg",
      alt: "Event Photo 9 Placeholder",
    },
  },
  {
    id: "gallery-photo-10",
    placeholderNumber: 10,
    title: "Event Highlight 10",
    edition: "Equinox Archive",
    category: "Hackathons",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-10.jpg to showcase this moment.",
    stats: "Midnight Code Jam",
    image: {
      src: "/gallery/photo-10.jpg",
      alt: "Event Photo 10 Placeholder",
    },
  },
  {
    id: "gallery-photo-11",
    placeholderNumber: 11,
    title: "Event Highlight 11",
    edition: "Equinox Archive",
    category: "Moments & Gala",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-11.jpg to showcase this moment.",
    stats: "Trophy Celebration",
    image: {
      src: "/gallery/photo-11.jpg",
      alt: "Event Photo 11 Placeholder",
    },
  },
  {
    id: "gallery-photo-12",
    placeholderNumber: 12,
    title: "Event Highlight 12",
    edition: "Equinox Archive",
    category: "Pitch & Keynote",
    date: "Previous Edition",
    description: "Upload your event photo to public/gallery/photo-12.jpg to showcase this moment.",
    stats: "Founder Mentorship",
    image: {
      src: "/gallery/photo-12.jpg",
      alt: "Event Photo 12 Placeholder",
    },
  },
];
