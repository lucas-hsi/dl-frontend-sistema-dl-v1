// Configuração do axe-core para testes de acessibilidade
const axeConfig = {
  rules: {
    // Regras críticas que devem sempre passar
    'color-contrast': { enabled: true },
    'document-title': { enabled: true },
    'html-has-lang': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    
    // Regras para formulários
    'label': { enabled: true },
    'select-name': { enabled: true },
    'input-image-alt': { enabled: true },
    
    // Regras para navegação
    'bypass': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'skip-link': { enabled: true },
    
    // Regras para interatividade
    'button-name': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    
    // Regras para imagens
    'image-alt': { enabled: true },
    'image-redundant-alt': { enabled: true },
    
    // Regras para tabelas
    'table-duplicate-name': { enabled: true },
    'td-has-header': { enabled: true },
    'th-has-data-cells': { enabled: true },
    
    // Regras para estrutura
    'heading-order': { enabled: true },
    'p-as-heading': { enabled: true },
    
    // Regras para ARIA
    'aria-allowed-attr': { enabled: true },
    'aria-allowed-role': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    'aria-roles': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    'aria-valid-attr': { enabled: true },
    
    // Regras para idioma
    'html-lang-valid': { enabled: true },
    'valid-lang': { enabled: true },
    
    // Regras para performance de acessibilidade
    'frame-title': { enabled: true },
    'iframe-title': { enabled: true },
    'object-alt': { enabled: true },
    'video-caption': { enabled: true },
    'video-description': { enabled: true },
    
    // Regras para contraste e cores
    'color-contrast-enhanced': { enabled: false }, // Opcional para WCAG AAA
    'focus-visible': { enabled: true },
    
    // Regras para dispositivos móveis
    'touch-target-size': { enabled: true },
    
    // Regras para leitores de tela
    'aria-hidden-focus': { enabled: true },
    'focusable-no-name': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-unique': { enabled: true },
    
    // Regras para formulários avançados
    'autocomplete-valid': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'form-fieldset': { enabled: true },
    'label-title-only': { enabled: true },
    'select-name': { enabled: true },
    
    // Regras para conteúdo dinâmico
    'aria-hidden-body': { enabled: true },
    'aria-required-children': { enabled: true },
    'aria-required-parent': { enabled: true },
    
    // Regras para links
    'link-in-text-block': { enabled: true },
    'link-suspicious': { enabled: true },
    'link-underline': { enabled: false }, // Opcional
    
    // Regras para imagens
    'image-alt-redundant': { enabled: true },
    'image-redundant-alt': { enabled: true },
    
    // Regras para tabelas
    'table-fake-caption': { enabled: true },
    'td-headers-attr': { enabled: true },
    'th-has-data-cells': { enabled: true },
    
    // Regras para listas
    'list': { enabled: true },
    'listitem': { enabled: true },
    
    // Regras para botões
    'button-name': { enabled: true },
    'button-accessible-name': { enabled: true },
    
    // Regras para campos de entrada
    'input-button-name': { enabled: true },
    'input-image-alt': { enabled: true },
    'input-image-redundant-alt': { enabled: true },
    
    // Regras para elementos interativos
    'click-events-have-key-events': { enabled: true },
    'no-autoplay-audio': { enabled: true },
    'no-duplicate-attributes': { enabled: true },
    'no-duplicate-id': { enabled: true },
    'no-duplicate-id-active': { enabled: true },
    'no-duplicate-id-aria': { enabled: true },
    'no-redundant-roles': { enabled: true },
    'no-unsupported-elements': { enabled: true },
    'presentation-role-conflict': { enabled: true },
    'role-img-alt': { enabled: true },
    'svg-img-alt': { enabled: true },
    'text-alternatives': { enabled: true },
    'text-heading-ratio': { enabled: false }, // Opcional
    'text-size-adjust': { enabled: false }, // Opcional
    'text-spacing': { enabled: false }, // Opcional
    'text-track-display': { enabled: true },
    'video-description': { enabled: true },
    'video-caption': { enabled: true },
    'video-audio-caption': { enabled: true },
    'video-audio-description': { enabled: true },
    'video-audio-track': { enabled: true },
    'video-caption': { enabled: true },
    'video-description': { enabled: true },
    'video-track': { enabled: true },
    'video-audio-caption': { enabled: true },
    'video-audio-description': { enabled: true },
    'video-audio-track': { enabled: true },
    'video-caption': { enabled: true },
    'video-description': { enabled: true },
    'video-track': { enabled: true }
  },
  
  // Configurações de impacto
  impact: ['critical', 'serious'],
  
  // Configurações de contexto
  runOnly: {
    type: 'rule',
    values: [
      'color-contrast',
      'document-title',
      'html-has-lang',
      'landmark-one-main',
      'page-has-heading-one',
      'region',
      'label',
      'select-name',
      'input-image-alt',
      'bypass',
      'focus-order-semantics',
      'skip-link',
      'button-name',
      'link-name',
      'list',
      'listitem',
      'image-alt',
      'image-redundant-alt',
      'table-duplicate-name',
      'td-has-header',
      'th-has-data-cells',
      'heading-order',
      'p-as-heading',
      'aria-allowed-attr',
      'aria-allowed-role',
      'aria-required-attr',
      'aria-required-children',
      'aria-required-parent',
      'aria-roles',
      'aria-valid-attr-value',
      'aria-valid-attr',
      'html-lang-valid',
      'valid-lang',
      'frame-title',
      'iframe-title',
      'object-alt',
      'video-caption',
      'video-description',
      'focus-visible',
      'touch-target-size',
      'aria-hidden-focus',
      'focusable-no-name',
      'landmark-unique',
      'autocomplete-valid',
      'form-field-multiple-labels',
      'form-fieldset',
      'label-title-only',
      'aria-hidden-body',
      'link-in-text-block',
      'link-suspicious',
      'image-alt-redundant',
      'table-fake-caption',
      'td-headers-attr',
      'click-events-have-key-events',
      'no-autoplay-audio',
      'no-duplicate-attributes',
      'no-duplicate-id',
      'no-duplicate-id-active',
      'no-duplicate-id-aria',
      'no-redundant-roles',
      'no-unsupported-elements',
      'presentation-role-conflict',
      'role-img-alt',
      'svg-img-alt',
      'text-alternatives',
      'text-track-display'
    ]
  }
};

module.exports = axeConfig; 