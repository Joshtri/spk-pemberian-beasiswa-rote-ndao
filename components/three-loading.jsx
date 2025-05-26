"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
import { motion } from "framer-motion"

export default function ThreeLoading({ text }) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const cubesRef = useRef([])
  const frameIdRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Transparent background
    scene.background = null

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 20
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(ambientLight, directionalLight)

    // Create cubes
    const cubes = []
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
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

      // GSAP intro animation
      gsap.fromTo(
        cube.rotation,
        { x: 0, y: 0 },
        {
          x: Math.PI * 2,
          y: Math.PI * 2,
          duration: 2,
          delay: i * 0.1,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      )
    }

    cubesRef.current = cubes

    // Animation loop
    const animate = () => {
      const time = Date.now() * 0.001

      // Update cube position in wave
      cubes.forEach((cube, i) => {
        cube.position.y = Math.sin(time * 2 + i * 0.5) * 1.5
      })

      // Subtle camera motion
      camera.position.z = 20 + Math.sin(time * 0.5) * 0.5
      camera.rotation.y = Math.sin(time * 0.2) * 0.01

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Resize handling
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
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current)
      if (rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement)
      }
      cubeGeometry.dispose()
      cubes.forEach((cube) => cube.material.dispose())
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div ref={containerRef} className="w-64 h-64 relative" />
      <motion.p
        className="mt-6 text-xl font-semibold text-indigo-700 tracking-wide"
        animate={{
          y: [0, -4, 0],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  )
}
