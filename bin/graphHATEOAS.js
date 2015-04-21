const rdfstore = require('rdfstore')
const Q = require('Q')
const ss = require('stream-string')
const fs = require('fs')


function parse(data) {
  return Q.nbind(rdfstore.create, rdfstore)().then(
    store => Q.nbind(store.load, store)(
      'text/turtle',
      data
    ).thenResolve(store)
  )
}


function query(graph) {
  return Q.ninvoke(
    graph, 'execute',
    `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    
    SELECT ?range ?transition ?domain
    WHERE {
      ?transitionURI rdfs:range ?rangeURI .
      ?transitionURI rdfs:label ?transition .
      ?rangeURI rdfs:label ?range .
  
      ?transitionURI rdfs:domain ?domainUnion .
      ?domainUnion owl:unionOf ?domainURI .
      ?domainURI rdfs:label ?domain .
        
    }
    `
  )    
}

function readData() {
  return ss(process.stdin)
}

readData().then(
  x => x.toString()
).then(
  parse
).then(
  query
).then(
  result => {
    console.log("digraph states {")
    result.forEach(
      item => {
        console.log(`    "${item.domain.value}" -> "${item.range.value}" [ label = "${item.transition.value}" ]`)
      }
    )
    console.log("}")
    
  }
).done()

