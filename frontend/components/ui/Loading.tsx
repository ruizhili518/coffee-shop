import { SpokeSpinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex items-center gap-2 h-16">
            <SpokeSpinner size="lg" />
            <span className="text-sm font-medium text-muted-foreground">
        Loading...
      </span>
        </div>
    );
}