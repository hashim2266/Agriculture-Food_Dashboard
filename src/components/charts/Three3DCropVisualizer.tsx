import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sprout, Sun, Droplets, Thermometer, Wind, RefreshCw } from 'lucide-react';

interface CropVisualizerProps {
  title?: string;
  subtitle?: string;
  height?: number;
}

export const Three3DCropVisualizer: React.FC<CropVisualizerProps> = ({
  title = "3D Interactive Crop Yield & Environment Visualizer",
  subtitle = "Real-time Soil & Climate Simulation (MR315 Paddy Hybrid Strain)",
  height = 360,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [moisture, setMoisture] = useState<number>(75); // %
  const [temperature, setTemperature] = useState<number>(29); // °C
  const [fertilizer, setFertilizer] = useState<number>(85); // %
  const [sunlight, setSunlight] = useState<number>(80); // %

  const simulatedYield = (
    3.5 +
    (moisture / 100) * 0.8 +
    (fertilizer / 100) * 1.1 +
    (sunlight / 100) * 0.5 -
    Math.max(0, (temperature - 32) * 0.1)
  ).toFixed(2);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const currentHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(40, width / currentHeight, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, currentHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunColor = new THREE.Color().setHSL(0.12, 1.0, 0.5 + (sunlight / 100) * 0.2);
    const sunLight = new THREE.DirectionalLight(sunColor, 1.2 + (sunlight / 100) * 0.5);
    sunLight.position.set(8, 15, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Soil Patch
    const soilGeo = new THREE.CylinderGeometry(4.5, 4.8, 1.0, 32);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // Rich dark earth
      roughness: 0.9,
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = -0.5;
    soilMesh.receiveShadow = true;
    scene.add(soilMesh);

    // Paddy Field Grass / Stems Group
    const plantsGroup = new THREE.Group();
    scene.add(plantsGroup);

    const stemCount = 45;
    const cropScale = Number(simulatedYield) / 5.0; // scale factor

    for (let i = 0; i < stemCount; i++) {
      const radius = Math.random() * 3.6;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const stemHeight = (1.8 + Math.random() * 1.2) * cropScale;
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.08, stemHeight, 8);
      const stemColor = new THREE.Color().setHSL(0.33, 0.8, 0.35 + (fertilizer / 200));

      const stemMat = new THREE.MeshStandardMaterial({
        color: stemColor,
        roughness: 0.3,
      });

      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(x, stemHeight / 2, z);
      stem.rotation.z = (Math.random() - 0.5) * 0.15;
      stem.rotation.x = (Math.random() - 0.5) * 0.15;
      stem.castShadow = true;

      // Golden Grain head
      const grainGeo = new THREE.ConeGeometry(0.18, 0.7, 8);
      const grainMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Golden Paddy
        roughness: 0.2,
      });
      const grain = new THREE.Mesh(grainGeo, grainMat);
      grain.position.set(0, stemHeight / 2 + 0.35, 0);
      grain.rotation.x = 0.3;
      stem.add(grain);

      plantsGroup.add(stem);
    }

    let rotY = 0;
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      rotY += 0.005;
      plantsGroup.rotation.y = rotY;
      soilMesh.rotation.y = rotY;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / currentHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(w, currentHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [moisture, temperature, fertilizer, sunlight, height]);

  return (
    <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg hover:border-emerald-500/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-right">
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Simulated Yield</span>
          <span className="text-base font-extrabold text-emerald-400">{simulatedYield} Tonnes/Ha</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 3D Canvas */}
        <div className="md:col-span-2 relative">
          <div ref={mountRef} className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#050505]" />
        </div>

        {/* Environment Sliders */}
        <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-1.5 border-b border-white/10">
            Field Environment Controls
          </h4>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Droplets className="w-3.5 h-3.5 text-blue-400" /> Irrigation Moisture
              </span>
              <span className="font-bold text-white">{moisture}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={moisture}
              onChange={(e) => setMoisture(Number(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Ambient Temp
              </span>
              <span className="font-bold text-white">{temperature}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" /> NPK Fertilizer
              </span>
              <span className="font-bold text-white">{fertilizer}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={fertilizer}
              onChange={(e) => setFertilizer(Number(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Sun className="w-3.5 h-3.5 text-yellow-400" /> Solar Insolation
              </span>
              <span className="font-bold text-white">{sunlight}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={sunlight}
              onChange={(e) => setSunlight(Number(e.target.value))}
              className="w-full accent-yellow-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              setMoisture(75);
              setTemperature(29);
              setFertilizer(85);
              setSunlight(80);
            }}
            className="w-full mt-2 py-1.5 bg-white/10 border border-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Optimal Parameters
          </button>
        </div>
      </div>
    </div>
  );
};
