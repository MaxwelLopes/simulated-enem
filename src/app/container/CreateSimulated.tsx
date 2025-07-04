"use client"

import { disciplines } from "../constants/disciplines"
import { subjectsByDiscipline } from "../constants/subjects"
import { categoriesBySubject } from "../constants/categories"
import { useSimulatedCreate } from "../hook/simulatedCreate"
import { createSimulated } from "../service/simualationService"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { SimulatedType } from "../enum/simulated"
import { SelectedItems } from "../components/SelectedItems"
import { years } from "../constants/years"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { ErrorMessage } from "../components/ui/error-message"
import { Loading } from "../components/Loading"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { dayOne, dayTwo } from "../constants/enem"

const CreateSimulated = () => {
  const { data: session } = useSession()
  const user = session?.user

  const router = useRouter()
  const {
    typeOfSimulated,
    questionCount,
    error,
    unseen,
    review,
    subtypes,
    setTypeOfSimulated,
    setQuestionCount,
    setError,
    setUnseen,
    setReview,
    setSubtype,
    loading,
    setLoading,
    essay,
    setEssay,
    nonInepEssay,
    setNonInepEssay,
    isDayOne,
    setIsDayOne,
    isDayTwo,
    setIsDayTwo,
    language,
    setLanguage,
  } = useSimulatedCreate()

  const simulatedTypes = Object.values(SimulatedType)

const handleClick = async () => {
  const userId = user?.id;
  if (!userId) return;

  setLoading(true);
  setError(""); // limpa erro anterior, se houver

  try {
    const createdSimulated = await createSimulated({
      typeOfSimulated,
      questionCount,
      error,
      unseen,
      review,
      subtypes,
      userId,
      nonInepEssay,
      isDayOne,
      isDayTwo,
      language,
    });

    if (createdSimulated?.success) {
      // Aguarda navegação antes de remover loading
      await router.push(`/simulated/${createdSimulated.id}`);
    } else {
      setError(createdSimulated?.message ?? "Erro desconhecido ao criar simulado.");
      setLoading(false);
    }
  } catch (err) {
    console.error("Erro ao criar simulado:", err);
    setError("Erro inesperado. Tente novamente.");
    setLoading(false);
  }
};

  const handleSelectChange = (value: string) => {
    if (!subtypes.includes(value)) {
      setSubtype([...subtypes, value])
    }
  }

  const handleRemoveSubType = (subtype: string) => {
    setSubtype(subtypes.filter((item) => item !== subtype))
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-gray-100 min-h-screen p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-lg rounded-lg border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-semibold text-center">Criar Simulado</CardTitle>
          <p className="text-white/80 text-center text-sm">Configure as opções para o seu simulado personalizado</p>
        </CardHeader>

        <CardContent className="p-6 space-y-5 bg-white">
          {/* Filtro */}
          <div className="space-y-3">
            <Label htmlFor="simulatedType" className="text-gray-700 font-medium">
              Filtro
            </Label>
            <Select
              onValueChange={(value) => {
                setTypeOfSimulated(value)
                setSubtype([])
              }}
            >
              <SelectTrigger id="simulatedType" className="w-full border-indigo-200 focus:ring-indigo-500">
                <SelectValue placeholder="Selecione o tipo de simulado" />
              </SelectTrigger>
              <SelectContent>
                {simulatedTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Área de estudo */}
          {typeOfSimulated === SimulatedType.DISCIPLINE && (
            <div className="space-y-3">
              <Label htmlFor="year" className="text-gray-700 font-medium">
                Área de estudo
              </Label>
              <Select onValueChange={(value) => setSubtype([value])}>
                <SelectTrigger id="year" className="w-full border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder="Selecione a área de estudo" />
                </SelectTrigger>
                <SelectContent>
                  {disciplines.map((discipline) => (
                    <SelectItem key={discipline} value={discipline}>
                      {discipline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Ano */}
          {typeOfSimulated === SimulatedType.YEAR && (
            <div className="space-y-3">
              <Label htmlFor="year" className="text-gray-700 font-medium">
                Ano
              </Label>
              <Select onValueChange={(value) => setSubtype([value])}>
                <SelectTrigger id="year" className="w-full border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Redação */}
          {typeOfSimulated === SimulatedType.ESSAY && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-2 block text-gray-700">
                  Como você deseja selecionar o tema?
                </Label>
                <RadioGroup
                  value={essay}
                  onValueChange={(value) => {
                    setEssay(value as "specific" | "random")
                    setSubtype([value])
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="specific"
                      id="specific"
                      onClick={() => setNonInepEssay(false)}
                      className="text-indigo-600 border-indigo-400"
                    />
                    <Label htmlFor="specific" className="cursor-pointer text-gray-700">
                      Escolher um ano específico
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="random"
                      id="random"
                      onClick={() => setNonInepEssay(true)}
                      className="text-indigo-600 border-indigo-400"
                    />
                    <Label htmlFor="random" className="cursor-pointer text-gray-700">
                      Opção aleatória gerada por IA
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {essay === "specific" ? (
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-gray-700 font-medium">
                    Ano
                  </Label>
                  <Select onValueChange={(value) => setSubtype([value])}>
                    <SelectTrigger id="year" className="w-full border-indigo-200 focus:ring-indigo-500">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
                  <p className="text-indigo-800 text-sm">
                    O tema será gerado de forma aleatória por inteligência artificial.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Matéria ou Tópico */}
          {(typeOfSimulated === "Matéria" || typeOfSimulated === "Tópico") && (
            <div className="space-y-3">
              <Label htmlFor="subjectOrTopic" className="text-gray-700 font-medium">
                {typeOfSimulated}
              </Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="subjectOrTopic" className="w-full border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder={`Selecione ${typeOfSimulated === "Matéria" ? "a matéria" : "o tópico"}`} />
                </SelectTrigger>
                <SelectContent>
                  {typeOfSimulated === SimulatedType.CATEGOTY && (
                    <SelectGroup>
                      {Object.keys(categoriesBySubject).map((subject) => (
                        <SelectGroup key={subject}>
                          <SelectLabel>{subject}</SelectLabel>
                          {categoriesBySubject[subject].map((category) => (
                            <SelectItem value={category} key={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectGroup>
                  )}
                  {typeOfSimulated === SimulatedType.SUBJECT && (
                    <SelectGroup>
                      {Object.keys(subjectsByDiscipline).map((discipline) => (
                        <SelectGroup key={discipline}>
                          <SelectLabel>{discipline}</SelectLabel>
                          {subjectsByDiscipline[discipline].map((subject) => (
                            <SelectItem value={subject} key={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <SelectedItems subtypes={subtypes} handleRemoveSubType={handleRemoveSubType} />
            </div>
          )}

          {/* ENEM */}
          {typeOfSimulated === SimulatedType.ENEM && (
            <>
              <div className="space-y-4 bg-indigo-50 p-4 rounded-md border border-indigo-100">
                <h3 className="font-medium text-indigo-800">Selecione o dia do exame:</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="day-one"
                    checked={isDayOne}
                    onCheckedChange={(checked) => {
                      setIsDayOne(checked as boolean)
                      if (checked) setIsDayTwo(false)
                    }}
                    className="text-indigo-600 border-indigo-400"
                  />
                  <Label htmlFor="day-one" className="text-gray-700 font-medium cursor-pointer">
                    Primeiro dia
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="day-two"
                    checked={isDayTwo}
                    onCheckedChange={(checked) => {
                      setIsDayTwo(checked as boolean)
                      if (checked) setIsDayOne(false)
                    }}
                    className="text-indigo-600 border-indigo-400"
                  />
                  <Label htmlFor="day-two" className="text-gray-700 font-medium cursor-pointer">
                    Segundo dia
                  </Label>
                </div>
              </div>

              <div className="mt-4">
                <SelectedItems subtypes={isDayOne ? dayOne : isDayTwo ? dayTwo : []} />
              </div>

              {isDayOne && (
                <div className="space-y-3 bg-indigo-50 p-4 rounded-md border border-indigo-100">
                  <Label htmlFor="language" className="text-indigo-800 font-medium block mb-2">
                    Escolha o idioma
                  </Label>
                  <RadioGroup
                    value={language}
                    onValueChange={(value) => setLanguage(value as "english" | "spanish")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="english" id="english" className="text-indigo-600 border-indigo-400" />
                      <Label htmlFor="english" className="cursor-pointer text-gray-700">
                        Inglês
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spanish" id="spanish" className="text-indigo-600 border-indigo-400" />
                      <Label htmlFor="spanish" className="cursor-pointer text-gray-700">
                        Espanhol
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </>
          )}

          {/* Quantidade de Questões */}
          {typeOfSimulated !== SimulatedType.ESSAY && typeOfSimulated !== SimulatedType.ENEM && (
            <>
              <div className="space-y-3">
                <Label htmlFor="questionCount" className="text-gray-700 font-medium">
                  Quantidade de Questões
                </Label>
                <Input
                  id="questionCount"
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  min={1}
                  max={180}
                  className="w-full border-indigo-200 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-3 bg-indigo-50 p-4 rounded-md border border-indigo-100">
                <h3 className="font-medium text-indigo-800 mb-2">Opções adicionais:</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unseen"
                    checked={unseen}
                    onCheckedChange={(checked) => {
                      setUnseen(checked as boolean)
                      if (checked) setReview(false)
                    }}
                    className="text-indigo-600 border-indigo-400"
                  />
                  <Label htmlFor="unseen" className="text-gray-700">
                    Questões Inéditas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="review"
                    checked={review}
                    onCheckedChange={(checked) => {
                      setReview(checked as boolean)
                      if (checked) setUnseen(false)
                    }}
                    className="text-indigo-600 border-indigo-400"
                  />
                  <Label htmlFor="review" className="text-gray-700">
                    Revisar Questões que Errou
                  </Label>
                </div>
              </div>
            </>
          )}

          {/* Mensagem de Erro */}
          {error && <ErrorMessage title="Erro!" message={error} />}

          {/* Botão */}
          <Button onClick={handleClick} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-6">
            Criar Simulado
          </Button>
        </CardContent>
        {loading && <Loading />}
      </Card>
    </div>
  )
}

export default CreateSimulated
