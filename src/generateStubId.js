import uuidv1 from 'uuid/v1'

export default () => {
  let id = uuidv1()
  return id = id.replace(/-/g, '')
}
