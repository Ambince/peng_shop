export interface AnimationData {
  x: number;
  y: number;
  height: number;
  width: number;
  animations: string[];
}

export async function loadSpineAnimationData(
  jsonUrl: string,
  atlasUrl: string,
  imageUrl: string,
): Promise<AnimationData | undefined> {
  const result = await window.loadSpineAnimationData(
    jsonUrl,
    atlasUrl,
    imageUrl,
  );
  console.log('animation data', result);
  return result;
}
