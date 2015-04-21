const _ = require('lodash')
const fs = require('fs')
const Q = require('q')
const immutable = require('immutable')
const Map = immutable.Map
const List = immutable.List
const Resources = require('../src/resources.js')
const outPath = process.argv[2]
const json = x => JSON.stringify(x, null, ' ')
const writeJson = (fn, data) => {
  const outFn = outPath + fn
  console.log(outFn)
  return Q.nfcall(fs.writeFile, outFn, json(data))
}
const mkdir = fn => Q.nfcall(fs.mkdir, outPath + fn)
const user = Map(
  {
    '@id': '1.json', 'name': 'Eric Moritz',
    '@type': 'Person'
  }
)
const bookmarks = [
  {
    '@id': '1.json',
    '@type': 'BookmarkAction',
    'object': {
      'url': 'http://www.programmableweb.com/news/hypermedia-apis-benefits-hateoas/how-to/2014/02/27',
      'name': 'Hypermedia APIs: The Benefits of HATEOAS',
    },
    'agent': user.set('@id', '../users/1.json'),
    bookmarkIndex: {'@id': 'index.json'},
    bookmarkCreate: {'@id': 'created.json'}
  },
  {
    '@id': '2.json',
    '@type': 'BookmarkAction',
    'object': {
      'url': 'http://hydra-cg.org/',
      'name': 'Hydra CG',
    },
    'agent': user.set('@id', '../users/1.json'),
    bookmarkIndex: {'@id': 'index.json'},   
    bookmarkCreate: {'@id': 'created.json'}
  },
  {
    '@id': '3.json',
    '@type': 'BookmarkAction',
    'object': {
      'url': 'http://json-ld.org/',
      'name': 'JSON-LD',
    },
    'agent': user.set('@id', '../users/1.json'),
    bookmarkIndex: {'@id': 'index.json'},
    bookmarkCreate: {'@id': 'created.json'}
  },  
]

const trace = (x) => {
  console.log(x)
  return x
}
const Context = Resources.Context().update( '@context', context => (
  Map(context).merge(
    Map({
      'BookmarkAction': 'schema:BookmarkAction',
      'Person': 'schema:Person'
    })
  )
))

const index = Resources.Index(
  {
    '@id': 'index.json',
    'userCreate': {'@id': 'users/created.json'}
  }
)

const userCreated = Resources.UserCreated(
  {
    '@id': 'created.json',
    'bookmarkCreate': {'@id': '../bookmarks/created.json'},
    'bookmarkIndex': {'@id': '../bookmarks/index.json'}
  }
)

const userResource = Resources.UserShown(user)
const bookmarkCreated = Resources.BookmarkCreated(
  {
    '@id': 'created.json',
    'bookmarkIndex': {'@id': 'index.json'}
  }
)
const bookmarkListShown = Resources.BookmarkListShown({'@id': 'index.json'}, bookmarks)
const bookmarkShownResources = bookmarks.map(Resources.BookmarkShown)
const writeJsonLD = (path, map) => writeJson(
  path,
  map.merge(Context)
)

Q.all([
  mkdir('users'),
  mkdir('bookmarks')
]).all([
  writeJsonLD("vocab.json", Resources.Vocab()),
  writeJsonLD("index.json", index),
  writeJsonLD("users/created.json", userCreated),
  writeJsonLD("users/1.json", userResource),
  writeJsonLD("bookmarks/index.json", bookmarkListShown),
  writeJsonLD("bookmarks/created.json", bookmarkCreated),
  Q.all(bookmarkShownResources.map(
    (r) => writeJsonLD("bookmarks/" + r.get('@id'), r)
  ))
])

