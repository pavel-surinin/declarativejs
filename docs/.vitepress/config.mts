import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'declarative-js',
  description: 'Declarative helpers for arrays and optional values',
  base: '/declarativejs/',
  head: [
    [
      'script',
      {},
      `(() => {
  const path = window.location.pathname.replace(/\\/+$/, '')
  if (path.endsWith('/typedoc')) {
    const target = window.location.pathname.replace(/\\/?$/, '/index.html') + window.location.search + window.location.hash
    window.location.replace(target)
  }
})()`
    ]
  ],
  themeConfig: {
    outline: [2, 3],
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
