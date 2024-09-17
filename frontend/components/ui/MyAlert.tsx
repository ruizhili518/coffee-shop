import { Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export default function MyAlert({ isVisible , title, desc }:{isVisible: boolean , title: string, desc: string}) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                    className="fixed top-8 left-0 right-0 mx-auto z-50 w-full max-w-sm"
                >
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>{title}</AlertTitle>
                        <AlertDescription>
                            {desc}
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    )
}