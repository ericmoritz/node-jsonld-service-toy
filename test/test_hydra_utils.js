const Immutable = require('immutable')
const im = Immutable.fromJS
const hydra = require('../src/hydra-utils')
const expect = require("expect")


describe('operation', function() {

  describe('#PUT()', function() {

    expect(
      hydra.operation.PUT().toJS()
    ).toEqual(
      {
        'operation': {
          'method': 'PUT',
          '@type': 'ReplaceResourceOperation'
        }
      }
    )

    expect(
      hydra.operation.PUT(im({
        'returns': 'Foo'
      })).toJS()
    ).toEqual(
      {
        'operation': {
          'method': 'PUT',
          '@type': 'ReplaceResourceOperation',
          'returns': 'Foo'
        }
      }
    )
  })

  describe('#DELETE()', function() {
    expect(
      hydra.operation.DELETE().toJS()
    ).toEqual(
      {
        'operation': {
          'method': 'DELETE',
          '@type': 'DeleteResourceOperation'
        }
      }
    )

    expect(
      hydra.operation.DELETE(im({
        'returns': 'Foo'
      })).toJS()
    ).toEqual(
      {
        'operation': {
          'method': 'DELETE',
          '@type': 'DeleteResourceOperation',
          'returns': 'Foo'
        }
      }
    )
  })

  describe('#POST()', function() {
    expect(
      hydra.operation.POST().toJS()
    ).toEqual(
      {
        'operation': {
          'method': 'POST',
          '@type': 'CreateResourceOperation'
        }
      }
    )

    expect(
      hydra.operation.POST({
        'returns': 'Foo'
      }).toJS()
    ).toEqual(
      {
        'operation': {
          'method': 'POST',
          '@type': 'CreateResourceOperation',
          'returns': 'Foo'
        }
      }
    )
  })

})


describe('#link()', function() {

  expect(
    hydra.link('getFoo', hydra.resource({
      '@id': './foo'
    })).toJS()
    
  ).toEqual(
    {
      'getFoo': {
        '@id': './foo'
      }
    }
  )

})

describe('#link.union(x, y)', function() {
  expect(
    hydra.link.union(
      hydra.link('getFoo', im({'@id': './foos/1'})),
      hydra.link('getFoo', im({'@id': './foos/2'}))
    ).toJS()
  ).toEqual(
    {
      'getFoo': [
        {'@id': './foos/1'},
        {'@id': './foos/2'}
      ]
    }
  )

  // merging union of different links does nothing
  // but merge the two links
  expect(
    hydra.link.union(
      hydra.link('getFoo', im({'@id': './foos/1'})),
      hydra.link('getBar', im({'@id': './bars/2'}))
    ).toJS()
  ).toEqual(
    {
      'getFoo': {'@id': './foos/1'},
      'getBar': {'@id': './bars/2'}
    }
  )
})
