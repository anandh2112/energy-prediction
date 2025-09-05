import * as THREE from 'three';
import { useEffect } from 'react';
import '../pages/Styles.css'; // Import the CSS file

const ThreeDChiller = () => {
  useEffect(() => {
    // Create the scene
    const scene = new THREE.Scene();
    
    // Create the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Create a light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    // Create a simple box to represent the chiller
    const geometry = new THREE.BoxGeometry(1, 1, 2); // Width, height, depth
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const chiller = new THREE.Mesh(geometry, material);
    scene.add(chiller);
    
    // Set the camera position
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      chiller.rotation.y += 0.01; // Rotate the chiller for a visual effect
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="three-d-chiller">
      <h1 className="chiller-title">3D Chiller Animation</h1>
    </div>
  ); // Wrap the 3D scene in a div for styling
};

export default ThreeDChiller;
