"use server";

import { SimulatedStatus } from "../enum/simulated";
import { generateText } from "../integrations/openAi";
import {
  createEssay as createEssayInRepository,
  createEssayScore,
  findEssayById,
} from "../repositories/essayRepository";
import {
  findEssayBySimulatedId,
  updateSimulated,
} from "../repositories/simulatedRepository";
import { finishSimulation, getSimulatedById } from "./simualationService";

export const generateTheme = async () => {
  const role = "INEP";
  const prompt = `
Você é o INEP e sua tarefa é criar um tema de redação para o ENEM. O tema deve ser **original, relevante e instigante**, voltado para o contexto brasileiro contemporâneo. Ele deve **exigir reflexão crítica**, com múltiplas dimensões de análise (social, cultural, política, ética, ambiental, econômica etc.).

**Restrições importantes:**
- NÃO repita temas comuns a menos que tragam uma abordagem realmente inusitada e provocadora.
- NÃO utilize variações superficiais de temas anteriores.
- Evite repetir estrutura nos textos motivadores (varie os estilos: narração de caso, citação, dado estatístico, reflexão filosófica, opinião de especialista, etc.).

**Critérios obrigatórios do tema:**
- Originalidade e inovação.
- Capacidade de gerar debate entre diferentes pontos de vista.

Além disso, elabore **três textos motivadores** que:
1. Contextualizem o tema de maneira clara e envolvente, tocando em questões relevantes do cenário atual.
2. Apresentem perspectivas contrastantes sobre o assunto, desafiando os candidatos a refletirem sobre diferentes pontos de vista.
3. Estimulem a análise crítica e a construção de argumentos profundos, levando em conta as implicações sociais, econômicas e culturais.
4. Sejam inspiradores, formais e detalhados, com no mínimo 5 a 6 frases, para provocar a reflexão de forma eficaz.

O tema deve ser algo que gere discussões complexas e ideias que desafiem os estudantes a pensar além do óbvio. Evite temas excessivamente simples ou já muito abordados.

Retorne **apenas** um JSON válido, sem explicações adicionais, com as seguintes chaves:
- "theme": O tema da redação proposto.
- "motivationalTexts": Uma lista contendo os três textos motivadores.

Exemplo:
{
  "theme": "Tema criativo e inovador",
  "motivationalTexts": [
    "Texto motivador I, com uma introdução envolvente sobre o tema, destacando questões sociais e culturais.",
    "Texto motivador II, apresentando diferentes perspectivas sobre o impacto do tema, levando a uma análise crítica profunda.",
    "Texto motivador III, concluindo com uma reflexão que desafia os candidatos a propor soluções criativas e éticas."
  ]
}`;

  const temperature = 1;
  try {
    const text = await generateText({ role, prompt, temperature });
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsedTheme = JSON.parse(cleanedText);

    return parsedTheme as { theme: string; motivationalTexts: string[] };
  } catch (error) {
    console.error("Erro ao gerar tema:", error);
    throw new Error("Falha ao processar a resposta do modelo.");
  }
};

export const checkEssayZero = async (essay: string, theme: string) => {
  const role = "INEP";
  const prompt = `Você é um corretor oficial do INEP e sua tarefa é determinar se a redação deve ser anulada com base nos critérios do ENEM.

**Tema da Redação**: "${theme}"
**Texto da Redação**: "${essay}"

Avalie criteriosamente se a redação se enquadra em alguma das seguintes situações de anulação:
- *Fuga total ao tema.*
- *Não atendimento ao gênero dissertativo-argumentativo.*
- *Desrespeito aos direitos humanos.*
- *Texto totalmente desconexo, ilegível ou sem sentido.*
- *Folha em branco.*

Se a redação for anulada, explique o motivo de forma objetiva.

Retorne **apenas** um JSON válido no seguinte formato, sem explicações adicionais:
{
  "zerada": true ou false,
  "motivo": "Motivo exato e detalhado pelo qual a redação foi zerada (se aplicável)."
}`;

  const temperature = 0;
  try {
    const response = await generateText({ role, prompt, temperature });
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Erro ao processar a resposta do modelo:", error);
    throw new Error(
      "Falha ao analisar a resposta gerada. Verifique o formato do JSON."
    );
  }
};

