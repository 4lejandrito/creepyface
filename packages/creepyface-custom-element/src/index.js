import creepyface from 'creepyface'

customElements.define(
  'creepy-face',
  class extends HTMLImageElement {
    connectedCallback() {
      this.cancel = creepyface(this)
    }
    disconnectedCallback() {
      this.cancel && this.cancel()
    }
  },
  { extends: 'img' }
)
