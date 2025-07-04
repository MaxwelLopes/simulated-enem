"use client"
import { useRouter } from "next/navigation"
import { LogoutButton } from "../auth"
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/sheet"
import { Button } from "../components/ui/button"
import { ClipboardCheck, Menu } from "lucide-react"
import { useState } from "react"
import { Loading } from "./Loading"

const NavBar = () => {
  const router = useRouter()

  const navigationLinks = [
    { label: "Página Inicial", path: "/" },
    { label: "Meus Simulados", path: "/simulated" },
    { label: "Novo Simulado", path: "/createSimulated" },
    { label: "Desempenho", path: "/desempenho" },
  ]

  const [loading, setLoading] = useState(false);

  const handleNavigation = async (path: string) => {
    setLoading(true);
    await router.push(path);
  };

  return (
    <>

      {loading && (<Loading />)}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-10 w-10 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800 hidden sm:inline-block">SimuLab</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                onClick={() => handleNavigation(link.path)}
                className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium text-lg px-5 py-6"
              >
                {link.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Logout Button - Visível apenas em desktop */}
            <div className="hidden lg:block">
              <LogoutButton />
            </div>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden border-gray-200 h-12 w-12">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu de navegação</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <ClipboardCheck className="h-8 w-8 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-800">Simulador ENEM</span>
                  </div>

                  <div className="grid gap-2">
                    {navigationLinks.map((link) => (
                      <Button
                        key={link.label}
                        variant="ghost"
                        onClick={() => {
                          router.push(link.path)
                          document
                            .querySelector('[data-state="open"]')
                            ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
                        }}
                        className="justify-start text-xl font-medium w-full py-3"
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>

                  {/* Logout Button dentro do menu mobile */}
                  <div className="mt-auto pt-6 border-t border-gray-200">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500 px-4">Conta</p>
                      {/* Logout Button */}
                      <div className="ml-auto lg:ml-0 lg:mr-6">
                        <LogoutButton />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}

export default NavBar
