import { media } from "../../data/media";
import { useSceneView } from "../../three/bridge";
import { Picture } from "../media/Picture";

export function HeroVisual() {
  const SceneView = useSceneView();
  return (
    <div className="hero-visual absolute inset-0 overflow-hidden rounded-[1.75rem] md:rounded-l-[2rem] md:rounded-r-none">
      <Picture image={media.hero} priority className="h-full w-full object-cover" />
      {SceneView ? <SceneView kind="hero" className="pointer-events-none absolute inset-0" /> : null}
    </div>
  );
}
