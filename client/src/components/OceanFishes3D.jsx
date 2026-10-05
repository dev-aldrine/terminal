import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Create a realistic curved fish tail fin shape
function createCrescentFinGeometry(height = 1.6, width = 1.0) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(-width * 0.4, height * 0.5, -width, height * 0.5);
  shape.quadraticCurveTo(-width * 0.5, 0, -width, -height * 0.5);
  shape.quadraticCurveTo(-width * 0.4, -height * 0.5, 0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Create a realistic dorsal fin shape
function createDorsalFinGeometry(length = 0.9, height = 0.7) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(length * 0.2, height * 1.1, length * 0.6, height);
  shape.quadraticCurveTo(length * 0.4, height * 0.3, length, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Create realistic, smooth, organic 3D fish model
function createRealisticFish(type = 'shark') {
  const group = new THREE.Group();

  // Primary fish material (Iridescent, Translucent, Wet Scales)
  const isShark = type === 'shark';
  const isAngler = type === 'angler';
  const isRay = type === 'ray';

  const baseColor = isShark ? 0x092b52 : isAngler ? 0x051a36 : isRay ? 0x073563 : 0x0a3f78;
  const glowColor = isShark ? 0x00d2ff : isAngler ? 0x00ffa3 : isRay ? 0x38bdf8 : 0x00ffa3;

  const skinMat = new THREE.MeshPhysicalMaterial({
    color: baseColor,
    emissive: glowColor,
    emissiveIntensity: 0.22,
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    transmission: 0.1,
    flatShading: false
  });

  const finMat = new THREE.MeshPhysicalMaterial({
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: 0.45,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1.0,
    flatShading: false
  });

  if (isRay) {
    // Realistic Manta Ray Model
    const bodyGeo = new THREE.SphereGeometry(1, 28, 20);
    bodyGeo.scale(2.2, 0.18, 1.4);
    const body = new THREE.Mesh(bodyGeo, skinMat);
    group.add(body);

    // Whip Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-2.0, 0, 0);
    const tailGeo = new THREE.CylinderGeometry(0.04, 0.01, 3.2, 8);
    tailGeo.rotateZ(Math.PI / 2);
    const tailMesh = new THREE.Mesh(tailGeo, finMat);
    tailMesh.position.set(-1.6, 0, 0);
    tailGroup.add(tailMesh);
    group.add(tailGroup);
    group.userData.tail = tailGroup;

  } else {
    // Realistic Streamlined Fish Body
    const bodyGeo = new THREE.SphereGeometry(1, 32, 24);
    if (isAngler) {
      bodyGeo.scale(1.6, 1.2, 0.75);
    } else {
      // Streamlined Torpedo Shark / Predator Body
      bodyGeo.scale(2.4, 0.85, 0.45);
    }
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
    group.add(bodyMesh);

    // Dorsal Fin
    const dorsalGeo = createDorsalFinGeometry(0.9, 0.75);
    const dorsal = new THREE.Mesh(dorsalGeo, finMat);
    dorsal.position.set(-0.4, 0.75, 0);
    dorsal.rotation.z = 0.2;
    group.add(dorsal);

    // Left & Right Pectoral Fins (Flapping)
    const pecGeo = createDorsalFinGeometry(0.75, 0.4);
    const pecL = new THREE.Mesh(pecGeo, finMat);
    pecL.position.set(0.6, -0.25, 0.4);
    pecL.rotation.set(0.4, 0.5, -0.6);
    const pecR = new THREE.Mesh(pecGeo, finMat);
    pecR.position.set(0.6, -0.25, -0.4);
    pecR.rotation.set(-0.4, -0.5, -0.6);
    group.add(pecL, pecR);
    group.userData.pecL = pecL;
    group.userData.pecR = pecR;

    // Articulated Tail & Crescent Caudal Fin
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-1.9, 0, 0);
    
    // Tail stem
    const stemGeo = new THREE.CylinderGeometry(0.12, 0.35, 1.2, 12);
    stemGeo.rotateZ(Math.PI / 2);
    const stemMesh = new THREE.Mesh(stemGeo, skinMat);
    stemMesh.position.set(-0.5, 0, 0);
    tailGroup.add(stemMesh);

    // Caudal Fin Blade
    const caudalGeo = createCrescentFinGeometry(1.5, 1.1);
    const caudal = new THREE.Mesh(caudalGeo, finMat);
    caudal.position.set(-1.0, 0, 0);
    tailGroup.add(caudal);

    group.add(tailGroup);
    group.userData.tail = tailGroup;

    // Glowing Luminescent Eyes
    const eyeGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(1.4, 0.22, 0.32);
    const eyeR = eyeL.clone();
    eyeR.position.z = -0.32;
    group.add(eyeL, eyeR);

    // If Angler: Add curved glowing stalk lure
    if (isAngler) {
      const stalkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.6, 0.9, 0),
        new THREE.Vector3(1.1, 1.4, 0),
        new THREE.Vector3(1.4, 1.1, 0)
      ]);
      const stalkGeo = new THREE.TubeGeometry(stalkCurve, 16, 0.035, 8, false);
      const stalk = new THREE.Mesh(stalkGeo, finMat);
      group.add(stalk);

      const escaGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const escaMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
      const esca = new THREE.Mesh(escaGeo, escaMat);
      esca.position.set(1.4, 1.1, 0);
      group.add(esca);
    }
  }

  return group;
}

