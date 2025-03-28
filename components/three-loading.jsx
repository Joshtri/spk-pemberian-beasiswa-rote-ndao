"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"

export default function ThreeLoading({ text = "Loading..." }) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const cubesRef = useRef([])
  const frameIdRef = useRef(null)

  useEffect(() => {
    // Initialize Three.js scene
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0xf5f5f5)

    // Create camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    cameraRef.current = camera
    camera.position.z = 20

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Create directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Create cubes
    const cubes = []
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

    // Create 5 cubes with different colors
    const colors = [0x4f46e5, 0x3b82f6, 0x06b6d4, 0x10b981, 0x6366f1]

    for (let i = 0; i < 5; i++) {
      const cubeMaterial = new THREE.MeshStandardMaterial({
        color: colors[i],
        roughness: 0.5,
        metalness: 0.2,
      })

      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.x = (i - 2) * 4
      cube.position.y = 0
      scene.add(cube)
      cubes.push(cube)
    }

    cubesRef.current = cubes

    // Animation function
    const animate = () => {
      const time = Date.now() * 0.001

      cubes.forEach((cube, i) => {
        cube.rotation.x = Math.sin(time * 0.5 + i * 0.5) * 0.5
        cube.rotation.y = Math.sin(time * 0.3 + i * 0.5) * 0.5
        cube.position.y = Math.sin(time * 2 + i * 0.5) * 1.5
      })

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement)
      }

      // Dispose geometries and materials
      cubeGeometry.dispose()
      cubes.forEach((cube) => {
        if (cube.material) cube.material.dispose()
      })
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div ref={containerRef} className="w-64 h-64"></div>
      <motion.p
        className="mt-4 text-lg font-medium text-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
    </motion.div>
  )
}

