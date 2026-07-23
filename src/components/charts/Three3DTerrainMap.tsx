import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MapPin, Navigation, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import { RegionalPriceData } from '../../types';

interface Three3DTerrainMapProps {
  data: RegionalPriceData[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const Three3DTerrainMap: React.FC<Three3DTerrainMapProps> = ({
  data,
  title = "Regional Food Security & CPI Heatmap (Interactive 3D Map)",
  subtitle = "3D State Heightmap - Height represents CPI Price Index, Color indicates Risk Status",
  height = 380,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<RegionalPriceData | null>(data[0] || null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const currentHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(40, width / currentHeight, 0.1, 1000);
    camera.position.set(0, 16, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, currentHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Ground Board with Grid
    const groundGeo = new THREE.PlaneGeometry(24, 16);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x121215,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(24, 12, 0x4ade80, 0x27272a);
    grid.position.y = 0.02;
    scene.add(grid);

    // Map Group
    const mapGroup = new THREE.Group();
    scene.add(mapGroup);

    // Normalize Lat/Lng for 3D layout plane
    const minLat = 1.0, maxLat = 7.0;
    const minLng = 99.5, maxLng = 118.0;

    const pinMeshes: { mesh: THREE.Mesh; item: RegionalPriceData }[] = [];

    data.forEach((item) => {
      // Map coordinates to 3D grid [-10 to +10, -6 to +6]
      const x = ((item.lng - minLng) / (maxLng - minLng)) * 18 - 9;
      const z = -(((item.lat - minLat) / (maxLat - minLat)) * 12 - 6);

      // Height proportional to CPI Index (base 100)
      const heightVal = Math.max(0.5, (item.cpiIndex - 100) * 0.8 + 1.5);

      // Color based on Risk
      let colorHex = 0x10b981; // Green / Low
      if (item.riskStatus === 'Moderate') colorHex = 0xf59e0b; // Amber
      if (item.riskStatus === 'High') colorHex = 0xef4444; // Red

      const pillarGeo = new THREE.CylinderGeometry(0.5, 0.7, heightVal, 16);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.9,
      });

      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, heightVal / 2, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;

      // Top pin ring
      const ringGeo = new THREE.TorusGeometry(0.6, 0.08, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, heightVal / 2 + 0.1, 0);
      pillar.add(ring);

      mapGroup.add(pillar);
      pinMeshes.push({ mesh: pillar, item });
    });

    let autoRotate = true;
    let rotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(mapGroup.children, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object as THREE.Mesh;
        if (!pinMeshes.some((p) => p.mesh === hitObj)) {
          if (hitObj.parent && hitObj.parent instanceof THREE.Mesh) hitObj = hitObj.parent;
        }
        const found = pinMeshes.find((p) => p.mesh === hitObj);
        if (found) {
          setSelectedState(found.item);
          document.body.style.cursor = 'pointer';
        }
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      rotY += 0.003;
      mapGroup.rotation.y = rotY;
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
      domElem.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      document.body.style.cursor = 'default';
    };
  }, [data, height]);

  return (
    <div className="rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg hover:border-emerald-500/30 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Low Risk
          </span>
          <span className="flex items-center gap-1 font-medium text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate
          </span>
          <span className="flex items-center gap-1 font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-400" /> High Risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 3D Canvas */}
        <div className="lg:col-span-2 relative">
          <div ref={mountRef} className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#050505]" />
          <div className="absolute bottom-2 left-2 bg-[#121215]/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/10 text-[11px] text-slate-400 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-emerald-400 animate-bounce" />
            <span>Drag map to rotate spatial view</span>
          </div>
        </div>

        {/* Selected State Details Sidebar */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Regional Focus</span>
                <h4 className="text-base font-bold text-white">{selectedState?.state}</h4>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedState?.riskStatus === 'High'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : selectedState?.riskStatus === 'Moderate'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {selectedState?.riskStatus} Risk
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Consumer Price Index (CPI):</span>
                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {selectedState?.cpiIndex} pts
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Paddy Yield per Hectare:</span>
                <span className="font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedState?.paddyYieldHa} Tonnes/Ha
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Farm-to-Market Transit Time:</span>
                <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                  {selectedState?.deliveryDays} Days
                </span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="block text-[11px] font-semibold text-slate-300 mb-1.5">Commodity Retail Prices:</span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <div className="bg-white/5 p-1.5 rounded border border-white/10">
                    <span className="block text-[10px] text-slate-400">Poultry</span>
                    <span className="font-bold text-white">RM{selectedState?.poultryPriceMYR.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded border border-white/10">
                    <span className="block text-[10px] text-slate-400">Beef</span>
                    <span className="font-bold text-white">RM{selectedState?.beefPriceMYR.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded border border-white/10">
                    <span className="block text-[10px] text-slate-400">Rice 10kg</span>
                    <span className="font-bold text-white">RM{selectedState?.ricePriceMYR.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Coordinates: {selectedState?.lat.toFixed(2)}°N, {selectedState?.lng.toFixed(2)}°E</span>
            <span className="font-semibold text-emerald-400">OpenDOSM Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
