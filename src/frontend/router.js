/* global location */
import { on } from 'bubbly'
import uriTemplates from 'uri-templates'
import { chain } from 'js-deco/dist/commonjs/chain'
import anechoic from './decorators/anechoic'

export default class Router {
  constructor (routes = new Map()) {
    this.routes = new Map()
    for (const [pattern, handler] of routes) this.route(pattern, handler)
    window::on('popstate', event => this.trigger(
      location.pathname + location.search + location.hash
    ))
  }

  @chain
  route (pattern, handler) {
    const template = uriTemplates(pattern)
    const predicate = template.fromUri
    this.routes.set(predicate, handler)
  }

  @chain
  @anechoic
  trigger (path = '') {
    for (const [predicate, handler] of this.routes.entries()) {
      const params = predicate(path)
      if (params) {
        handler(params)
        break
      }
    }
  }
}
