import { Outlet, createRootRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { RabbitAnimationStyles } from "@/components/rabbit-mascot";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const isWelcomePage = currentPath === "/welcome";

  // Redirect to /welcome once, on cold start, if the app didn't open there
  // (e.g. a deep link). This must NOT re-fire on every navigation - it
  // previously depended on `currentPath` and ran on every path change,
  // which meant leaving /welcome via any route (including the "Let's go!"
  // button on the welcome screen itself) got immediately bounced back
  // here, trapping every user on the welcome screen permanently.
  const hasCheckedInitialRoute = useRef(false);

  useEffect(() => {
    if (hasCheckedInitialRoute.current) return;
    hasCheckedInitialRoute.current = true;

    if (currentPath !== "/welcome") {
      navigate({ to: "/welcome" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RabbitAnimationStyles />
      <div className="min-h-dvh pt-12 bg-background pb-24">
        {!isWelcomePage && (
          <nav>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-2 text-2xl font-black hover:opacity-80"
                >
                  baajit
                </Link>
              </div>
            </div>
          </nav>
        )}
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
    </>
  );
}
