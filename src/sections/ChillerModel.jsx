import { useGLTF } from "@react-three/drei";

const ChillerModel = () => {
  const { scene } = useGLTF("/models/Chiller.gltf");

  if (!scene) {
    console.error("Failed to load the GLTF model.");
    return null;
  }

  return <primitive object={scene} scale={1.5} />;
};

// Preload the model
useGLTF.preload("/models/Chiller.gltf");

export default ChillerModel;
