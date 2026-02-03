import { cn } from "@/lib/utils";
import { LoadingIcon } from "@/lib/icons";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoadingIcon
      role="status"
      aria-label="Loading"
      className={cn("size-8 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
