import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Procedural Low-Poly Fish Geometries
function createLowPolyFishGeometry(type = 'predator') {
  const group = new THREE.Group();

  if (type === 'predator') {
    // 1. Shark / Cyber Megalodon (Faceted Low-Poly)
    const bodyGeo = new THREE.ConeGeometry(0.8, 3.2, 5);
    bodyGeo.rotateZ(Math.PI / 2);
    bodyGeo.scale(1, 0.6, 0.45);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x072448,
      emissive: 0x00d2ff,
      emissiveIntensity: 0.25,
      flatShading: true,
      roughness: 0.3,
      metalness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(bodyMesh);

    // Dorsal Fin
    const dorsalGeo = new THREE.ConeGeometry(0.35, 0.9, 3);
    dorsalGeo.rotateY(Math.PI / 2);
    const dorsalMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, flatShading: true });
    const dorsal = new THREE.Mesh(dorsalGeo, dorsalMat);
    dorsal.position.set(-0.2, 0.7, 0);
    dorsal.rotation.z = -0.3;
    group.add(dorsal);

    // Tail Fin (Articulated Group for Wiggle)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-1.6, 0, 0);
    const finGeo = new THREE.ConeGeometry(0.7, 1.2, 3);
    finGeo.rotateZ(-Math.PI / 2);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x00ffa3, flatShading: true, emissive: 0x00ffa3, emissiveIntensity: 0.4 });
    const finMesh = new THREE.Mesh(finGeo, finMat);
    finMesh.position.set(-0.5, 0, 0);
    tailGroup.add(finMesh);
    group.add(tailGroup);
    group.userData.tail = tailGroup;

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 4, 4);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(1.0, 0.15, 0.28);
    const eyeR = eyeL.clone();
    eyeR.position.z = -0.28;
    group.add(eyeL, eyeR);

  } else if (type === 'angler') {
    // 2. Neon Angler Core
    const bodyGeo = new THREE.DodecahedronGeometry(0.9, 0);
    bodyGeo.scale(1.2, 0.9, 0.75);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x041a36,
      emissive: 0x00d2ff,
      emissiveIntensity: 0.3,
      flatShading: true,
      roughness: 0.4
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(bodyMesh);

    // Lure Stalk & Glowing Bulb
    const stalkGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 3);
    stalkGeo.rotateZ(-0.6);
    const stalkMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff });
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);
    stalk.position.set(0.6, 0.8, 0);
    group.add(stalk);

    const bulbGeo = new THREE.SphereGeometry(0.18, 6, 6);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0.95, 1.2, 0);
    group.add(bulb);

    // Tail Fin
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.9, 0, 0);
    const finGeo = new THREE.ConeGeometry(0.6, 0.8, 3);
    finGeo.rotateZ(-Math.PI / 2);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, flatShading: true, emissive: 0x00d2ff, emissiveIntensity: 0.5 });
    const finMesh = new THREE.Mesh(finGeo, finMat);
    finMesh.position.set(-0.35, 0, 0);
    tailGroup.add(finMesh);
    group.add(tailGroup);
    group.userData.tail = tailGroup;

  } else if (type === 'ray') {
    // 3. Volt Manta Ray
    const bodyGeo = new THREE.ConeGeometry(1.4, 1.8, 4);
    bodyGeo.scale(1.8, 0.15, 1);
    bodyGeo.rotateZ(Math.PI / 2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x06284e,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      flatShading: true
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(bodyMesh);

    // Long Whip Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-1.0, 0, 0);
    const tailGeo = new THREE.CylinderGeometry(0.03, 0.01, 2.2, 3);
    tailGeo.rotateZ(Math.PI / 2);
    const tailMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    tailMesh.position.set(-1.1, 0, 0);
    tailGroup.add(tailMesh);
    group.add(tailGroup);
    group.userData.tail = tailGroup;

  } else {
    // 4. Fast Degen Piranha / Schooling Fish
    const bodyGeo = new THREE.ConeGeometry(0.5, 1.5, 4);
    bodyGeo.rotateZ(Math.PI / 2);
    bodyGeo.scale(1, 0.8, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x083363,
      emissive: 0x00ffa3,
      emissiveIntensity: 0.3,
      flatShading: true
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(bodyMesh);

    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.8, 0, 0);
    const finGeo = new THREE.ConeGeometry(0.4, 0.6, 3);
    finGeo.rotateZ(-Math.PI / 2);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, flatShading: true });
    const finMesh = new THREE.Mesh(finGeo, finMat);
    finMesh.position.set(-0.25, 0, 0);
    tailGroup.add(finMesh);
    group.add(tailGroup);
    group.userData.tail = tailGroup;
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

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040916, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (e) {
      return;
    }

    // Underwater Lighting
    const ambientLight = new THREE.AmbientLight(0x0a2540, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x00d2ff, 2.2);
    sunLight.position.set(5, 12, 8);
    scene.add(sunLight);

    const bottomGlow = new THREE.PointLight(0x00ffa3, 1.8, 30);
    bottomGlow.position.set(-4, -6, 2);
    scene.add(bottomGlow);

    // Spawn 3D Low-Poly Fishes
    const fishes = [];
    const fishTypes = ['predator', 'predator', 'angler', 'ray', 'piranha', 'piranha', 'predator', 'angler', 'ray', 'piranha'];
    const count = 16;

    for (let i = 0; i < count; i++) {
      const type = fishTypes[i % fishTypes.length];
      const fishMesh = createLowPolyFishGeometry(type);

      // Random 3D initial positions in deep ocean space
      const posX = (Math.random() - 0.5) * 32;
      const posY = (Math.random() - 0.5) * 18;
      const posZ = -4 + (Math.random() - 0.5) * 14;

      fishMesh.position.set(posX, posY, posZ);

      // Random size scaling
      const scale = 0.6 + Math.random() * 0.7;
      fishMesh.scale.set(scale, scale, scale);

      // Velocity & Movement dynamics
      const direction = Math.random() > 0.5 ? 1 : -1;
      const speed = (0.025 + Math.random() * 0.04) * direction;

      fishMesh.userData = {
        ...fishMesh.userData,
        speedX: speed,
        speedY: (Math.random() - 0.5) * 0.012,
        speedZ: (Math.random() - 0.5) * 0.015,
        wigglePhase: Math.random() * Math.PI * 2,
        wiggleSpeed: 4.0 + Math.random() * 3.0,
        baseY: posY,
        amplitudeY: 0.8 + Math.random() * 1.5,
        targetRotationY: direction > 0 ? 0 : Math.PI
      };

      fishMesh.rotation.y = fishMesh.userData.targetRotationY;
      scene.add(fishMesh);
      fishes.push(fishMesh);
    }

    // Floating Bioluminescent Plankton Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 25;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Fishes
      fishes.forEach((fish) => {
        const u = fish.userData;

        // Move position
        fish.position.x += u.speedX;
        fish.position.y = u.baseY + Math.sin(elapsedTime * 0.8 + u.wigglePhase) * u.amplitudeY;
        fish.position.z += u.speedZ;

        // Tail Wiggle Animation
        if (u.tail) {
          u.tail.rotation.y = Math.sin(elapsedTime * u.wiggleSpeed + u.wigglePhase) * 0.45;
        }

        // Slight body pitch/roll with swimming cadence
        fish.rotation.z = Math.sin(elapsedTime * 1.2 + u.wigglePhase) * 0.08;

        // Screen Boundary Wrap / Smooth Turnaround
        const xLimit = 22;
        if (fish.position.x > xLimit) {
          fish.position.x = -xLimit;
        } else if (fish.position.x < -xLimit) {
          fish.position.x = xLimit;
        }

        if (fish.position.z > 6) u.speedZ = -Math.abs(u.speedZ);
        if (fish.position.z < -14) u.speedZ = Math.abs(u.speedZ);
      });

      // Float Plankton Particles Gently
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArr[i] += 0.008;
        if (posArr[i] > 12) posArr[i] = -12;
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
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-90"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default OceanFishes3D;
