function createModal (id) {
  const elementModal = document.createElement('div')
  elementModal.setAttribute('class', 'zy-modal')
  elementModal.setAttribute('id', id)
  document.body.append(elementModal)
  document.body.style.overflow = 'hidden'
}
function removeModal (id) {
  document.body.removeChild(document.getElementById(id))
  document.body.style.overflow = 'auto'
}
export default {
  createModal, removeModal
}
