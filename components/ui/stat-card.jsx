import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'

const StatCard = ({ icon, title, value, buttonText, buttonHref, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold mb-4">{value}</p>
          <Button asChild variant="primary" className="w-full">
            <a href={buttonHref}>{buttonText}</a>
          </Button>
        </CardContent>
        <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-300" />
      </Card>
    </motion.div>
  )
}


export default StatCard;