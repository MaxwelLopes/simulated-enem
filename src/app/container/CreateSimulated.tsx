"use client";

import { disciplines } from "../constants/disciplines";
import { subjectsByDiscipline } from "../constants/subjects";
import { categoriesBySubject } from "../constants/categories";
import { useSimulatedCreate } from "../hook/simulatedCreate";
import { createSimulated } from "../service/simualationService";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SimulatedType } from "../enum/simulated";
import { SelectedItems } from "../components/SelectedItems";
import { years } from "../constants/years";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { ErrorMessage } from "../components/ui/error-message";
import { Loading } from "../components/Loading";

const CreateSimulated = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const router = useRouter();
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
  } = useSimulatedCreate();

  const simulatedTypes = Object.values(SimulatedType);

  const handleClick = async () => {
    const userId = user ? user.id : null;
    if (userId) {
      setLoading(true);
      const success = await createSimulated({
        typeOfSimulated,
        questionCount,
        error,
        unseen,
        review,
        subtypes,
        userId,
      });

      setLoading(false);
      if (success) router.push("/simulated");
      else {
        setError("Não foi possível criar um simulado com essa combinação!");
      }
    }
  };

  const handleSelectChange = (value: string) => {
    if (!subtypes.includes(value)) {
      setSubtype([...subtypes, value]);
    }
  };

  const handleRemoveSubType = (subtype: string) => {
    setSubtype(subtypes.filter((item) => item !== subtype));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-3xl bg-white shadow-lg rounded-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-3xl font-semibold text-gray-800 text-center">
            Criar Simulado
          </CardTitle>
        </CardHeader>
        {loading ? (
          <Loading />
        ) : (
          <CardContent className="p-6 space-y-6">
            {/* Filtro */}
            <div className="space-y-4">
              <Label
                htmlFor="simulatedType"
                className="text-gray-700 font-medium"
              >
                Filtro
              </Label>
              <Select
                onValueChange={(value) => {
                  setTypeOfSimulated(value);
                  setSubtype([]);
                }}
              >
                <SelectTrigger id="simulatedType" className="w-full">
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

            {/* Area de estudo */}
            {typeOfSimulated === "Área de estudo" && (
              <div className="space-y-4">
                <Label htmlFor="year" className="text-gray-700 font-medium">
                  Área de estudo
                </Label>
                <Select onValueChange={(value) => setSubtype([value])}>
                  <SelectTrigger id="year" className="w-full">
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
            {typeOfSimulated === "Ano" && (
              <div className="space-y-4">
                <Label htmlFor="year" className="text-gray-700 font-medium">
                  Ano
                </Label>
                <Select onValueChange={(value) => setSubtype([value])}>
                  <SelectTrigger id="year" className="w-full">
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

            {/* Matéria ou Tópico */}
            {(typeOfSimulated === "Matéria" ||
              typeOfSimulated === "Tópico") && (
              <div className="space-y-4">
                <Label
                  htmlFor="subjectOrTopic"
                  className="text-gray-700 font-medium"
                >
                  {typeOfSimulated}
                </Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger id="subjectOrTopic" className="w-full">
                    <SelectValue
                      placeholder={`Selecione ${
                        typeOfSimulated === "Matéria" ? "a matéria" : "o tópico"
                      }`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOfSimulated === SimulatedType.CATEGOTY && (
                      <SelectGroup>
                        {Object.keys(categoriesBySubject).map((subject) => (
                          <SelectGroup>
                            <SelectLabel>{subject}</SelectLabel>
                            {categoriesBySubject[subject].map((category) => (
                              <SelectItem value={category}>
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
                          <SelectGroup>
                            <SelectLabel>{discipline}</SelectLabel>
                            {subjectsByDiscipline[discipline].map((subject) => (
                              <SelectItem value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
                <SelectedItems
                  subtypes={subtypes}
                  handleRemoveSubType={handleRemoveSubType}
                />
              </div>
            )}

            {/* Quantidade de Questões */}
            <div className="space-y-4">
              <Label
                htmlFor="questionCount"
                className="text-gray-700 font-medium"
              >
                Quantidade de Questões
              </Label>
              <Input
                id="questionCount"
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                min={1}
                max={2700}
                className="w-full"
              />
            </div>

            {/* Opções de Questões */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="unseen"
                  checked={unseen}
                  onCheckedChange={(checked) => {
                    setUnseen(checked as boolean);
                    if (checked) setReview(false);
                  }}
                />
                <Label htmlFor="unseen" className="text-gray-600">
                  Questões Inéditas
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="review"
                  checked={review}
                  onCheckedChange={(checked) => {
                    setReview(checked as boolean);
                    if (checked) setUnseen(false);
                  }}
                />
                <Label htmlFor="review" className="text-gray-600">
                  Revisar Questões que Errou
                </Label>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && <ErrorMessage title="Erro!" message={error} />}

            {/* Botão */}
            <Button
              onClick={handleClick}
              className="w-full"
            >
              Criar Simulado
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CreateSimulated;
