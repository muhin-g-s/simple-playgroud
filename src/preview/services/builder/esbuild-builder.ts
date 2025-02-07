import esbuild from "esbuild-wasm";
import * as path from "path"
import { Volume, type IFs } from "memfs"
import type { Plugin, BuildOptions, BuildResult } from "esbuild"
import esWasm from "esbuild-wasm/esbuild.wasm?url"
import { IBuilder } from './interfaces';

const PROJECT_NAMESPACE = "project"
const NODE_MODULES_NS = "node_modules"

export class ESBuild implements IBuilder {
  private initialized = false
  private vol: IFs
  private entryPoint: string | null = null

  constructor() {
    this.vol = Volume.fromJSON({}) as IFs
    this.initialize = this.initialize.bind(this)
    this.setEntryPoint = this.setEntryPoint.bind(this)
    this.rebuildProject = this.rebuildProject.bind(this)
    this.addFile = this.addFile.bind(this)
  }

  public addFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath)
    try {
      this.vol.mkdirSync(dir, { recursive: true })
      this.vol.writeFileSync(filePath, content)
    } catch {
      this.vol.writeFileSync(filePath, content)
    }
  }

  public setEntryPoint(entryPoint: string): void {
    this.entryPoint = entryPoint
  }

  public async rebuildProject(): Promise<void> {
    if (!this.entryPoint) {
      throw new Error("Entry point not set. Call setEntryPoint() first.")
    }

    try {
      await this.initialize()
      const result = await esbuild.build(this.getBuildOptions(this.entryPoint))
      this.handleBuildResult(result)
    } catch (error) {
      console.error("Build failed:", error)
      throw error
    }
  }

  private resolvePath({ id, importer }: { id: string; importer: string }): string {
    let resolvedPath = id

    if (importer && id.startsWith(".")) {
      resolvedPath = path.resolve(path.dirname(importer), id)
    }

    const extensions = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"]

    for (const ext of extensions) {
      const testPath = ext.startsWith("/") ? path.join(resolvedPath, ext) : resolvedPath + ext

      try {
        if (this.vol.existsSync(testPath)) {
          return testPath
        }
      } catch (e) {
        console.log(e)
        continue
      }
    }

    throw new Error(`Module not found: ${resolvedPath}`)
  }

  private createFsPlugin(): Plugin {
    return {
      name: "virtual-fs",
      setup: (build) => {
        build.onResolve({ filter: /.*/ }, (args) => {
          if (args.kind === "entry-point") {
            return { path: args.path, namespace: PROJECT_NAMESPACE }
          }

          try {
            const resolved = this.resolvePath({
              id: args.path,
              importer: args.pluginData?.importer || "",
            })
            return { path: resolved, namespace: PROJECT_NAMESPACE }
          } catch (error) {
            console.error("File resolve error:", error)
            return {
              path: args.path,
              namespace: NODE_MODULES_NS,
              pluginData: { package: args.path },
            }
          }
        })

        build.onLoad({ filter: /.*/, namespace: PROJECT_NAMESPACE }, async (args) => {
          try {
            const contents = this.vol.readFileSync(args.path, "utf8") as string
            const ext = path.extname(args.path).slice(1)

            return {
              contents,
              loader: ext === "ts" || ext === "tsx" ? "tsx" : "js",
              pluginData: { importer: args.path },
            }
          } catch (error) {
            console.error("File read error:", error)
            return { errors: [{ text: `File not found: ${args.path}` }] }
          }
        })
      },
    }
  }

  private createExternalPlugin(): Plugin {
    return {
      name: "external-packages",
      setup: (build) => {
        build.onLoad({ filter: /.*/, namespace: NODE_MODULES_NS }, async (args) => {
          this.trackExternalPackage(args.path)
          return {
            contents: `module.exports = window['${args.path}'];`,
            loader: "js",
          }
        })
      },
    }
  }

  private getBuildOptions(entryPoint: string): BuildOptions {
    return {
      entryPoints: [entryPoint],
      bundle: true,
      plugins: [this.createFsPlugin(), this.createExternalPlugin()],
      write: false,
      absWorkingDir: "/project",
      nodePaths: ["/project/node_modules"],
    }
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      await esbuild.initialize({ wasmURL: esWasm })
      this.initialized = true
    } catch (error) {
      console.error("ESBuild initialization failed:", error)
      throw error
    }
  }

  private trackExternalPackage(pkg: string): void {
    const externals = JSON.parse(localStorage.getItem("externals") || "{}")
    localStorage.setItem("externals", JSON.stringify({ ...externals, [pkg]: true }))
  }

  private handleBuildResult(result: BuildResult): void {
    result.outputFiles?.forEach((file) => {
      const jsFile = new File([file.text], "index.js", {
        type: "text/javascript",
      })
      const objectURL = URL.createObjectURL(jsFile)
      localStorage.setItem("script", objectURL)
    })
  }
}

 