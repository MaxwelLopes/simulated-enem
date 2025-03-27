import { Essay } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import TextFormatter from "./ui/utils"

export const EssayPresentation = ({ essay }: { essay: Essay }) => {
    return <>
        <div className="max-w-4xl mx-auto p-4 space-y-6 mb-8 mt-20 mb-20">
            <Card className="border-2 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-center text-xl text-primary">
                        PROPOSTA DE REDAÇÃO
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-medium text-center text-justify py-2">
                        Com base na leitura dos textos motivadores seguintes e nos
                        conhecimentos construídos ao longo de sua formação, redija texto
                        dissertativo-argumentativo em norma culta escrita da língua
                        portuguesa sobre o tema <strong>{essay?.theme}</strong>,
                        apresentando proposta de ação social, que respeite os direitos
                        humanos. Selecione, organize e relacione coerentemente
                        argumentos e fatos para defesa de seu ponto de vista.
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader className="pb-2 border-b">
                    <CardTitle className="text-lg flex items-center">
                        <div className="w-1 h-5 bg-primary mr-2 rounded-full"></div>
                        Textos Motivadores
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {essay?.motivationalTexts.map((text: string, index: number) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-center mb-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mr-2">
                                        {index + 1}
                                    </span>
                                    <p className="text-sm font-medium text-gray-500">
                                        Texto {index + 1}
                                    </p>
                                </div>
                                <TextFormatter text={text} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div >
    </>
}
