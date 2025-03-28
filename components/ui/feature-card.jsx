'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function FeatureCard({ icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-2">
          <motion.div
            className="text-primary"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-300" />
      </Card>
    </motion.div>
  )
}
