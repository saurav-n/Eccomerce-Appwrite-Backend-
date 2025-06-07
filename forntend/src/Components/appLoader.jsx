import { Loader } from "lucide-react"

export default function AppLoader(){
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="animate-spin"/>
        </div>
    )
}