import { AnimationData } from '@/utils/SpinerHelper';

declare global {
  interface Window {
    loadSpineAnimationData: (
      jsonUrl: string,
      atlasUrl: string,
      imageUrl: string,
    ) => Promise<AnimationData>;
  }
}
