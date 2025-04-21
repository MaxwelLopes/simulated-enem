import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface IntroductionEssayProps {
    handleClick: (value: boolean) => void;
}

export const IntroductionEssay = ({ handleClick }: IntroductionEssayProps) => {
    return (
        <div className="container mx-auto py-8 max-w-3xl mt-20">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Instruções para Redação
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">
                            Leia o Tema e os Textos Motivadores
                        </h3>
                        <p>
                            O tema da redação e os textos motivadores serão disponibilizados. Utilize-os como referência para estruturar sua argumentação de forma coerente e fundamentada.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Redija o Texto Manualmente</h3>
                        <p>
                            Utilize uma folha de redação ou papel adequado para escrever seu texto à mão, seguindo a estrutura dissertativo-argumentativa exigida pelo ENEM.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Gerencie o Tempo</h3>
                        <p>
                            Acompanhe o cronômetro para simular as condições reais de uma prova e organizar sua escrita dentro do tempo disponível.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Transcreva o Texto</h3>
                        <p>
                            Ao concluir a redação, clique em &ldquo;Finalizar&rdquo; para avançar para a próxima etapa. Nessa fase, você deverá digitar o texto exatamente como foi escrito à mão, sem alterações ou correções.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Envio e Correção Automática</h3>
                        <p>
                            Após a transcrição, envie a redação para correção. O texto será avaliado por um sistema de Inteligência Artificial, que analisará a estrutura, argumentação e outros critérios conforme os padrões exigidos.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-4">
                    <Button
                        size="lg"
                        className="px-8 py-6 text-lg font-medium"
                        onClick={() => handleClick(false)}
                    >
                        Ir para Redação
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}