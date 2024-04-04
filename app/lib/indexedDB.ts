import type { Chat, Messages } from '~/types'

//note: I could skip this altogether and just use
//a cloud based kv store like vercel kv, or redis,
//and simplify this quite a bit.
//But since this is just a prototype,
//I'll just use indexedDB.

//localstorage won't serve any good here
//since it's synchronous and can't handle large amounts of data
//for something like chatGPT.

const DB_NAME = 'chatgpt-clone'
const DB_VERSION = 1
const STORE_NAME = 'chats'

//This function opens the database and creates the object store.
//It returns the request object for the database.
//This function will not create a new database if the database already exists.
const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      const connection = indexedDB.open(DB_NAME, DB_VERSION)

      connection.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('chatIdIndex', 'id', { unique: true })
        }
      }

      connection.onsuccess = () => resolve(connection.result)
      connection.onerror = () => reject(connection.error)
    }
  })
}

const createChat = async (chat: Chat) => {
  const db = await openDB()

  if (db) {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const os = tx.objectStore(STORE_NAME)

    const req = os.add(chat)

    req.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error
      console.error('Failed to create chat:', error?.message)
    }
    req.onsuccess = () => {
      console.log('Chat created successfully!')
      window.dispatchEvent(new CustomEvent('chat-created', { detail: chat }))
    }
  }
}

export const getChats = (): Promise<Chat[]> => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB()

    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const os = tx.objectStore(STORE_NAME)
      const req = os.getAll() as IDBRequest<Chat[]>

      req.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error
        reject(error)
      }

      req.onsuccess = () => {
        resolve(req.result ?? [])
        console.log('Chats retrieved successfully!')
      }
    }
  })
}

export const getChat = async (id: string): Promise<Chat> => {
  return new Promise(async (resolve) => {
    const db = await openDB()

    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const os = tx.objectStore(STORE_NAME)

      const req = os.get(id) as IDBRequest<Chat>

      req.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error
        console.error(`Failed to get chat: ${error?.message}`)
      }
      req.onsuccess = () => {
        resolve(req.result)
        console.log('Chat retrieved successfully!')
      }
    }
  })
}

export const updateChatTitle = async (id: string, title: string) => {
  const db = await openDB()

  if (db) {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const os = tx.objectStore(STORE_NAME)

    const req = os.get(id) as IDBRequest<Chat>

    req.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error
      console.error('Failed to get chat:', error?.message)
    }

    req.onsuccess = () => {
      const chat = req.result
      chat.title = title

      os.put(chat)
      console.log('Chat title updated successfully!')
      window.dispatchEvent(new CustomEvent('chat-classified', { detail: chat }))
    }
  }
}

export const storeMessages = async (id: string, messages: Messages) => {
  const db = await openDB()

  if (db) {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const os = tx.objectStore(STORE_NAME)

    const chat = await new Promise<Chat | undefined>((resolve, reject) => {
      const req = os.get(id)
      req.onerror = () => reject((req as IDBOpenDBRequest).error)
      req.onsuccess = () => resolve(req.result)
    })

    //optimistically creates a new chat if it doesn't exist
    if (!chat) {
      return await createChat({
        id,
        messages,
        createdAt: new Date()
      })
    }

    chat.messages = messages
    const req = os.put(chat)

    req.onerror = (event) => {
      const error = (event.target as IDBOpenDBRequest).error
      console.error('Failed to store message:', error?.message)
    }
    req.onsuccess = () => {
      console.log('Messages stored successfully!')
    }
  }
}

export const getMessages = async (id: string): Promise<Messages> => {
  return new Promise(async (resolve) => {
    const db = await openDB()

    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const os = tx.objectStore(STORE_NAME)

      const chat = await new Promise<Chat | undefined>((resolve, reject) => {
        const req = os.get(id)
        req.onerror = () => reject((req as IDBOpenDBRequest).error)
        req.onsuccess = () => resolve(req.result)
      })

      if (chat) {
        resolve(chat.messages)
      }
    }
  })
}
