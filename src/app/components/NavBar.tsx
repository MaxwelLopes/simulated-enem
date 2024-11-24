import { useRouter } from "next/navigation";
import { LogoutButton } from "../auth";
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import Link from "next/link";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

const NavBar = () => {
  const router = useRouter();

  const navigationLinks = [
    { label: "Home", path: "/" },
    { label: "Meus Simulados", path: "/simulated" },
    { label: "Novo Simulado", path: "/createSimulated" },
    { label: "Desempenho", path: "/desempenho" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="container mx-auto flex h-20 items-center px-4 md:px-6">
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-4 py-6">
              {navigationLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => router.push(link.path)}
                  className="flex w-full items-center py-3 text-xl font-bold"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logout Button */}
        <div className="mr-6">
          <LogoutButton />
        </div>

        {/* Desktop Navigation */}
        <nav className="flex gap-6">
          {navigationLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => router.push(link.path)}
              className="group inline-flex h-10 items-center justify-center rounded-md bg-white px-5 py-3 text-lg font-semibold transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Logo */}
        <Link href="/" className="ml-auto flex items-center" prefetch={false}>
          <MountainIcon className="h-8 w-8" />
          <span className="ml-2 text-xl font-bold">NextApp</span>
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
