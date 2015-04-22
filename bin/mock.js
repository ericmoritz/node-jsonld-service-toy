const _ = require('lodash')
const fs = require('fs')
const Q = require('q')
const immutable = require('immutable')
const im = immutable.fromJS
const Resources = require('../src/resources.js')
const outPath = process.argv[2]
const json = x => JSON.stringify(x, null, ' ')


///////////////////////////////////////////////////////////////////////////////
// Mock data
///////////////////////////////////////////////////////////////////////////////
const user = im(
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



///////////////////////////////////////////////////////////////////////////////
// Resource renders
///////////////////////////////////////////////////////////////////////////////
// This is where we need to add the URIs to the resources.
// The URIs are specific to the environment they're rendered in
// so the URIs have to be added at render time.

const Context = Resources.Context().update( '@context', context => (
  im(context).merge(
    im({
      'BookmarkAction': 'schema:BookmarkAction',
      'Person': 'schema:Person'
    })
  )
))

const Index = Resources.Index(
  im({
    '@id': 'index.json',
    'userCreate': {'@id': 'users/created.json'}
  })
)

const UserCreated = Resources.UserCreated(
  im({
    '@id': 'created.json',
    'bookmarkCreate': {'@id': '../bookmarks/created.json'},
    'bookmarkIndex': {'@id': '../bookmarks/index.json'}
  })
)

const UserResource = Resources.UserShown(user)
const BookmarkCreated = Resources.BookmarkCreated(
  im({
    '@id': 'created.json',
    'bookmarkIndex': {'@id': 'index.json'}
  })
)
const BookmarkListShown = Resources.BookmarkListShown({'@id': 'index.json'}, bookmarks)
const BookmarkShownResources = bookmarks.map(Resources.BookmarkShown)

///////////////////////////////////////////////////////////////////////////////
// Output
///////////////////////////////////////////////////////////////////////////////
const writeJson = (fn, data) => {
  const outFn = outPath + fn
  console.log(outFn)
  return Q.nfcall(fs.writeFile, outFn, json(data))
}

const relativeTo = (path, fn) => (
  // This could be better
  (path.indexOf("/") > 0 ? "../" : "") + fn
)

const mkdir = fn => Q.nfcall(fs.mkdir, outPath + fn)

const writeJsonLD = (path, map) => writeJson(
  path,
  map.merge(im({
    '@context': relativeTo(path, "context.json")
  }))
)

Q.all([
  mkdir('users'),
  mkdir('bookmarks')
]).all([
  writeJson("context.json", Context),
  writeJsonLD("vocab.json", Resources.Vocab()),
  writeJsonLD("index.json", Index),
  writeJsonLD("users/created.json", UserCreated),
  writeJsonLD("users/1.json", UserResource),
  writeJsonLD("bookmarks/index.json", BookmarkListShown),
  writeJsonLD("bookmarks/created.json", BookmarkCreated),
  Q.all(BookmarkShownResources.map(
    (r) => writeJsonLD("bookmarks/" + r.get('@id'), r)
  ))
])

