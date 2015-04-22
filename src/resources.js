//  This is a side-effect free zone!

const _ = require('lodash');
const Immutable = require('immutable')
const Map = Immutable.Map
const im = Immutable.fromJS
const constants = require('./constants')
const hydraUtils = require('./hydra-utils')
const resource = hydraUtils.resource
const POST = hydraUtils.POST
const DELETE = hydraUtils.DELETE

// What resources look like as links or full resources

const ResourceBases = {
  UserCreated: im({
    'operation': [
      POST(
        im({
          'returns': 'UserCreated'
        })
      )
    ]
  }), 


  BookmarkCreated: im({
    'operation': [
      POST(
        im({
          'returns': 'BookmarkCreated'
        })
      )
    ]
  }),


  BookmarkShown: im({
      'operation': [DELETE]
  }),


  UserShown: im({
      'operation':[DELETE]
  })
}
                                                                               

// Posibile links that can be used within different resources
const Links = {
  userCreate: ResourceBases.UserCreated,
  bookmarkCreate: ResourceBases.BookmarkCreated,
  bookmarkIndex: im({}),
  bookmarkShow: (bookmark) => (
    ResourceBases.BookmarkShown.merge(
      im(bookmark)
    )
  )
}

// Exposted resources
const Resources = {
  Context: () => constants.CONTEXT,
  Vocab: () => constants.VOCAB,
  Index: (x) => resource(
    undefined,
    im({
      'userCreate': Links.userCreate
    }),
    x
  ),

  UserCreated: (x) => resource(
    ResourceBases.UserCreated,
    im({
      'bookmarkIndex': Links.bookmarkIndex,
      'bookmarkCreate': Links.bookmarkCreate
    }),
    x
  ),


  BookmarkCreated: (x) => resource(
    ResourceBases.BookmarkCreated,
    im({
      'bookmarkIndex': Links.bookmarkIndex
    }),
    x
  ),


  BookmarkListShown: (x, bookmarks) => resource(
    ResourceBases.BookmarkListShown,
    im({
        'bookmarkShow': _.map(bookmarks || [], Links.bookmarkShow),
        'bookmarkCreate': Links.bookmarkCreate
    }),
    x
  ),

  
  BookmarkShown: (bookmark) => resource(
    ResourceBases.BookmarkShown,
    im({
      'agent': ResourceBases.UserShown,
      'bookmarkIndex': Links.bookmarkIndex,
      'bookmarkCreate': Links.bookmarkCreate
    }),
    bookmark
  ),

  UserShown: (x) => resource(
    ResourceBases.UserShown,
    undefined,
    x
  )

}
  
module.exports = Resources;
