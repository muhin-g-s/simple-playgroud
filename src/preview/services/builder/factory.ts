import { ESBuild } from './esbuild-builder';
import { IBuilder, IBuilderConfig, IBuilderUseCase } from './interfaces';
import { BuilderUseCase } from './use-case';

let builder: IBuilder | null  = null; 

const config: IBuilderConfig = {
	extensions: ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"],
	workingDir: "/project",
  nodeModulesPaths: ["/project/node_modules"],
  onExternalPackage: pkg => {
   const externals = JSON.parse(localStorage.getItem("externals") || "{}")
	 localStorage.setItem("externals", JSON.stringify({ ...externals, [pkg]: true }))
  },
  onOutputGenerated: files => {
    files.forEach(file => {
			const jsFile = new File([file], "index.js", {
				type: "text/javascript",
			})
			const objectURL = URL.createObjectURL(jsFile)
			localStorage.setItem("script", objectURL)
		});
  },
  getExternalPackageContent: pkg => {
    return `export default window._externals['${pkg}']`;
  }
}

export function getEsBuilder(): IBuilderUseCase {
	if(!builder) {
		builder = new ESBuild(config); 
	}

	return new BuilderUseCase(builder);
}