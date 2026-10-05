import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Create a smooth organic fish body using LatheGeometry for zero polygon seams
function createFishBodyGeometry(length = 3.6, radius = 0.75) {
  const points = [];
  const segments = 18;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 (snout) to 1 (tail peduncle)
    const x = (t - 0.35) * length; // Center mass slightly forward
    
    // Smooth teardrop / aquatic profile formula
    let r = 0;
    if (t < 0.35) {
      // Snout to widest point
      r = radius * Math.sin((t / 0.35) * (Math.PI / 2));
    } else {
      // Widest point tapering down to tail peduncle
      r = radius * Math.cos(((t - 0.35) / 0.65) * (Math.PI * 0.44));
    }
    points.push(new THREE.Vector2(Math.max(r, 0.08), x));
  }
  
  const geo = new THREE.LatheGeometry(points, 24);
  geo.rotateZ(-Math.PI / 2); // Orient along X-axis (facing +X)
  return geo;
}

// Create smooth crescent caudal fin geometry
function createCaudalFinGeometry(height = 1.6, width = 1.1) {
  const shape = new THREE.Shape();
  shape.moveTo(0.2, 0);
  shape.quadraticCurveTo(-width * 0.3, height * 0.55, -width, height * 0.5);
  shape.quadraticCurveTo(-width * 0.45, 0, -width, -height * 0.5);
  shape.quadraticCurveTo(-width * 0.3, -height * 0.55, 0.2, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.04,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Create sleek dorsal fin geometry
function createDorsalFinGeometry(length = 0.9, height = 0.7) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.1, -0.1); // Embedded root
  shape.quadraticCurveTo(length * 0.2, height * 1.1, length * 0.65, height);
  shape.quadraticCurveTo(length * 0.45, height * 0.25, length, -0.1);
  shape.lineTo(-0.1, -0.1);

  const extrudeSettings = {
    steps: 1,
    depth: 0.035,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Create smooth pectoral fin geometry
function createPectoralFinGeometry(length = 0.8, width = 0.4) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(length * 0.3, width * 1.2, length, width * 0.3);
  shape.quadraticCurveTo(length * 0.6, -width * 0.2, 0, -width * 0.1);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.025,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// Create fully unified, organic 3D fish mesh
function createOrganicFish(type = 'shark') {
  const group = new THREE.Group();

  const isShark = type === 'shark';
  const isAngler = type === 'angler';
  const isRay = type === 'ray';

  const bodyColor = isShark ? 0x07264a : isAngler ? 0x051b38 : isRay ? 0x062850 : 0x0a3f78;
  const glowColor = isShark ? 0x00d2ff : isAngler ? 0x00ffa3 : isRay ? 0x38bdf8 : 0x00ffa3;

  // Premium Subsurface Oceanic Shaders
  const skinMat = new THREE.MeshPhysicalMaterial({
    color: bodyColor,
    emissive: glowColor,
    emissiveIntensity: 0.25,
    roughness: 0.18,
    metalness: 0.12,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    transmission: 0.08,
    flatShading: false
  });

  const finMat = new THREE.MeshPhysicalMaterial({
    color: glowColor,
    emissive: glowColor,
    emissiveIntensity: 0.5,
    roughness: 0.25,
    transparent: true,
    opacity: 0.82,
    clearcoat: 1.0,
    flatShading: false,
    side: THREE.DoubleSide
  });

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });

  if (isRay) {
    // Smooth Manta Ray Body
    const bodyGeo = new THREE.SphereGeometry(1, 32, 24);
    bodyGeo.scale(2.2, 0.2, 1.6);
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
    group.add(bodyMesh);

    // Manta Wing Flaps (Left & Right)
    const wingGeo = new THREE.SphereGeometry(1, 24, 16);
    wingGeo.scale(1.2, 0.08, 1.4);

    const wingL = new THREE.Mesh(wingGeo, finMat);
    wingL.position.set(-0.2, 0, 1.4);
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, finMat);
    wingR.position.set(-0.2, 0, -1.4);
    group.add(wingR);

    // Seamless Whip Tail rooted inside the body
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-1.6, 0, 0); // Rooted safely inside body radius (2.2)
    
    const tailGeo = new THREE.CylinderGeometry(0.02, 0.08, 2.8, 8);
    tailGeo.rotateZ(Math.PI / 2);
    tailGeo.translate(-1.4, 0, 0);
    const tailMesh = new THREE.Mesh(tailGeo, finMat);
    tailGroup.add(tailMesh);
    group.add(tailGroup);

    group.userData.wingL = wingL;
    group.userData.wingR = wingR;
    group.userData.tail = tailGroup;

  } else {
    // Shark or Angler Fish
    const bodyLength = isAngler ? 2.8 : 3.8;
    const bodyRadius = isAngler ? 0.95 : 0.65;
    const bodyGeo = createFishBodyGeometry(bodyLength, bodyRadius);
    const bodyMesh = new THREE.Mesh(bodyGeo, skinMat);
    group.add(bodyMesh);

    // Dorsal Fin (Embedded in top ridge)
    const dorsalGeo = createDorsalFinGeometry(isAngler ? 0.7 : 1.1, isAngler ? 0.5 : 0.85);
    const dorsal = new THREE.Mesh(dorsalGeo, finMat);
    dorsal.position.set(-0.4, bodyRadius * 0.72, 0);
    dorsal.rotation.z = 0.15;
    group.add(dorsal);

    // Pectoral Fins (Left & Right, Flapping)
    const pecGeo = createPectoralFinGeometry(0.85, 0.45);
    const pecL = new THREE.Mesh(pecGeo, finMat);
    pecL.position.set(0.4, -bodyRadius * 0.25, bodyRadius * 0.7);
    pecL.rotation.set(0.3, 0.5, -0.4);
    
    const pecR = new THREE.Mesh(pecGeo, finMat);
    pecR.position.set(0.4, -bodyRadius * 0.25, -bodyRadius * 0.7);
    pecR.rotation.set(-0.3, -0.5, -0.4);
    
    group.add(pecL, pecR);
    group.userData.pecL = pecL;
    group.userData.pecR = pecR;

    // Articulated Seamless Tail Group (Embedded deep into peduncle to eliminate gaps)
    const tailGroup = new THREE.Group();
    // Body spans from x approx +1.3 to -2.3. Pivot at -1.4 is solidly inside the mesh
    tailGroup.position.set(-1.3, 0, 0);

    // Caudal fin blade with root that extends forward into the body
    const caudalGeo = createCaudalFinGeometry(isAngler ? 1.3 : 1.7, isAngler ? 0.9 : 1.25);
    const caudal = new THREE.Mesh(caudalGeo, finMat);
    caudal.position.set(-0.6, 0, 0);
    tailGroup.add(caudal);

    // Intermediate peduncle connector mesh
    const pedGeo = new THREE.CylinderGeometry(0.08, 0.24, 0.9, 12);
    pedGeo.rotateZ(Math.PI / 2);
    pedGeo.translate(-0.35, 0, 0);
    const pedMesh = new THREE.Mesh(pedGeo, skinMat);
    tailGroup.add(pedMesh);

    group.add(tailGroup);
    group.userData.tail = tailGroup;

    // Bioluminescent Eyes (Embedded cleanly on sides of head)
    const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(bodyLength * 0.28, bodyRadius * 0.22, bodyRadius * 0.62);
    const eyeR = eyeL.clone();
    eyeR.position.z = -bodyRadius * 0.62;
    group.add(eyeL, eyeR);

    // If Angler: Glowing Lure
    if (isAngler) {
      const stalkCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, bodyRadius * 0.8, 0),
        new THREE.Vector3(0.9, bodyRadius * 1.5, 0),
        new THREE.Vector3(1.25, bodyRadius * 1.2, 0)
      ]);
      const stalkGeo = new THREE.TubeGeometry(stalkCurve, 16, 0.035, 8, false);
      const stalk = new THREE.Mesh(stalkGeo, finMat);
      group.add(stalk);

      const escaGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const esca = new THREE.Mesh(escaGeo, eyeMat);
      esca.position.set(1.25, bodyRadius * 1.2, 0);
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

    // Scene & Ocean Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020712, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 0, 19);

    // Renderer
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

    // Dynamic 3D Ocean Lighting
    const ambientLight = new THREE.AmbientLight(0x0a325e, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 2.8);
    keyLight.position.set(8, 16, 12);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x00ffa3, 2.4, 40);
    rimLight.position.set(-8, -8, 6);
    scene.add(rimLight);

    const deepLight = new THREE.PointLight(0x38bdf8, 1.8, 30);
    deepLight.position.set(0, 6, -8);
    scene.add(deepLight);

    // Spawn 3D Roaming Fishes
    const fishes = [];
    const fishConfigs = [
      { type: 'shark', count: 4, scaleBase: 0.85 },
      { type: 'angler', count: 3, scaleBase: 0.72 },
      { type: 'ray', count: 2, scaleBase: 0.8 },
      { type: 'shark', count: 5, scaleBase: 0.52 }
    ];

    // Bounding 3D Volume for wandering
    const bounds = {
      minX: -26,
      maxX: 26,
      minY: -12,
      maxY: 12,
      minZ: -16,
      maxZ: 4
    };

    const getRandomWaypoint = () => {
      return new THREE.Vector3(
        bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
        bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
        bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ)
      );
    };

    fishConfigs.forEach(({ type, count, scaleBase }) => {
      for (let i = 0; i < count; i++) {
        const fishMesh = createOrganicFish(type);

        const initialPos = getRandomWaypoint();
        fishMesh.position.copy(initialPos);

        const s = scaleBase * (0.85 + Math.random() * 0.35);
        fishMesh.scale.set(s, s, s);

        const targetPos = getRandomWaypoint();
        const speed = 0.045 + Math.random() * 0.04;

        fishMesh.userData = {
          type,
          speed,
          target: targetPos,
          wigglePhase: Math.random() * Math.PI * 2,
          wiggleSpeed: 4.0 + Math.random() * 2.5,
          nextWaypointTime: Math.random() * 6,
          turnSpeed: 0.03 + Math.random() * 0.02
        };

        scene.add(fishMesh);
        fishes.push(fishMesh);
      }
    });

    // Bioluminescent Plankton
    const particleCount = 130;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 44;
      positions[i + 1] = (Math.random() - 0.5) * 26;
      positions[i + 2] = (Math.random() - 0.5) * 22;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.13,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop with Full 3D Steering & Turning
    let animationFrameId;
    const clock = new THREE.Clock();
    const tempDir = new THREE.Vector3();
    const tempTargetLook = new THREE.Vector3();
    const targetQuaternion = new THREE.Quaternion();
    const lookMatrix = new THREE.Matrix4();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Animate 3D Roaming Fishes
      fishes.forEach((fish) => {
        const u = fish.userData;

        // Waypoint Navigation & Periodic 3D Turns
        const distToTarget = fish.position.distanceTo(u.target);
        if (distToTarget < 3.5 || elapsedTime > u.nextWaypointTime) {
          u.target = getRandomWaypoint();
          u.nextWaypointTime = elapsedTime + 7 + Math.random() * 9;
        }

        // Steer towards target waypoint in 3D
        tempDir.subVectors(u.target, fish.position).normalize();

        // Fish forward direction is +X in local space
        tempTargetLook.copy(fish.position).add(tempDir);
        lookMatrix.lookAt(fish.position, tempTargetLook, THREE.Vector3.UP || new THREE.Vector3(0, 1, 0));
        
        // Since model heads along +X, rotate coordinate system so +X faces direction
        const offsetRot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        lookMatrix.multiply(offsetRot);

        targetQuaternion.setFromRotationMatrix(lookMatrix);
        
        // Smoothly slerp fish rotation towards travel direction to showcase true 3D turns
        fish.quaternion.slerp(targetQuaternion, u.turnSpeed);

        // Move forward along current local +X orientation
        const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(fish.quaternion);
        fish.position.addScaledVector(forward, u.speed * (1 + Math.sin(elapsedTime * 2 + u.wigglePhase) * 0.2));

        // Add subtle ocean vertical undulation
        fish.position.y += Math.sin(elapsedTime * 1.2 + u.wigglePhase) * 0.008;

        // Articulated Tail Fin harmonic wiggle
        if (u.tail) {
          const tailAngle = Math.sin(elapsedTime * u.wiggleSpeed + u.wigglePhase) * 0.42;
          u.tail.rotation.y = tailAngle;
        }

        // Pectoral / Manta Wing gentle flapping
        if (u.type === 'ray') {
          if (u.wingL && u.wingR) {
            const wingFlap = Math.sin(elapsedTime * 2.8 + u.wigglePhase) * 0.28;
            u.wingL.rotation.x = wingFlap;
            u.wingR.rotation.x = -wingFlap;
          }
        } else {
          if (u.pecL && u.pecR) {
            const pecFlap = Math.sin(elapsedTime * u.wiggleSpeed + u.wigglePhase + 0.4) * 0.22;
            u.pecL.rotation.z = -0.4 + pecFlap;
            u.pecR.rotation.z = -0.4 - pecFlap;
          }
        }

        // Boundary containment
        if (fish.position.x > bounds.maxX + 4) fish.position.x = bounds.minX - 2;
        if (fish.position.x < bounds.minX - 4) fish.position.x = bounds.maxX + 2;
        if (fish.position.y > bounds.maxY + 2) fish.position.y = bounds.maxY;
        if (fish.position.y < bounds.minY - 2) fish.position.y = bounds.minY;
        if (fish.position.z > bounds.maxZ + 2) fish.position.z = bounds.maxZ;
        if (fish.position.z < bounds.minZ - 2) fish.position.z = bounds.minZ;
      });

      // Drifting Plankton Particles
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArr[i] += 0.008;
        if (posArr[i] > 13) posArr[i] = -13;
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
