//  This is a side-effect free zone!

const Immutable = require('immutable')
const Map = Immutable.Map
const im = Immutable.fromJS
const constants = require('./constants')
const hydra = require('hydra-view')

const operation = hydra.operation;
const link = hydra.link;
const resource = hydra.resource;
const trace = require('./trace')


// What resources look like as links or full resources

const UserCreatedOperation = {
  'returns': 'UserCreated',
  'expects': {
    'supportedProperty': [
      {'@id': 'name', 'required': true}
    ]
  }
}

const ResourceBases = {
  UserCreated: resource(
    operation.POST(UserCreatedOperation)
  ),

  BookmarkCreated: resource(
    operation.POST({
      'returns': 'BookmarkCreated'
    })
  ), 

  BookmarkShown: resource(
    operation.DELETE()
  ),

  UserShown: resource(
    link.union(
      operation.PUT(UserCreatedOperation),
      operation.DELETE()
    )
  )
}
                                                                               

// Posibile links that can be used within different resources
const Links = {
  userCreate: link('userCreate', ResourceBases.UserCreated),

  bookmarkCreate: link('bookmarkCreate', ResourceBases.BookmarkCreated),

  bookmarkIndex: link('bookmarkIndex', resource()),

  bookmarkShow: (bookmarks) => link(
    'bookmarkShow',
    bookmarks.map(
      b => resource(ResourceBases.BookmarkShown, b)
    )
  ),

  userShow: link(
    'userShow',
    ResourceBases.UserShown
  )
}


// Exposted resources
const Resources = {
  Context: () => constants.CONTEXT,

  Vocab: () => constants.VOCAB,


  Index: (x) => resource(
    Links.userCreate,
    x
  ),


  UserCreated: (x) => resource(
    ResourceBases.UserCreated,
    Links.bookmarkIndex,
    Links.bookmarkCreate,
    Links.userShow,
    x
  ),


  BookmarkCreated: (x) => resource(
    ResourceBases.BookmarkCreated,
    Links.bookmarkIndex,
    x
  ),


  BookmarkListShown: (x, bookmarks) => resource(
    ResourceBases.BookmarkListShown,
    Links.bookmarkCreate,
    Links.bookmarkShow(bookmarks)
  ),

  
  BookmarkShown: (bookmark) => resource(
    ResourceBases.BookmarkShown,
    link('agent', ResourceBases.UserShown),
    Links.bookmarkIndex,
    Links.bookmarkCreate,
    bookmark
  ),


  UserShown: (x) => resource(
    ResourceBases.UserShown,
    x
  )

}
  
module.exports = Resources;
