const match = /^(.*)\//.exec(window.location.href)
let baseURL: string = ''

if (match) {
  baseURL = match[1]
}

export default baseURL
