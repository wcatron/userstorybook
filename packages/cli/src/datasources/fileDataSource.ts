import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { FileDataSourceI } from '../useCases/buildUserStoryBook'

export class FileDataSourceReal implements FileDataSourceI {
  async prepDirectory(dir: string) {
    try {
      await mkdir(dir, {})
    } catch {} finally {
      await readdir(dir).then(files =>
        Promise.allSettled(files.map(file => unlink(join(dir, file)))),
      )
    }
  }

  writeFile = writeFile;
}
