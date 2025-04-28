"use client"

import { Loading } from "@/app/components/Loading"
import { useRouter } from "next/navigation"
import { useSimulateds } from "../hook/simulateds"
import { Skeleton } from "../components/ui/skeleton"
import { SimulatedItem } from "../components/ui/SimulatedItem"
import { Button } from "../components/ui/button"
import type { Simulated } from "@prisma/client"
import { SimulatedStatus, SimulatedType } from "../enum/simulated"

const SimulatedList = () => {
  const router = useRouter()
  const { simulatedList, setLoading, loading } = useSimulateds()

  const handleSelectSimulated = (id: string, simulated: Simulated) => {
    setLoading(true)
    if (simulated.type === SimulatedType.ESSAY && simulated.status !== SimulatedStatus.PENDING) {
      router.push(`/simulationResult/${id}`)
    } else {
      router.push(`/simulated/${id}`)
    }
    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-8 px-6 rounded-xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold">Meus Simulados</h1>
          <p className="text-white/80 mt-2">Gerencie e acesse seus simulados</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="aspect-[4/3] w-full rounded-md" />
            ))}
          </div>
        ) : (
          <>
            {simulatedList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {simulatedList
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((simulated) => (
                    <SimulatedItem key={simulated.id} simulated={simulated} onSelect={handleSelectSimulated} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed rounded-lg bg-white shadow-md">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Nenhum simulado encontrado</h2>
                <p className="text-gray-500 mt-2 mb-6">Crie seu primeiro simulado clicando no botão abaixo.</p>
                <Button
                  onClick={() => {
                    router.push("/createSimulated")
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2"
                >
                  Criar Simulado
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SimulatedList
