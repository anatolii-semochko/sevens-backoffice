const apiTest = {};
export default apiTest;

let items = {}
apiTest.setItems = (itemName, itemsList) => items[itemName] = itemsList

const urlData = (url) => {
  const match = url.match(/^\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) return [null, null];
  const itemName = match[1];
  const id = match[2] ?? null;
  return [itemName, id];
}

apiTest.get = (url) => {
  const [itemName, id] = urlData(url)
  return Promise.resolve({
    data: id ? items[itemName].find((item) => item.id === id) : items[itemName],
  })
}

apiTest.post = (url, data) => {
  const [itemName] = urlData(url)
  data.id = Math.random().toString(36).slice(2, 12)
  items[itemName].push(data)
}

apiTest.patch = (url, data) => {
  const [itemName, id] = urlData(url)
  items[itemName] = items[itemName].map((item) => {
    if (item.id === id) {
      return { ...item, ...data }
    }
    return item
  })
}

apiTest.delete = (url, data) => {
  const [itemName, id] = urlData(url)
  items[itemName] = items[itemName].filter(item => item.id !== id)
}
