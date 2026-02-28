const ts = require('typescript')
const { Application, TSConfigReader, TypeDocReader, Converter } = require('typedoc')

// TypeDoc 0.22 expects a newer TS API than 3.7 provides.
if (!ts.isIdentifierOrPrivateIdentifier) {
  ts.isIdentifierOrPrivateIdentifier = (node) => !!node && ts.isIdentifier(node)
}

function patchTupleElements(program) {
  const visit = (node) => {
    if (node && node.kind === ts.SyntaxKind.TupleType && !node.elements && node.elementTypes) {
      node.elements = node.elementTypes
    }
    ts.forEachChild(node, visit)
  }

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      visit(sourceFile)
    }
  }
}

async function generate() {
  const app = new Application()
  app.options.addReader(new TSConfigReader())
  app.options.addReader(new TypeDocReader())

  app.converter.on(Converter.EVENT_BEGIN, (context) => {
    for (const program of context.programs) {
      patchTupleElements(program)
    }
  })

  app.bootstrap({
    entryPoints: ['index.ts'],
    tsconfig: 'tsconfig.json',
    plugin: ['none'],
    excludeExternals: true,
    excludePrivate: true,
    name: 'declarative-js',
    readme: 'README.md',
    theme: 'default'
  })

  const project = app.convert()
  if (!project) {
    process.exit(1)
  }

  await app.generateDocs(project, 'docs/typedoc')
}

generate().catch((error) => {
  console.error(error)
  process.exit(1)
})
