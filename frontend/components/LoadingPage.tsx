import { Loader2 } from "lucide-react"
import Image from "next/image";

export default function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold text-primary">Loading...</h1>
                <div className="flex items-center justify-center space-x-4">
                    <div className="animate-spin">
                        <Loader2 className="h-8 w-8 text-primary" />
                    </div>
                    <Image src={"/loading_cup.png"} width="50" height="50" alt="cup"  className="w-8 h-8 bg-primary animate-bounce" />
                    <Image src={"/loading_cup.png"} width="50" height="50" alt="cup"  className="w-8 h-8 bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <Image src={"/loading_cup.png"} width="50" height="50" alt="cup"  className="w-8 h-8 bg-primary animate-bounce"  style={{ animationDelay: "0.4s" }} />
                </div>
                <p className="text-muted-foreground">Your coffee is on its way...</p>
            </div>
        </div>
    )
}