import { fetchApi } from '@/utils/api'
import { RubyVM } from '@ruby/wasm-wasi'

export default class Compiler {
  private vm: RubyVM | undefined

  static async create(): Promise<Compiler> {
    const compiler = new Compiler()
    await compiler.loadVM()
    return compiler
  }

  private async loadVM() {
    let compiler: string | null = null

    await Promise.all([
      (async () => {
        await loadScript('/wasm/browser.js')

        const response = await fetch('/wasm/ruby.wasm')
        // @ts-expect-error runtime global
        const _module = await window['ruby-wasm-wasi'].compileWebAssemblyModule(response)
        // @ts-expect-error runtime global
        const { vm } = await window['ruby-wasm-wasi'].DefaultRubyVM(_module)
        // @ts-expect-error runtime global
        await window['ruby-wasm-wasi'].mainWithRubyVM(vm)

        // @ts-expect-error runtime global
        this.vm = window.rubyVM as RubyVM
      })(),
      (async () => {
        compiler = await fetchApi('/api/ruby/compiler.rb').then((r) => r.text())
      })(),
    ])

    if (this.vm && compiler) {
      this.vm.eval(compiler)
    }
  }

  compile(markdown: string): string {
    if (!this.vm) throw new Error('VM not initialized')

    let html = ''
    try {
      html = this.vm
        .eval(
          `
                Compiler.compile(<<~MD)
                    ${markdown}

                MD
            `
        )
        .toString() // extra new line after md to protect against '\' at end of string
    } catch (e) {
      switch (typeof e) {
        case 'string':
          return e
        case 'object':
          return (e as Error).message
        default:
          return 'Unknown error'
      }
    }

    return html
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })
}
