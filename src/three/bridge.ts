import { useSyncExternalStore, type ComponentType } from "react";

export type SceneViewProps = {
  kind: string;
  className?: string;
};

let current: ComponentType<SceneViewProps> | null = null;
const listeners = new Set<() => void>();

export function setSceneView(component: ComponentType<SceneViewProps> | null) {
  current = component;
  listeners.forEach((listener) => listener());
}

export function useSceneView() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => null,
  );
}

const kinds: Record<string, string> = {
  "CODE-ZAX/applix": "applix",
  "CODE-ZAX/electron-bill-calculator": "bill",
  "CODE-ZAX/proposal-extenstion-backend": "proposal",
  "CODE-ZAX/flutter_youtube_ext": "youtube",
  "CODE-ZAX/J.A.R.V.I.S": "jarvis",
  "CODE-ZAX/x-clipboard-manager": "xclipy",
  "CODE-ZAX/file-organizer": "tidydesk",
  "CODE-ZAX/ai-interviewee": "interviewee",
  "CODE-ZAX/live_subtitles": "subtitles",
  "CODE-ZAX/insiders": "insiders",
  "CODE-ZAX/chatli": "chatli",
};

export function sceneKindForRepo(repo: string) {
  return kinds[repo] ?? null;
}
