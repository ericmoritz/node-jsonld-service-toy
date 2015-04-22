const im = require('immutable').fromJS

module.exports = {
  CONTEXT:  im({
    '@context': {

      // owl:
      'owl': 'http://www.w3.org/2002/07/owl#',

      'unionOf': { '@id': 'owl:unionOf', '@type': '@id'},

      // rdfs:
      'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
      'comment': 'rdfs:comment',
      'domain': {'@id': 'rdfs:domain', '@type': '@id'},
      'range': {'@id': 'rdfs:range', '@type': '@id'},
      'label': 'rdfs:label',

      // hydra:
      'hydra': 'http://www.w3.org/ns/hydra/core#',
      'operation': 'hydra:operation',
      'returns': 'hydra:returns',
      'method': 'hydra:method',
      'CreateResourceOperation': 'hydra:CreateResourceOperation',
      'DeleteResourceOperation': 'hydra:DeleteResourceOperation',
      'supportedClass': 'hydra:supportedClass',
      'Resource': 'hydra:Resource',
      'Link': 'hydra:Link',

      // vocab:
      'bm': 'http://www.example.org/bookmarks#',
      'userCreate': 'bm:userCreate',
      'UserCreated': 'bm:UserCreated',
      'bookmarkCreate': 'bm:bookmarkCreate',
      'BookmarkCreated': 'bm:BookmarkCreated',
      'bookmarkIndex': 'bm:bookmarkIndex',
      'bookmarkShow': 'bm:bookmarkShow',

      // schema:
      'schema': 'http://schema.org/',
      'object': 'schema:object',
      'agent': 'schema:agent',
      'url': 'schema:url',
      'name': 'schema:name',
    }
  }),
  VOCAB: im({
    'supportedClass': [
      {
        '@id': 'bm:Init',
        'label': 'Initial State',
        '@type': 'Resource',
        'comment': 'The initial state'
      },
      {
        '@id': 'bm:UserCreated',
        'label': 'User created',
        '@type': 'Resource',
        'comment': 'The state after a user is created'
      },
      {
        '@id': 'bm:BookmarkListShown',
        '@type': 'Resource',
        'label': 'Bookmark List shown',
        'comment': 'The state of viewing the bookmark list'
      },
      {
        '@id': 'bm:BookmarkCreated',
        '@type': 'Resource',
        'label': 'Bookmark created',
        'comment': 'The state after a bookmark is created'
      },
      {
        '@id': 'bm:BookmarkShown',
        '@type': 'Resource',
        'label': 'Bookmark shown',
        'comment': 'The state of viewing a bookmark'
      },
      {
        '@id': 'bm:UserShown',
        'label': 'User Shown',
        '@type': 'Resource',
        'comment': 'The state of viewing a user'
      },
      {
        '@id': 'bm:userCreate',
        '@type': 'Link',
        'label': 'user create',
        'comment': 'The transition to create a user',
        'range': 'bm:UserCreated',
        'domain': {
          'unionOf': ['bm:Init']
        }
      },
      {
        '@id': 'bm:bookmarkIndex',
        'label': 'bookmark index',
        '@type': 'Link',
        'comment': 'The transition to the bookmark index',
        'range': 'bm:BookmarkListShown',
        'domain': {
          'unionOf': [
            'bm:UserCreated',
            'bm:BookmarkCreated',
            'bm:BookmarkShown',
          ]
        }
      },
      {
        '@id': 'bm:bookmarkCreate',
        'label': 'bookmark create',
        '@type': 'Link',
        'comment': 'The transition to create a bookmark',
        'range': 'bm:BookmarkCreated',
        'domain': {
          'unionOf': [
            'bm:UserCreated',
            'bm:BookmarkShown',
            'bm:BookmarkListShown'
          ]
        }
      },
      {
        '@id': 'bm:bookmarkShow',
        'label': 'bookmark show',
        '@type': 'Link',
        'comment': 'The transition to show a bookmark',
        'range': 'bm:BookmarkShown',
        'domain': {
          'unionOf': [
            'bm:BookmarkListShown',
          ]
        }
      }      
    ]
  })
}

