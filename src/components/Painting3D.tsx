import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Mesh, SRGBColorSpace } from "three";

interface Painting3DProps {
  imageUrl: string;
  position?: [number, number, number];
  autoRotate?: boolean;
  scale?: number;
  onClick?: () => void;
}

/**
 * Auto-generated 3D framed canvas from a painting image.
 * Wooden frame + canvas thickness, image mapped on the front face.
 */
const Painting3D = ({
  imageUrl,
  position = [0, 0, 0],
  autoRotate = false,
  scale = 1,
  onClick,
}: Painting3DProps) => {
  const groupRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, imageUrl);

  useMemo(() => {
    if (texture) texture.colorSpace = SRGBColorSpace;
  }, [texture]);

  // Compute aspect from image
  const aspect = useMemo(() => {
    if (texture?.image) return texture.image.width / texture.image.height;
    return 1;
  }, [texture]);

  const w = aspect >= 1 ? 1.6 : 1.6 * aspect;
  const h = aspect >= 1 ? 1.6 / aspect : 1.6;
  const depth = 0.08;
  const frame = 0.08;

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group position={position} scale={scale} onClick={onClick}>
      <mesh ref={groupRef as never}>
        {/* Frame (wooden border) */}
        <mesh position={[0, h / 2 + frame / 2, 0]}>
          <boxGeometry args={[w + frame * 2, frame, depth + 0.02]} />
          <meshStandardMaterial color="#3a2817" roughness={0.7} />
        </mesh>
        <mesh position={[0, -h / 2 - frame / 2, 0]}>
          <boxGeometry args={[w + frame * 2, frame, depth + 0.02]} />
          <meshStandardMaterial color="#3a2817" roughness={0.7} />
        </mesh>
        <mesh position={[-w / 2 - frame / 2, 0, 0]}>
          <boxGeometry args={[frame, h, depth + 0.02]} />
          <meshStandardMaterial color="#3a2817" roughness={0.7} />
        </mesh>
        <mesh position={[w / 2 + frame / 2, 0, 0]}>
          <boxGeometry args={[frame, h, depth + 0.02]} />
          <meshStandardMaterial color="#3a2817" roughness={0.7} />
        </mesh>

        {/* Canvas back */}
        <mesh position={[0, 0, -depth / 2]}>
          <boxGeometry args={[w, h, depth]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>

        {/* Painting front face */}
        <mesh position={[0, 0, depth / 2 + 0.001]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial map={texture} roughness={0.4} />
        </mesh>
      </mesh>
    </group>
  );
};

export default Painting3D;
