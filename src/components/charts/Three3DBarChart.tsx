import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Maximize2, ShieldCheck, Sparkles, Calculator } from 'lucide-react';
import { GraphStatisticalQuestions } from '../GraphStatisticalQuestions';

interface BarData {
  label: string;
  value: number;
  color: string;
  secondaryValue?: number;
}

interface Three3DBarChartProps {
  data: BarData[];
  title?: string;
  subtitle?: string;
  unit?: string;
  height?: number;
}

export const Three3DBarChart: React.FC<Three3DBarChartProps> = ({
  data,
  title = "Self-Sufficiency Ratio (SSR) by Commodity (3D View)",
  subtitle = "Interactive WebGL 3D Visualization - Drag to rotate, hover bars for details",
  unit = "%",
  height = 380,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<{ label: string; value: number } | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const currentHeight = height;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505); // Deep dark background

    const camera = new THREE.PerspectiveCamera(40, width / currentHeight, 0.1, 1000);
    camera.position.set(12, 14, 18);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, currentHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x4ade80, 2.0, 30); // Bright emerald glow
    pointLight.position.set(-5, 10, 5);
    scene.add(pointLight);

    // Ground Grid & Base Glass Platform
    const gridHelper = new THREE.GridHelper(24, 16, 0x4ade80, 0x27272a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const baseGeometry = new THREE.BoxGeometry(22, 0.4, 12);
    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x121215,
      transmission: 0.3,
      opacity: 0.9,
      transparent: true,
      roughness: 0.3,
      metalness: 0.8,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.position.set(0, -0.2, 0);
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    // Group for Bars
    const barsGroup = new THREE.Group();
    scene.add(barsGroup);

    const maxVal = Math.max(...data.map((d) => d.value), 100);
    const maxBarHeight = 7.5;
    const barWidth = 1.4;
    const barDepth = 1.4;
    const spacing = 2.4;
    const startX = -((data.length - 1) * spacing) / 2;

    const barMeshes: { mesh: THREE.Mesh; label: string; value: number }[] = [];

    data.forEach((item, index) => {
      const h = (item.value / maxVal) * maxBarHeight;
      const barGeo = new THREE.BoxGeometry(barWidth, h, barDepth);

      // Glassmorphism Emerald / Custom Metallic Material
      const barColor = new THREE.Color(item.color || '#059669');
      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        roughness: 0.2,
        metalness: 0.3,
        transparent: true,
        opacity: 0.92,
      });

      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(startX + index * spacing, h / 2, 0);
      barMesh.castShadow = true;
      barMesh.receiveShadow = true;

      // Add top highlight cap
      const capGeo = new THREE.BoxGeometry(barWidth + 0.1, 0.15, barDepth + 0.1);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        emissive: 0x059669,
        emissiveIntensity: 0.3,
      });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.set(0, h / 2 + 0.08, 0);
      barMesh.add(capMesh);

      barsGroup.add(barMesh);
      barMeshes.push({ mesh: barMesh, label: item.label, value: item.value });
    });

    // Orbit Controls / Mouse Drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationY = 0.3;
    let rotationX = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycasting for Hover Tooltip
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      const intersects = raycaster.intersectObjects(barsGroup.children, true);

      if (intersects.length > 0) {
        let parentMesh = intersects[0].object as THREE.Mesh;
        if (!barMeshes.some((b) => b.mesh === parentMesh)) {
          if (parentMesh.parent && parentMesh.parent instanceof THREE.Mesh) {
            parentMesh = parentMesh.parent;
          }
        }
        const found = barMeshes.find((b) => b.mesh === parentMesh);
        if (found) {
          setHoveredItem({ label: found.label, value: found.value });
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredItem(null);
        document.body.style.cursor = 'default';
      }

      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationY += deltaX * 0.008;
      rotationX += deltaY * 0.008;
      rotationX = Math.max(-0.2, Math.min(0.8, rotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        rotationY += 0.004;
      }

      barsGroup.rotation.y = rotationY;
      barsGroup.rotation.x = rotationX;

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
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      document.body.style.cursor = 'default';
    };
  }, [data, height, autoRotate]);

  return (
    <div className="relative rounded-2xl bg-[#121215]/80 backdrop-blur-md border border-white/10 p-5 shadow-lg hover:border-emerald-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-white text-base">{title}</h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
              3D WebGL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStatsModal(true)}
            className="px-3 py-1.5 text-xs rounded-lg font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 font-bold"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statistical Questions</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-emerald-500 text-black font-bold shadow-sm shadow-emerald-500/20'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            {autoRotate ? 'Rotating' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Hover Info Banner */}
      <div className="h-7 mb-1 flex items-center justify-between px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-xs">
        {hoveredItem ? (
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Commodity: <strong className="text-white">{hoveredItem.label}</strong></span>
            <span>| SSR Value: <strong className="text-emerald-400 text-sm">{hoveredItem.value}{unit}</strong></span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Hover mouse over 3D bars or drag to rotate view angle</span>
        )}
        <div className="flex items-center gap-1 text-[11px] text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DOSM Verified</span>
        </div>
      </div>

      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="w-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/10 bg-[#050505]" />

      {/* Legend Footer */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 p-1.5 bg-white/5 rounded-md border border-white/10 text-xs">
            <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate text-slate-300 font-medium">{item.label}</span>
            <span className="text-white font-bold ml-auto">{item.value}{unit}</span>
          </div>
        ))}
      </div>

      <GraphStatisticalQuestions
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        graphTitle={title}
        datasetContext="ssrTrend"
      />
    </div>
  );
};
