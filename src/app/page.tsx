import CinematicDesign from "@/designs/cinematic";

// "/" always serves the default design (see DEFAULT_DESIGN in src/designs/registry.ts).
// Other designs live at /designs/<slug>/.
export default function Home() {
  return <CinematicDesign />;
}
