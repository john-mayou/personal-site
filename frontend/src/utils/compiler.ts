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
    await loadScript('/wasm/browser.js')

    // @ts-expect-error runtime global
    await window['ruby-wasm-wasi'].main({
      name: '@ruby/3.4-wasm-wasi',
      version: '2.7.1',
    })

    // @ts-expect-error runtime global
    this.vm = window.rubyVM as RubyVM

    const compiler = await fetchApi('/api/ruby/compiler.rb').then((r) => r.text())
    this.vm.eval(compiler)
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
