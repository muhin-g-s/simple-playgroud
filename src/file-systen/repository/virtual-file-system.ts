import { Volume, IFs } from 'memfs';
import path from "path-browserify"

import { IDirectory, IFile, IWriteFile } from '../entity';
import { IFileSystem, IInitializationStrategy } from './types';

export class MemFileSystem implements IFileSystem {
	private fs: IFs | null = null;

	constructor(private readonly initStrategy: IInitializationStrategy) { }

	async initialize() {
		const initStateFs = await this.initStrategy.getInitialState();

		this.fs = Volume.fromJSON(initStateFs) as IFs;
	}

	readSync(pathFile: string): Array<IFile | IDirectory> {
		const fs = this.getFs();

    const entries = fs.readdirSync(pathFile)

    return entries.map((entry) => {
      const fullPath = `${pathFile}${entry}`

			const fs = this.getFs();

      const stats = fs.statSync(fullPath)

      if (stats.isSocket() || stats.isBlockDevice()) {
        throw new Error(`Unsupported file type for ${fullPath}`)
      }

      if (stats.isDirectory()) {
        return this.createDirectory(entry as string, fullPath)
      } else if (stats.isFile()) {
        return this.createFile(entry as string, fullPath)
      } else {
        throw new Error(`Unknown file type for ${fullPath}`)
      }
    })
  }

	readdirSync(path: string): Array<IDirectory> {
		const fs = this.getFs();

    const entries = fs.readdirSync(path)

    return entries.map((entry) => {
      const fullPath = `${path}/${entry}`

			if(!fs) {
				throw new Error('File system is not initialized')
			}

      const stats = fs.statSync(fullPath)

      if (stats.isSocket() || stats.isBlockDevice()) {
        throw new Error(`Unsupported file type for ${fullPath}`)
      }

      if (stats.isDirectory()) {
        return this.createDirectory(entry as string, fullPath)
      }

      throw new Error(`Unknown file type for ${fullPath}`)
    })
  }

	readFileSync(pathFile: string): IFile {
		const fs = this.getFs();

    const content = fs.readFileSync(pathFile, "utf-8") as string
    const name = path.basename(pathFile)

    return {
      name,
      path: pathFile,
      content,
    }
  }

	writeFileSync({ path, content }: IWriteFile): void {
		const fs = this.getFs();

		fs.writeFileSync(path, content, );
	}

	existsSync(path: string): boolean {
		if(!this.fs) {
			throw new Error('File system is not initialized')
		}

		return this.fs.existsSync(path);
	}

	private getFs(): IFs {
		if(!this.fs) {
			throw new Error('File system is not initialized')
		}

		return this.fs;
	}

	private createFile(name: string, path: string): IFile {
		if(!this.fs) {
			throw new Error('File system is not initialized')
		}

    return {
      name,
      path,
      content: this.fs.readFileSync(path, "utf-8") as string,
    }
  }

  private createDirectory(name: string, path: string): IDirectory {
    return {
      name,
      path,
      children: this.readdirSync(path),
    }
  }
}