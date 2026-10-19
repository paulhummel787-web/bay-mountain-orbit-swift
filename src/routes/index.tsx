import { createFileRoute } from "@tanstack/react-router";
import BeeWellApp from "@/bee/BeeWellApp";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  return <BeeWellApp />;
}
