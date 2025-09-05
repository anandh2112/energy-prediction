import React, { useEffect, useRef, useState, useContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from 'axios';
import { DateContext } from "../contexts/DateContext";

const categoryColors = {
  "C-49": "#008B8B",
  "C-50": "#FFA500",
};

const highlightColors = {
  "C-49": "#99FF99",
  "C-50": "#FFFF99",
};

const ZoneUsage = () => {
  const meterToZoneMap = {
    1: { name: "PLATING", category: "C-49" },
    2: { name: "DIE CASTING + CHINA BUFFING + CNC", category: "C-50" },
    3: { name: "SCOTCH BUFFING", category: "C-50" },
    4: { name: "BUFFING", category: "C-49" },
    5: { name: "SPRAY+EPL-I", category: "C-50" },
    6: { name: "SPRAY+ EPL-II", category: "C-49" },
    7: { name: "RUMBLE", category: "C-50" },
    8: { name: "AIR COMPRESSOR", category: "C-49" },
    9: { name: "TERRACE", category: "C-49" },
    10: { name: "TOOL ROOM", category: "C-50" },
    11: { name: "ADMIN BLOCK", category: "C-50" },
  };
  const { startDateTime, endDateTime } = useContext(DateContext);
  const mountRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [zoneData, setZoneData] = useState(()=> Object.entries(meterToZoneMap).map(([id,info]) => ({
    id: Number(id),
    name: info.name,
    category: info.category,
    consumption: 0
  })));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/econsumption`, {
          params: {
            startDateTime,
            endDateTime
          },
        });
  
        const updatedZones = zoneData.map((zone) => {
          const matchingEntry = response.data.consumptionData.find(
            (entry) => entry.energy_meter_id === zone.id
          );
          return {
            ...zone,
            consumption: matchingEntry ? parseFloat(matchingEntry.consumption) : 0,
          };
        });
  
        setZoneData(updatedZones);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch zone data");
      }
    };
  
    fetchData();
  }, [startDateTime, endDateTime]);

  useEffect(() => {
    if (error || !mountRef.current || zoneData.length === 0) return;
  
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(30, width / height, 2.5, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.enableZoom = false;
  
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentIntersected = null;
  
    const cubes = [];
  
    const c49Zones = zoneData.filter((z) => z.category === "C-49");
    const c50Zones = zoneData.filter((z) => z.category === "C-50");
  
    let c49Index = 0;
    let c50Index = 0;
  
    zoneData.forEach((zone) => {
      const height = zone.category === "C-50" ? 0.7 : 1;
      const width = 2;
      const depth = 2.4;
  
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshBasicMaterial({
        color: categoryColors[zone.category],
      });
  
      const cube = new THREE.Mesh(geometry, material);
      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: highlightColors[zone.category],
      });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  
      let xPos, yPos;
      if (zone.category === "C-49") {
        xPos = -3;
        yPos = (c49Index - (c49Zones.length - 1) / 2) * height;
        c49Index++;
      } else {
        xPos = 3;
        yPos = (c50Index - (c50Zones.length - 1) / 2) * height;
        c50Index++;
      }
  
      cube.position.set(xPos, yPos, 0);
      edges.position.copy(cube.position);
      edges.scale.set(1.01, 1.01, 1.01);
  
      cube.userData = { ...zone, originalColor: categoryColors[zone.category] };
  
      scene.add(cube);
      scene.add(edges);
      cubes.push(cube);
    });
  
    camera.position.set(8, 0, 9);
    camera.lookAt(0, 0, 0);
  
    const checkIntersection = (x, y) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubes);
    
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected !== currentIntersected) {
          if (currentIntersected) {
            currentIntersected.material.color.set(currentIntersected.userData.originalColor);
          }
    
          currentIntersected = intersected;
          intersected.material.color.set(highlightColors[intersected.userData.category]);
          setHoveredZone(intersected.userData);
    
          tooltipRef.current.style.display = "block";
          tooltipRef.current.style.left = `${x + 10}px`;
          tooltipRef.current.style.top = `${y + 10}px`;
          tooltipRef.current.innerHTML = `
          <div><strong>${intersected.userData.name}</strong></div>
          <div>Block: ${intersected.userData.category}</div>
          <div>Consumption: ${intersected.userData.consumption} kVAh</div>
        `;
            
          mount.style.cursor = "pointer";
        }
        return true;
      } else {
        if (currentIntersected) {
          currentIntersected.material.color.set(currentIntersected.userData.originalColor);
          currentIntersected = null;
        }
        setHoveredZone(null);
        tooltipRef.current.style.display = "none";
        mount.style.cursor = "default";
        return false;
      }
    };
  
    const handleMouseMove = (event) => {
      checkIntersection(event.clientX, event.clientY);
    };
  
    const handleMouseOver = (event) => {
      if (!checkIntersection(event.clientX, event.clientY)) {
        tooltipRef.current.style.display = "none";
      }
    };

    const handleScroll = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = "none";
      }
      if (currentIntersected) {
        currentIntersected.material.color.set(currentIntersected.userData.originalColor);
        currentIntersected = null; 
      }
    };
    window.addEventListener("scroll", handleScroll);
    
  
    mount.addEventListener("mousemove", handleMouseMove);
    mount.addEventListener("mouseover", handleMouseOver);
  
    const handleResize = () => {
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
  
    window.addEventListener("resize", handleResize);
  
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
  
    animate();
  
    return () => {
      mount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
      mount.removeEventListener("mousemove", handleMouseMove);
      mount.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [zoneData, error]);
  

  return (
    <>
      <div className="relative bg-white p-7 rounded-lg shadow-md w-full flex flex-col space-y-8">
        <h2 className="text-xl font-semibold">Energy - Zone wise</h2>

       
<div ref={mountRef} className="w-full min-h-[300px] aspect-[16/9] overflow-hidden relative transform -translate-x-6" />        

        <div className="flex space-x-12 pb-2 justify-center items-start">
          <div className="bg-[#008B8B] text-white px-4 py-3 rounded-lg shadow-lg border-2 border-[#99FF99] text-lg font-bold">
            C-49
          </div>
          <div className="bg-[#FFA500] text-white px-4 py-3 rounded-lg shadow-lg border-2 border-[#FFFF99] text-lg font-bold">
            C-50
          </div>
        </div>
      </div>

      <div
        ref={tooltipRef}
        className="fixed bg-white p-2 border border-black rounded shadow-lg text-sm hidden pointer-events-none z-50"
        style={{ transform: "translate(10px, 10px)" }}
      />
    </>
  );
};

export default ZoneUsage;