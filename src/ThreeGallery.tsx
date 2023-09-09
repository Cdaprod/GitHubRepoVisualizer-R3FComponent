import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeGallery: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    );
    wall.position.set(0, 5, -10);
    scene.add(wall);

    fetch('https://api.github.com/users/YOUR_USERNAME/gists')
      .then(response => response.json())
      .then(gists => {
        gists.forEach((gist: any, index: number) => {
          const texture = new THREE.TextureLoader().load(`https://via.placeholder.com/150?text=${gist.description}`);
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const geometry = new THREE.PlaneGeometry(2, 2);
          const portrait = new THREE.Mesh(geometry, material);
          portrait.position.set(index * 3 - gists.length * 1.5, 5, -8);
          portrait.name = gist.description;  // Storing the description in the name for later use
          scene.add(portrait);
        });
      });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.material.color.set(0xffffff);
        }
      });

      if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
        const intersectedObject = intersects[0].object;
        intersectedObject.material.color.set(0x00ff00);
      }
    }

    function onMouseClick(event: MouseEvent) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        alert('Gist Description: ' + intersectedObject.name);
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default ThreeGallery;
