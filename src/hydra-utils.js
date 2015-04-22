
const Immutable = require('immutable');
const im = Immutable.fromJS;
const Map = Immutable.Map

module.exports = {


  PUT: Map({
  'method': 'PUT',
  '@type': 'ReplaceResourceOperation'
  }),
  
  DELETE: Map({
  'method': 'DELETE',
  '@type': 'DeleteResourceOperation'
  }),

  POST: (x) => x.merge(
    Map({
      'method': 'POST',
      '@type': 'CreateResourceOperation',
    })
  ),
  resource: (base=Map(), links=Map(), overlay=Map()) => base
    .mergeDeep(links)
    .mergeDeep(overlay)
}

