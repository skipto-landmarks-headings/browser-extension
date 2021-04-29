const o = new MutationObserver(mutationRecords => {
  const shouldCheck = mutationRecords.some(mutationRecord => mutationRecord.type === 'childList' && mutationRecord.addedNodes.length)

  const addedNodes = mutationRecords.reduce((aN, mutationRecord) => aN.concat(...mutationRecord.addedNodes), [])

  const undefinedNodes = document.querySelectorAll(':not(:defined)')

  if (shouldCheck) {
    console.info(undefinedNodes, addedNodes);

    [...undefinedNodes].forEach(n => customElements.whenDefined(n.localName).then(() => console.info(`${n.localName} defined`)))
  }
})

o.observe(document.body, { attributes: true, childList: true })

class FooDoozzz extends HTMLElement { connectedCallback () { this.textContent = 'FUUUUUCK' }  }

// Will tell you that a "foo-doozzz" element that's undefined has been added
document.body.appendChild(document.createElement('foo-doozzz'))

// Will define "foo-doozzz", and you event fires telling you it was defined an there are no longer any undefined elements
customElements.define('foo-doozzz', FooDoozzz)

// You'll see an event fired telling you an element was added, but there are no undefined elements still
document.body.appendChild(document.createElement('foo-doozzz'))
