import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, spring, useVideoConfig } from 'remotion';

interface Scene {
  id: string;
  text: string;
  duration: number;
  fontSize: number;
  color: string;
  backgroundColor: string;
  transition: 'fade' | 'slide' | 'zoom';
}

interface TextVideoProps {
  scenes: Scene[];
}

const TextScene: React.FC<{ scene: Scene; startFrame: number }> = ({ scene, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;

  const opacity = interpolate(relativeFrame, [0, 15, scene.duration - 15, scene.duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = scene.transition === 'zoom'
    ? spring({
        fps,
        frame: relativeFrame,
        config: { damping: 100, stiffness: 200, mass: 0.5 },
        durationInFrames: scene.duration,
      })
    : 1;

  const translateY = scene.transition === 'slide'
    ? interpolate(relativeFrame, [0, scene.duration], [50, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          opacity,
          fontSize: `${scene.fontSize}px`,
          color: scene.color,
          textAlign: 'center',
          maxWidth: '80%',
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        {scene.text}
      </h1>
    </AbsoluteFill>
  );
};

export const TextVideo: React.FC<TextVideoProps> = ({ scenes }) => {
  let currentFrame = 0;
  return (
    <AbsoluteFill>
      {scenes.map((scene) => {
        const startFrame = currentFrame;
        currentFrame += scene.duration;
        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={scene.duration}>
            <TextScene scene={scene} startFrame={startFrame} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};