import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PieChart as PieIcon, Layers, Eye } from 'lucide-react';

interface SliceData {
  name: string;
  value: number;
  color: string;
  tonnage?: number;
}

interface Three3DDonutChartProps {
  data: SliceData[];
  title?: string;
  subtitle?: string;
  centerText?: string;
  height?: number;
}

export const Three3DDonutChart: React.FC<Three3DDonutChartProps> = ({
  data,
  title = "Import vs Local Production Share (3D View)",
  subtitle = "Interactive 3D Donut - Compare Food Reliance Ratio",
  centerText = "Food Supply",
  height = 340,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeSlice, setActiveSlice] = useState<SliceData | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const currentHeight = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(40, width / currentHeight, 0.1, 1000);
    camera.position.set(0, 10, 14);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const donutGroup = new THREE.Group();
    scene.add(donutGroup);

    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    let startAngle = 0;
    const innerRadius = 2.2;
    const outerRadius = 4.2;
    const depth = 1.2;

    const sliceMeshes: { mesh: THREE.Mesh; item: SliceData }[] = [];

    data.forEach((item) => {
      const sliceAngle = (item.value / totalValue) * Math.PI * 2;
      const shape = new THREE.Shape();

      // Outer arc
      shape.absarc(0, 0, outerRadius, startAngle, startAngle + sliceAngle, false);
      // Inner arc
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, innerRadius, startAngle, startAngle + sliceAngle, false);
      shape.holes.push(holePath);

      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.1,
        bevelThickness: 0.1,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.center(); // keep center aligned

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color),
        roughness: 0.25,
        metalness: 0.35,
        transparent: true,
        opacity: 0.95,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Position along angle bisector
      const midAngle = startAngle + sliceAngle / 2;
      const offsetDist = 0.2;
      mesh.position.x = Math.cos(midAngle) * offsetDist;
      mesh.position.z = Math.sin(midAngle) * offsetDist;

      donutGroup.add(mesh);
      sliceMeshes.push({ mesh, item });

      startAngle += sliceAngle;
    });

    let autoRot = true;
    let rotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(donutGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const found = sliceMeshes.find((s) => s.mesh === hit);
        if (found) {
          setActiveSlice(found.item);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setActiveSlice(null);
        document.body.style.cursor = 'default';
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousemove', onMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      rotY += 0.005;
      donutGroup.rotation.y = rotY;
      donutGroup.rotation.x = 0.3;
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
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg">
          3D Extruded
        </span>
      </div>

      <div className="relative">
        <div ref={mountRef} className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#050505]" />

        {/* Center overlay text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-[#121215]/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{centerText}</span>
            <span className="block text-sm font-bold text-white">
              {activeSlice ? `${activeSlice.value}%` : '100% Total'}
            </span>
          </div>
        </div>
      </div>

      {/* Slice Details */}
      <div className="mt-3 space-y-2">
        {data.map((slice, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
              activeSlice?.name === slice.name
                ? 'bg-emerald-500/15 border-emerald-500/30 shadow-xs'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="font-semibold text-slate-200">{slice.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {slice.tonnage && (
                <span className="text-slate-400 font-medium">{slice.tonnage.toLocaleString()} Tonnes</span>
              )}
              <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                {slice.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
