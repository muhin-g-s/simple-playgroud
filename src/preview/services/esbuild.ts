import { BuildOptions, Plugin, BuildResult } from "esbuild";
import esbuild from "esbuild-wasm";
import esWasm from "esbuild-wasm/esbuild.wasm?url";

interface IESService {
  build(code: string): Promise<void>;
}

const VIRTUAL_NAMESPACE = "virtual";
const STDIN_MODULE = "<stdin>";
const NODE_MODULES_NS = "node_modules:external";

export class ESService implements IESService {
  private initialized = false;
  private readonly externalPackages = [
    "react",
    "react-dom",
    "react-router-dom",
    "styled-components",
  ];

  constructor() {
    this.initialize = this.initialize.bind(this);
    this.build = this.build.bind(this);
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await esbuild.initialize({ wasmURL: esWasm });
      this.initialized = true;
    } catch (error) {
      console.error("ESBuild initialization failed:", error);
      throw error;
    }
  }

  private createEntryPlugin(code: string): Plugin {
    return {
      name: "virtual-entry",
      setup: (build) => {
        build.onResolve({ filter: new RegExp(`^${STDIN_MODULE}$`) }, () => ({
          path: "index.tsx",
          namespace: VIRTUAL_NAMESPACE,
          pluginData: { importer: "" },
        }));

        build.onLoad(
          { filter: /.*/, namespace: VIRTUAL_NAMESPACE },
          async () => ({
            contents: code,
            loader: "tsx",
            pluginData: { importer: "index.tsx" },
          })
        );
      },
    };
  }

  private createExternalPlugin(): Plugin {
    return {
      name: "global-external",
      setup: (build) => {
        build.onResolve(
          // eslint-disable-next-line no-useless-escape
          { filter: /^([^\.\/]).*/ },
          (args) => ({
            path: args.path,
            namespace: NODE_MODULES_NS,
            pluginData: {
              ...args.pluginData,
              package: args.path,
            },
          })
        );

        build.onLoad(
          { filter: /.*/, namespace: NODE_MODULES_NS },
          async (args) => {
            this.trackExternalPackage(args.path);
            return {
              contents: `module.exports = window['${args.path}'];`,
              loader: "js",
              pluginData: { importer: args.path },
            };
          }
        );
      },
    };
  }

  private trackExternalPackage(pkg: string): void {
    const externals = JSON.parse(localStorage.getItem("externals") || "{}");
    localStorage.setItem(
      "externals",
      JSON.stringify({ ...externals, [pkg]: true })
    );
  }

  private getBuildOptions(code: string): BuildOptions {
    return {
      entryPoints: [STDIN_MODULE],
      bundle: true,
      loader: { ".tsx": "tsx" },
      external: this.externalPackages,
      plugins: [this.createEntryPlugin(code), this.createExternalPlugin()],
      write: false,
    };
  }

  private handleBuildResult(result: BuildResult): void {
    result.outputFiles?.forEach((file) => {
      const jsFile = new File([file.text], "index.js", {
        type: "text/javascript",
      });
      const objectURL = URL.createObjectURL(jsFile);
      localStorage.setItem("script", objectURL);
    });
  }

  public async build(code: string): Promise<void> {
    try {
      await this.initialize();
      const result = await esbuild.build(this.getBuildOptions(code));
      this.handleBuildResult(result);
    } catch (error) {
      console.error("Build failed:", error);
      throw error;
    }
  }
}