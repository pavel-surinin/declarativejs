import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'declarative-js',
  description: 'Declarative helpers for arrays and optional values',
  base: '/declarativejs/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'API', link: '/typedoc/index.html' },
      { text: 'GitHub', link: 'https://github.com/pavel-surinin/declarative-js' }
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'TypeDoc API', link: '/typedoc/index.html' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pavel-surinin/declarative-js' }
    ],
    search: {
      provider: 'local'
    }
  }
})