export const evaluateCompetency = async (
  essay: string,
  theme: string,
  competency: string,
  description: string
) => {
  const role = "INEP";
  const prompt = `Você é um corretor oficial do INEP e sua função é avaliar com o máximo de rigor a competência indicada na redação do ENEM.

**Tema da redação**: "${theme}"  
**Redação**: "${essay}"

**Competência Avaliada**: ${competency}  
**Descrição**: ${description}

**Instruções de Avaliação**:
- A competência deve ser avaliada em uma escala de **0 a 200 pontos**.
- A pontuação **deve ser atribuída exclusivamente em múltiplos de 20**: 0, 20, 40, 60, 80, 100, 120, 140, 160, 180 ou 200.
- **Não são permitidos valores intermediários** (por exemplo, 150 ou 170).
- **Desconte pontos de 20 em 20**, conforme a gravidade e a frequência das falhas identificadas no texto. Não são permitidos descontos menores que 20 pontos.
- A nota deve ser rigorosamente justificada com base nos critérios estabelecidos na descrição da competência.
- Na justificativa, explique de forma clara e detalhada:
  - Quais critérios foram atendidos e quais foram violados.
  - Trechos específicos da redação que demonstram o atendimento ou a violação dos critérios.
  - A relação entre as falhas identificadas e os descontos de pontos aplicados.

**Formato de resposta obrigatório (JSON válido)**:
Sua resposta deve conter **apenas** um JSON válido, sem nenhum texto ou comentário adicional.  
O JSON deve ter a seguinte estrutura:
{
  "justificativa": "Justificativa detalhada, explicando os critérios utilizados para a atribuição da nota, incluindo exemplos do texto sempre que necessário.",
  "nota": 0 // A nota deve ser um múltiplo de 20, entre 0 e 200.
}

Responda com apenas o JSON, sem quaisquer explicações ou formatação extra.`;

  const temperature = 0;
  const response = await generateText({ role, prompt, temperature });
  const cleanedResponse = response.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanedResponse);
};

export const createEssay = async (
  theme: string,
  motivationalTexts: string[]
) => {
  const essay = await createEssayInRepository(theme, motivationalTexts);
  return essay;
};

