import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <main 
      className={cn("flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden", className)} 
      {...props}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        {children}
      </div>
    </main>
  );
}
