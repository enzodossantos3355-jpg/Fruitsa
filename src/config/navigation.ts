import {
  LayoutDashboard,
  Film,
  Clapperboard,
  CalendarClock,
  Users,
  MapPin,
  FolderOpen,
  Plug,
  HardDrive,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface StudioNavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  availableInStage1: boolean;
  group: 'ESTÚDIO' | 'RECURSOS' | 'SISTEMA';
  plannedDescription?: string;
  plannedCapabilities?: string[];
}

export const STUDIO_NAVIGATION: StudioNavItem[] = [
  // ESTÚDIO
  {
    id: 'visao-geral',
    label: 'Visão geral',
    path: '/studio',
    icon: LayoutDashboard,
    availableInStage1: true,
    group: 'ESTÚDIO',
  },
  {
    id: 'minhas-novelas',
    label: 'Minhas novelas',
    path: '/studio/novelas',
    icon: Film,
    availableInStage1: false,
    group: 'ESTÚDIO',
    plannedDescription:
      'Área dedicada à criação, organização por temporadas opcionais, episódios, cenas e vídeos especiais das suas novelas.',
    plannedCapabilities: [
      'Cadastro e estruturação de novelas com ou sem temporadas',
      'Organização de episódios, cenas e vídeos especiais',
      'Modos de criação manual, drama personalizado e modo viral automático',
      'Memória narrativa e histórico de versões por projeto',
    ],
  },
  {
    id: 'central-de-producao',
    label: 'Central de produção',
    path: '/studio/producao',
    icon: Clapperboard,
    availableInStage1: false,
    group: 'ESTÚDIO',
    plannedDescription:
      'Ambiente operacional para acompanhar o andamento de roteiros, edição de episódios, revisões e preparação de entrega.',
    plannedCapabilities: [
      'Editor de episódios e cenas com salvamento automático',
      'Motor criativo orientado por prompt personalizado',
      'Correção inteligente e revisão de continuidade',
      'Exportação ZIP, backup e importação de projetos',
    ],
  },
  {
    id: 'publicacoes',
    label: 'Publicações',
    path: '/studio/publicacoes',
    icon: CalendarClock,
    availableInStage1: false,
    group: 'ESTÚDIO',
    plannedDescription:
      'Planejamento editorial para agendar lançamentos, organizar capas e acompanhar a distribuição de episódios.',
    plannedCapabilities: [
      'Calendário editorial de publicações por novela e episódio',
      'Gerador e gerenciamento de capas por produção',
      'Controle de status de publicação e histórico de entregas',
    ],
  },

  // RECURSOS
  {
    id: 'personagens',
    label: 'Personagens',
    path: '/studio/personagens',
    icon: Users,
    availableInStage1: false,
    group: 'RECURSOS',
    plannedDescription:
      'Bíblia completa de personagens de frutas para manter consistência visual e narrativa entre todos os episódios.',
    plannedCapabilities: [
      'Fichas detalhadas com personalidade, papel e relações',
      'Prompts âncora padronizados por personagem',
      'Imagens de referência visual e controle de consistência',
      'Guarda-roupa organizado por cena e temporada',
    ],
  },
  {
    id: 'cenarios',
    label: 'Cenários',
    path: '/studio/cenarios',
    icon: MapPin,
    availableInStage1: false,
    group: 'RECURSOS',
    plannedDescription:
      'Catálogo estruturado de locações, iluminações e referências ambientais reutilizáveis em múltiplas cenas.',
    plannedCapabilities: [
      'Biblioteca de cenários com descrições visuais e atmosfera',
      'Referências de iluminação e enquadramento por ambiente',
      'Vínculo direto entre cenários, novelas e episódios',
    ],
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca',
    path: '/studio/biblioteca',
    icon: FolderOpen,
    availableInStage1: false,
    group: 'RECURSOS',
    plannedDescription:
      'Repositório central para imagens, vídeos curtos, capas e ativos visuais produzidos no seu estúdio.',
    plannedCapabilities: [
      'Organização de imagens e vídeos por novela e episódio',
      'Filtros por personagem, cenário e tipo de mídia',
      'Preparação de pacotes de ativos para exportação',
    ],
  },

  // SISTEMA
  {
    id: 'integracoes',
    label: 'Integrações',
    path: '/studio/integracoes',
    icon: Plug,
    availableInStage1: false,
    group: 'SISTEMA',
    plannedDescription:
      'Gerenciamento da extensão Chrome Manifest V3 FruitStudio Connect e integrações externas autorizadas.',
    plannedCapabilities: [
      'Pareamento e status da extensão Chrome FruitStudio Connect (Manifest V3)',
      'Conexões externas autorizadas sob demanda pelo criador',
      'Registro de sincronizações sem dependência de chaves pagas obrigatórias',
    ],
  },
  {
    id: 'armazenamento',
    label: 'Armazenamento',
    path: '/studio/armazenamento',
    icon: HardDrive,
    availableInStage1: false,
    group: 'SISTEMA',
    plannedDescription:
      'Monitoramento do uso de mídia, organização do bucket de armazenamento e rotinas de backup do estúdio.',
    plannedCapabilities: [
      'Integração estruturada com Firebase Storage em etapas futuras',
      'Visualização do espaço utilizado por tipo de ativo',
      'Backup completo e importação segura de projetos do estúdio',
    ],
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    path: '/studio/configuracoes',
    icon: Settings,
    availableInStage1: true,
    group: 'SISTEMA',
  },
];

export const NAV_GROUPS: Array<'ESTÚDIO' | 'RECURSOS' | 'SISTEMA'> = [
  'ESTÚDIO',
  'RECURSOS',
  'SISTEMA',
];

export function getNavItemByPath(pathname: string): StudioNavItem | undefined {
  return STUDIO_NAVIGATION.find((item) => item.path === pathname);
}