export const evalueEssay = async (
  simulatedId: string,
  simulationStatus: string,
  essay: string,
  theme: string
) => {
  if (simulationStatus !== SimulatedStatus.PENDING) {
    throw new Error("Redação não pode ser avaliada nesse status.");
  }
  updateSimulated({
    simulatedId,
    status: SimulatedStatus.CORRECTING_ESSAY,
    userText: essay,
  });
  const zeroEvaluation = await checkEssayZero(essay, theme);
  if (zeroEvaluation.zerada) {
    await createEssayScore(
      "Redação zerada",
      0,
      zeroEvaluation.motivo,
      simulatedId
    );
    updateSimulated({
      simulatedId,
      status: SimulatedStatus.COMPLETED,
      essayScore: 0,
    });
    finishSimulation(simulatedId);
    return { message: "Redação anulada", motivo: zeroEvaluation.motivo };
  }

  const competencies = [
    {
      name: "Domínio da escrita formal da língua portuguesa",
      description:
        "Avalie se o candidato demonstra pleno domínio da norma culta da língua escrita, considerando: - Uso preciso da ortografia, incluindo acentuação gráfica e grafia correta de todas as palavras, sem desvios, ainda que sutis. Erros ortográficos reiterados ou em palavras de uso comum devem ser severamente penalizados. - Aplicação rigorosa da pontuação (vírgulas, pontos finais, travessões, parênteses, dois pontos, ponto e vírgula), assegurando clareza e coesão. Uso inadequado que comprometa a interpretação do texto deve gerar penalização significativa. - Concordância verbal e nominal absolutamente correta, sem desvios, mesmo que ocasionais. - Regência verbal e nominal adequada, evitando usos coloquiais ou incoerências. - Ausência de vícios gramaticais, como pleonasmos viciosos, cacofonias, gerundismos, ambiguidades estruturais e construções truncadas. - Estrutura sintática fluida e bem organizada, sem fragmentação de períodos ou falta de paralelismo. Cada erro identificado deve impactar a nota proporcionalmente à sua frequência e gravidade. Um grande número de desvios compromete significativamente a pontuação.",
    },
    {
      name: "Compreensão do tema",
      description:
        "Verifique se o candidato compreende o tema proposto de maneira crítica e aprofundada, analisando detalhadamente cada palavra-chave e os conceitos presentes no enunciado, considerando: - Se o candidato desconstrói o tema, refletindo sobre o significado intrínseco de cada termo e as possíveis implicações que esses conceitos podem gerar em contextos sociais, culturais, históricos e políticos. - Se há uma análise minuciosa e crítica dos elementos centrais, demonstrando a capacidade de ir além da simples definição literal e explorando as inter-relações, ambiguidades e desafios implícitos no enunciado. - Se o candidato articula, de forma coerente e fundamentada, como os termos se interconectam e provocam impactos ou transformações, evitando interpretações superficiais e generalizações. - Se a abordagem é original e revela uma compreensão abrangente, contextualizando o tema de forma a evidenciar sua complexidade e as múltiplas perspectivas que ele pode envolver. A ausência de uma análise crítica ou uma abordagem meramente descritiva e simplista deve ser severamente penalizada.",
    },
    {
      name: "Seleção e organização de argumentos",
      description:
        "Analise se o candidato seleciona, organiza e interpreta informações, fatos e argumentos de forma estruturada e persuasiva, considerando: - Se os argumentos são fundamentados, pertinentes e articulados de maneira lógica, evitando afirmações sem embasamento ou generalizações superficiais. - Se há um encadeamento progressivo e coerente das ideias, garantindo a coesão argumentativa e a ausência de contradições ou falhas na transição entre pontos. - Se a argumentação revela uma análise crítica que integra diferentes perspectivas, demonstrando profundidade e originalidade na abordagem do tema. - Se existe uma relação clara e lógica entre os argumentos apresentados e a conclusão proposta, evidenciando como cada ponto contribui para a defesa da tese central. Argumentos fragmentados, ilógicos ou desconectados devem ser rigorosamente penalizados.",
    },
    {
      name: "Coesão textual",
      description:
        "Avalie se o candidato emprega mecanismos coesivos de maneira adequada e eficaz, garantindo fluidez e conexão entre as partes do texto, considerando: - Uso variado e pertinente de conectivos para garantir a articulação lógica entre as ideias. O uso mecânico ou repetitivo deve ser penalizado. - Estruturação dos parágrafos com encadeamento progressivo e unidade temática. - Emprego correto de pronomes, elipses e substituições lexicais para evitar repetições excessivas ou imprecisão referencial. - Uso de transições adequadas entre frases e parágrafos, assegurando continuidade e coesão global. Falhas graves de coesão que dificultem a compreensão do texto comprometem significativamente a nota.",
    },
    {
      name: "Elaboração de proposta de intervenção",
      description:
        "Verifique se o candidato apresenta uma proposta de intervenção detalhada, realista e bem estruturada para solucionar o problema abordado, considerando: - Se a proposta está diretamente relacionada ao tema e fundamentada nos argumentos desenvolvidos. - Se apresenta os cinco elementos essenciais: ação, agente, meio de implementação, efeito esperado e detalhamento suficiente. Propostas que omitem elementos fundamentais devem ser penalizadas. - Se respeita os direitos humanos, evitando propostas excludentes, discriminatórias ou inviáveis. - Se a proposta demonstra reflexão crítica e está alinhada à problemática discutida no texto. A ausência de proposta de intervenção resulta em pontuação zero neste critério.",
    },
  ];

  let essayScore = 0;
  for (const { name, description } of competencies) {
    const evaluation = await evaluateCompetency(
      essay,
      theme,
      name,
      description
    );
    await createEssayScore(
      name,
      evaluation.nota,
      evaluation.justificativa,
      simulatedId
    );
    essayScore += evaluation.nota;
  }

  updateSimulated({
    simulatedId,
    status: SimulatedStatus.COMPLETED,
    essayScore,
  });
  finishSimulation(simulatedId);
};

export const getTheme = async (simulatedId: string) => {
  const simulated = await getSimulatedById(simulatedId);
  const essay = await getEssayById(simulated?.essayId as number);
  return essay?.theme;
};

export const getEssayById = async (id: number) => {
  if(!id) {
    return null;
  }
  return findEssayById(id);
};

export const getEssayBySimulatedId = async (id: string) => {
  return await findEssayBySimulatedId(id);
};
