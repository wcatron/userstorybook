import { readFile } from 'node:fs/promises'
import * as Handlebars from 'handlebars'
import { join } from 'node:path'
import { TemplatesDataSourceI } from '../useCases/buildUserStoryBook'

export class TemplatesDataSourceReal implements TemplatesDataSourceI {
  template?: ReturnType<typeof Handlebars['compile']>;

  async load() {
    const indexTemplateString = await readFile(
      join(__dirname, '../../template/index.hbs'),
    ).then(buffer => buffer.toString())
    const templateString = await readFile(
      join(__dirname, '../../template/useCase.hbs'),
    ).then(buffer => buffer.toString())
    this.template = Handlebars.compile(indexTemplateString)
    Handlebars.registerHelper('isEqual', function (value1, value2) {
      return value1 === value2
    })
    Handlebars.registerPartial('useCase', templateString)
  }

  generate(data: any) {
    if (!this.template) {
      throw new Error('Did not load template before use!')
    }

    return this.template(data)
  }
}
