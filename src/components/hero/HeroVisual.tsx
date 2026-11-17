import { loops, media } from "../../data/media";
import { LoopVideo } from "../media/LoopVideo";
import { Picture } from "../media/Picture";

export function HeroVisual() {
  return (
    <div className="hero-visual absolute inset-0 overflow-hidden rounded-[1.75rem] md:rounded-l-[2rem] md:rounded-r-none">
      <Picture image={media.hero} priority className="h-full w-full object-cover" />
      <LoopVideo loop={loops.hero} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
