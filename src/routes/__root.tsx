import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { BottomNavigation } from "@/components/bottom-navigation";
import { RabbitAnimationStyles } from "@/components/rabbit-mascot";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <RabbitAnimationStyles />
      <div className="min-h-dvh pt-12 bg-background pb-24">
        <nav>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center gap-2 px-2 text-2xl font-black hover:opacity-80"
              >
                nibble
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
