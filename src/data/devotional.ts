export type DevotionalQuestion = {
  prompt: string;
  encouragement: string;
};

export type DailyDevotional = {
  id: string;
  theme: string;
  verse: string;
  reference: string;
  reflection: string;
  questions: DevotionalQuestion[];
  forFans: string;
  forSingers: string;
  forMissionaries: string;
};

/** 14 devocionais — o dia do ano escolhe qual aparece (mesmo dia = mesmo texto para todos). */
export const devotionals: DailyDevotional[] = [
  {
    id: 'd1',
    theme: 'Presença que sustenta',
    verse:
      'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.',
    reference: 'Isaías 41:10',
    reflection:
      'Quem caminha com Nayara nesta jornada de fé não anda sozinho. A mesma presença que sustenta o altar sustenta o fã, o cantor e o missionário no dia a dia.',
    questions: [
      {
        prompt: 'Onde você mais precisa da destra de Deus hoje — medo, cansaço ou decisão?',
        encouragement:
          'Nomear o medo já é um ato de fé. Entregue esse ponto a Deus e dê o próximo passo com paz.',
      },
      {
        prompt: 'Quem ao seu lado precisa ouvir “não temas” esta semana?',
        encouragement:
          'Uma mensagem simples pode ser altar para alguém. Seja canal de ânimo, como a música de Nayara tem sido para tantos.',
      },
    ],
    forFans:
      'Fã amado: sua oração e presença fortalecem esta missão. Continue firme — você faz parte da história.',
    forSingers:
      'Cantor(a) amigo(a): sua voz no altar ecoa esperança. Cante com pureza; o céu ouve cada nota.',
    forMissionaries:
      'Missionário(a): cada passo no campo conta. Deus fortalece quem leva o evangelho com amor.',
  },
  {
    id: 'd2',
    theme: 'Alegria do Senhor',
    verse: 'A alegria do Senhor é a vossa força.',
    reference: 'Neemias 8:10',
    reflection:
      'Força não nasce só do esforço — nasce da alegria em Deus. Mesmo em dias densos, há um gozo santo que levanta o ânimo da comunidade.',
    questions: [
      {
        prompt: 'O que rouba sua alegria com mais facilidade ultimamente?',
        encouragement:
          'Traga isso à luz em oração. A alegria do Senhor não ignora a dor — ela a transcende.',
      },
      {
        prompt: 'Como você pode semear alegria em alguém da família Nayara hoje?',
        encouragement:
          'Um “amém”, um share da música ou um abraço virtual já é missão. Pequenos gestos movem montanhas.',
      },
    ],
    forFans: 'Sua alegria na adoração inspira. Dance, ore e celebre — o Reino se alegra com você.',
    forSingers: 'Que sua voz carregue alegria genuína, não performance vazia. O altar reconhece autenticidade.',
    forMissionaries: 'No campo, a alegria é combustível. Descanse em Deus e volte a semear com leveza.',
  },
  {
    id: 'd3',
    theme: 'Coração que adora',
    verse:
      'Deus é Espírito, e importa que os que o adoram o adorem em espírito e em verdade.',
    reference: 'João 4:24',
    reflection:
      'Adorar não é só repertório — é verdade no coração. Nayara e esta comunidade são chamadas a um culto sincero, onde a música serve ao Rei.',
    questions: [
      {
        prompt: 'Sua adoração tem sido mais hábito ou mais encontro?',
        encouragement:
          'Volte ao primeiro amor. Três minutos em silêncio com Deus já reabrem o poço da verdade.',
      },
      {
        prompt: 'O que a verdade de Deus está pedindo que você ajuste hoje?',
        encouragement:
          'Obediência pequena hoje prepara um testemunho grande amanhã. Vá com graça, sem culpa.',
      },
    ],
    forFans: 'Adore em casa como no culto. Seu quarto também pode ser altar.',
    forSingers: 'Antes do microfone, o coração. Afine primeiro a intimidade com Deus.',
    forMissionaries: 'Adoração verdadeira sustenta a missão quando os resultados demoram.',
  },
  {
    id: 'd4',
    theme: 'Luz no caminho',
    verse: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.',
    reference: 'Salmos 119:105',
    reflection:
      'A Palavra ilumina um passo de cada vez — não necessariamente o mapa inteiro. Assim também é seguir a Nayara em fé: passo a passo, com direção divina.',
    questions: [
      {
        prompt: 'Qual versículo tem sido “lâmpada” para você nesta estação?',
        encouragement:
          'Guarde-o visível hoje — tela do celular, papel na carteira. A luz precisa estar à mão.',
      },
      {
        prompt: 'Há algum caminho em que você tem andado no escuro?',
        encouragement:
          'Peça luz antes de acelerar. Deus prefere guiar a pressa do que consertar a queda.',
      },
    ],
    forFans: 'Ler a Bíblia e ouvir Cordas de Amor no mesmo dia é adoração completa: Palavra + louvor.',
    forSingers: 'Deixe a letra nascer da Escritura. Canções iluminadas edificam a igreja.',
    forMissionaries: 'Leve a lâmpada da Palavra a quem ainda caminha na sombra. Você é mensageiro de luz.',
  },
  {
    id: 'd5',
    theme: 'Paz que guarda',
    verse:
      'E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.',
    reference: 'Filipenses 4:7',
    reflection:
      'Ansiedade tenta roubar o foco da missão. A paz de Deus não é ausência de luta — é presença que guarda o coração no meio dela.',
    questions: [
      {
        prompt: 'O que mais inquieta sua mente neste momento?',
        encouragement:
          'Entregue em oração com gratidão (Fp 4:6). A troca é real: peso por paz.',
      },
      {
        prompt: 'Como você pode ser “guarda da paz” para um irmão hoje?',
        encouragement:
          'Ouvir sem julgar já é ministério. Ofereça presença antes de oferecer conselho.',
      },
    ],
    forFans: 'Quando a playlist acalma, lembre: a fonte é Cristo. Descanse nEle.',
    forSingers: 'Canções de paz são baume. Cante para curar, não só para impressionar.',
    forMissionaries: 'Em contextos tensos, sua paz testemunha mais alto que muitos discursos.',
  },
  {
    id: 'd6',
    theme: 'Chamado com propósito',
    verse:
      'Antes, pelo contrário, crescei na graça e conhecimento de nosso Senhor e Salvador Jesus Cristo.',
    reference: '2 Pedro 3:18',
    reflection:
      'Seguir Nayara nesta jornada é também crescer: em graça, em caráter, em missão. Não ficamos parados — avançamos com Jesus.',
    questions: [
      {
        prompt: 'Em qual área Deus tem pedido crescimento a você?',
        encouragement:
          'Crescimento é graça diária, não sprint. Celebre o progresso pequeno.',
      },
      {
        prompt: 'Quem te inspira a crescer na fé nesta comunidade?',
        encouragement:
          'Agradeça a essa pessoa hoje. Gratidão fortalece laços missionários.',
      },
    ],
    forFans: 'Seu crescimento espiritual é parte do legado desta comunidade. Continue aprendendo.',
    forSingers: 'Estude teologia e técnica: excelência também glorifica.',
    forMissionaries: 'Cresça para servir melhor. O chamado amadurece quem obedece.',
  },
  {
    id: 'd7',
    theme: 'Amor que permanece',
    verse:
      'O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha.',
    reference: '1 Coríntios 13:4',
    reflection:
      'Ministério sem amor é barulho. A família Nayara é chamada a amar com paciência — nos bastidores, no chat, no culto e na missão.',
    questions: [
      {
        prompt: 'Onde o amor tem sido mais difícil para você exercer?',
        encouragement:
          'Peça capacidade sobrenatural. O amor de 1 Coríntios 13 é fruto do Espírito, não só esforço.',
      },
      {
        prompt: 'Como demonstrar bondade a alguém “difícil” nesta semana?',
        encouragement:
          'Um ato concreto vale mais que intenção. Escolha um gesto e cumpra.',
      },
    ],
    forFans: 'Comente com gentileza, ore com fé, compartilhe com propósito. Isso é amor em rede.',
    forSingers: 'Sirva o time com paciência. Harmonias humanas precedem harmonias musicais.',
    forMissionaries: 'Amor paciente abre portas que argumentos fecham. Persista em bondade.',
  },
  {
    id: 'd8',
    theme: 'Fé que move',
    verse: 'Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem.',
    reference: 'Hebreus 11:1',
    reflection:
      'Lançamentos, turnês e missões começam no invisível: na fé. Cordas de Amor e cada passo desta caminhada nasceram de crer antes de ver.',
    questions: [
      {
        prompt: 'O que você está pedindo a Deus sem ainda ver resposta?',
        encouragement:
          'Continue crendo. A demora não é negação — muitas vezes é preparação.',
      },
      {
        prompt: 'Qual passo de fé cabe em suas mãos hoje (mesmo pequeno)?',
        encouragement:
          'Fé sem obras é morta — mas a obra pode ser orar, ligar, perdoar ou doar. Faça o que cabe hoje.',
      },
    ],
    forFans: 'Sua fé coletiva sustenta projetos. Continue crendo com a família Nayara.',
    forSingers: 'Ensaie com fé: cada nota pode tocar alguém que você nunca verá.',
    forMissionaries: 'Plante mesmo sem colheita à vista. O Senhor da seara é fiel.',
  },
  {
    id: 'd9',
    theme: 'Perto dos quebrantados',
    verse:
      'Perto está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.',
    reference: 'Salmos 34:18',
    reflection:
      'Há fãs, cantores e missionários cansados. Deus não se afasta da dor — Ele se aproxima. Este altar virtual também é abrigo.',
    questions: [
      {
        prompt: 'Há alguma quebra em você que ainda não foi levada a Deus?',
        encouragement:
          'Traga agora, sem filtro. O Senhor já está perto — Ele espera sua honestidade.',
      },
      {
        prompt: 'Quem ao seu redor parece quebrantado e precisa de cuidado?',
        encouragement:
          'Ore pelo nome dessa pessoa. Se puder, envie uma palavra breve de ânimo.',
      },
    ],
    forFans: 'Seu choro também é culto. Deus recolhe lágrimas e transforma em cântico novo.',
    forSingers: 'Canções nascidas da quebra curam nações. Não desperdice sua história.',
    forMissionaries: 'Cuide também da sua alma. Quem serve precisa ser sustentado.',
  },
  {
    id: 'd10',
    theme: 'Unidade no Corpo',
    verse:
      'Esforçando-vos diligentemente por preservar a unidade do Espírito no vínculo da paz.',
    reference: 'Efésios 4:3',
    reflection:
      'Uma comunidade ao redor de uma cantora gospel é mais que fandom — é corpo. Unidade não é uniformidade; é paz no vínculo do Espírito.',
    questions: [
      {
        prompt: 'Você tem contribuído para unidade ou para divisão nas conversas?',
        encouragement:
          'Escolha hoje edificar. Silêncio sábio também preserva a paz.',
      },
      {
        prompt: 'Como apoiar alguém da equipe/comunidade sem competir?',
        encouragement:
          'Celebre a vitória alheia em público. Isso desarma inveja e fortalece o time.',
      },
    ],
    forFans: 'Defenda a unidade nos comentários. Seja fã que abençoa, não que fere.',
    forSingers: 'Não há ministério solo no Corpo. Honre quem sobe e quem serve nos bastidores.',
    forMissionaries: 'Parcerias em paz multiplicam alcance. Busque alianças saudáveis.',
  },
  {
    id: 'd11',
    theme: 'Força renovada',
    verse:
      'Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias.',
    reference: 'Isaías 40:31',
    reflection:
      'Cansaço é real na estrada da fé e da música. Esperar no Senhor não é passividade — é troca de força: a nossa pela dEle.',
    questions: [
      {
        prompt: 'Você tem corrido na própria força ou esperado no Senhor?',
        encouragement:
          'Pare 5 minutos. Respire. Peça renovação. Águias não se apressam no chão.',
      },
      {
        prompt: 'O que você precisa soltar para voar mais leve?',
        encouragement:
          'Culpa, comparação ou agenda lotada? Solte uma coisa hoje nas mãos de Deus.',
      },
    ],
    forFans: 'Descanse sem culpa. Seguir Nayara também é cuidar da própria alma.',
    forSingers: 'Voz cansada precisa de silêncio santo. Renove antes do próximo culto.',
    forMissionaries: 'Sabático curto e oração profunda evitam burnout no campo.',
  },
  {
    id: 'd12',
    theme: 'Palavra que transforma',
    verse:
      'Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a educação na justiça.',
    reference: '2 Timóteo 3:16',
    reflection:
      'Perguntas bíblicas não são prova — são convite à transformação. Deixe a Escritura ensinar, corrigir e preparar para toda boa obra.',
    questions: [
      {
        prompt: 'Qual área da sua vida a Bíblia tem confrontado com amor?',
        encouragement:
          'Correção divina é cuidado, não rejeição. Receba e ajuste o rumo.',
      },
      {
        prompt: 'Como aplicar um versículo concreto nas próximas 24 horas?',
        encouragement:
          'Escreva a ação em uma frase. Fé aplicada vira testemunho.',
      },
    ],
    forFans: 'Devocional + louvor = discipulado diário. Você está crescendo.',
    forSingers: 'Fundamente repertório na Escritura. Letras bíblicas alimentam a igreja.',
    forMissionaries: 'Ensine a Palavra com clareza e graça. Ela é a ferramenta principal.',
  },
  {
    id: 'd13',
    theme: 'Esperança viva',
    verse:
      'Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo que, segundo a sua grande misericórdia, nos regenerou para uma viva esperança.',
    reference: '1 Pedro 1:3',
    reflection:
      'Esperança cristã não é otimismo barato — é certeza em Cristo ressuscitado. Por isso esta comunidade canta, ora e missiona com futuro.',
    questions: [
      {
        prompt: 'Onde sua esperança tem estado mais frágil?',
        encouragement:
          'Volte à ressurreição. Se Jesus vive, nenhum túmulo tem a última palavra sobre você.',
      },
      {
        prompt: 'Como espalhar esperança viva nesta comunidade hoje?',
        encouragement:
          'Compartilhe um testemunho curto. Esperança contagia quando é pessoal.',
      },
    ],
    forFans: 'Há um novo cântico a cada amanhecer. Continue esperando com júbilo.',
    forSingers: 'Cante esperança sobre cidades e corações. Vocês anunciam o amanhã de Deus.',
    forMissionaries: 'Leve esperança onde só há adeus. Vocês são arautos da vida.',
  },
  {
    id: 'd14',
    theme: 'Missão até os confins',
    verse:
      'Ide, portanto, fazei discípulos de todas as nações… ensinando-os a guardar todas as coisas que vos tenho ordenado.',
    reference: 'Mateus 28:19-20',
    reflection:
      'Fãs, cantores e missionários formam uma rede de discipulado. A música abre portas; a Palavra forma vidas; a amizade sustenta o caminho.',
    questions: [
      {
        prompt: 'Qual é o seu “ide” prático nesta semana?',
        encouragement:
          'Pode ser orar por uma nação, apoiar uma live ou conversar sobre Jesus com alguém. Ide começa perto.',
      },
      {
        prompt: 'Como caminhar junto com a família Nayara na missão?',
        encouragement:
          'Interceda, incentive e esteja presente. Comunidade missionária não assiste de longe — participa.',
      },
    ],
    forFans: 'Seu apoio torna a missão possível. Obrigado por ir além do like — você discipula com presença.',
    forSingers: 'Levem o evangelho em cada cidade. A Grande Comissão também tem trilha sonora.',
    forMissionaries: 'Vocês não estão sós: há um coral de oração atrás de cada passo. Avante.',
  },
];

export function getDayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getTodayDevotional(date = new Date()): DailyDevotional {
  const idx = getDayOfYear(date) % devotionals.length;
  return devotionals[idx];
}

export function formatDevotionalDate(date = new Date()): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