export const OceanFishes3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Deep Abyss Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030814, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // Renderer with Anti-Aliasing and Rich Lighting
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (e) {
      return;
    }

    // Atmospheric Ocean Lighting
    const ambientLight = new THREE.AmbientLight(0x092b4f, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 2.5);
    keyLight.position.set(6, 14, 10);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00ffa3, 2.2, 35);
    rimLight.position.set(-6, -6, 4);
    scene.add(rimLight);

    // Spawn Realistic 3D Fishes
    const fishes = [];
    const fishConfigs = [
      { type: 'shark', count: 4, scaleBase: 0.9 },
      { type: 'angler', count: 3, scaleBase: 0.75 },
      { type: 'ray', count: 2, scaleBase: 0.8 },
      { type: 'shark', count: 5, scaleBase: 0.55 } // Schooling smaller predators
    ];

    fishConfigs.forEach(({ type, count, scaleBase }) => {
      for (let i = 0; i < count; i++) {
        const fishMesh = createRealisticFish(type);

        const posX = (Math.random() - 0.5) * 34;
        const posY = (Math.random() - 0.5) * 20;
        const posZ = -3 + (Math.random() - 0.5) * 16;
        fishMesh.position.set(posX, posY, posZ);

        const s = scaleBase * (0.8 + Math.random() * 0.4);
        fishMesh.scale.set(s, s, s);

        const dir = Math.random() > 0.5 ? 1 : -1;
        const speed = (0.03 + Math.random() * 0.035) * dir;

        fishMesh.userData = {
          speedX: speed,
          speedY: (Math.random() - 0.5) * 0.012,
          speedZ: (Math.random() - 0.5) * 0.012,
          wigglePhase: Math.random() * Math.PI * 2,
          wiggleSpeed: 3.5 + Math.random() * 2.5,
          baseY: posY,
          amplitudeY: 0.8 + Math.random() * 1.6,
          targetRotationY: dir > 0 ? 0 : Math.PI
        };

        fishMesh.rotation.y = fishMesh.userData.targetRotationY;
        scene.add(fishMesh);
        fishes.push(fishMesh);
      }
    });

    // Ambient Bioluminescent Plankton Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 44;
      positions[i + 1] = (Math.random() - 0.5) * 28;
      positions[i + 2] = (Math.random() - 0.5) * 24;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.14,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Realistic Fishes
      fishes.forEach((fish) => {
        const u = fish.userData;

        // Position Updates
        fish.position.x += u.speedX;
        fish.position.y = u.baseY + Math.sin(elapsedTime * 0.75 + u.wigglePhase) * u.amplitudeY;
        fish.position.z += u.speedZ;

        // Organic Harmonic Tail Fin Swimming Motion
        if (u.tail) {
          const tailAngle = Math.sin(elapsedTime * u.wiggleSpeed + u.wigglePhase) * 0.45;
          u.tail.rotation.y = tailAngle;
        }

        // Pectoral Fins Synchronized Flap
        if (u.pecL && u.pecR) {
          const pecFlap = Math.sin(elapsedTime * u.wiggleSpeed + u.wigglePhase + 0.5) * 0.25;
          u.pecL.rotation.z = -0.6 + pecFlap;
          u.pecR.rotation.z = -0.6 - pecFlap;
        }

        // Smooth Body Banking into Swim Curvature
        fish.rotation.z = Math.sin(elapsedTime * 1.1 + u.wigglePhase) * 0.07;

        // Smooth Screen Boundary Wrap
        const xLimit = 24;
        if (fish.position.x > xLimit) {
          fish.position.x = -xLimit;
        } else if (fish.position.x < -xLimit) {
          fish.position.x = xLimit;
        }

        if (fish.position.z > 7) u.speedZ = -Math.abs(u.speedZ);
        if (fish.position.z < -16) u.speedZ = Math.abs(u.speedZ);
      });

      // Drifting Plankton Particles
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArr[i] += 0.009;
        if (posArr[i] > 14) posArr[i] = -14;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-95"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default OceanFishes3D;
