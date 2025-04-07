import { Skeleton } from "@components/ui/skeleton";

function LoadingPage() {
    return (
      <div className="px-6 w-full h-full">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-[60%] mb-6" />
            <Skeleton className="h-10 w-20 mb-4" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>

          <div className="border-t pt-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
      </div>
    );
}

export default LoadingPage;