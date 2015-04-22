
const Immutable = require('immutable');
const im = Immutable.fromJS;
const Map = Immutable.Map
const List = Immutable.List
const trace = require('./trace')

module.exports = {
  operation: {
    PUT: (x) => module.exports.link(
      'operation', 
      module.exports.resource(
        Map({
          'method': 'PUT',
          '@type': 'ReplaceResourceOperation'
        }),
        x
      )
    ),
    
    DELETE: (x)  => module.exports.link(
      'operation',
      module.exports.resource(
        Map({
          'method': 'DELETE',
          '@type': 'DeleteResourceOperation'
        }),
        x
      )
    ),

    POST: (x) => module.exports.link(
      'operation',
      module.exports.resource(
        Map({
          'method': 'POST',
          '@type': 'CreateResourceOperation',
        }),
        x
      )
    ),
  },

  link: (name, resource) => {
    const x = Map().set(name, resource)
    x._linkName = name
    return x
  },

  resource: (...resources) => Immutable.List(resources).reduce(
    (x, y) => x.mergeDeep(y),
    Map()
  )

}

// Add the ability to union two links together
module.exports.link.union = (link1, link2) => {
  const name1 = link1._linkName
  const name2 = link2._linkName

  if(name1 === name2) {
    let val1 = link1.get(name1)
    let val2 = link2.get(name2)
    return link1.set(name1, List.of(val1, val2))
  } else {
    return link1.mergeDeep(link2)
 }
}
