import { IntegrationBase } from "@budibase/types"
import { Client, Databases } from "node-appwrite";

class CustomIntegration implements IntegrationBase {
  private readonly client: Client
  private readonly databases: Databases

  constructor(config: { endpoint: string; projectId: string; apiKey: string; }) {
    this.client = new Client()
    this.databases = new Databases(this.client)
    this.client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey)
  }

  async create(query: { 
    databaseId: string; collectionId: string; key: string; required: string; 
    size: number; elements: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "String") {
      return await this.databases.createStringAttribute(query.databaseId, query.collectionId, query.key, query.size, query.required === "true")
    }
    if (query.extra.type === "Email") {
      return await this.databases.createEmailAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    if (query.extra.type === "Enum") {
      let elements: string[] = []
      if (query.elements) {
        elements = JSON.parse(query.elements)
      }
      return await this.databases.createEnumAttribute(query.databaseId, query.collectionId, query.key, elements, query.required === "true")
    }
    if (query.extra.type === "IP Address") {
      return await this.databases.createIpAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    if (query.extra.type === "URL") {
      return await this.databases.createUrlAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    if (query.extra.type === "Integer") {
      return await this.databases.createIntegerAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    if (query.extra.type === "Float") {
      return await this.databases.createFloatAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    if (query.extra.type === "Boolean") {
      return await this.databases.createBooleanAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    if (query.extra.type === "DateTime") {
      return await this.databases.createDatetimeAttribute(query.databaseId, query.collectionId, query.key, query.required === "true")
    }
    throw new Error("You must select an attribute type!")
  }

  async createIndex(query: { 
    databaseId: string; collectionId: string; key: string;
    attributes: string; extra: { [key:string]: string; } }) {
    let attributes: string[] = []
    if (query.attributes) {
      attributes = JSON.parse(query.attributes)
    }
    return await this.databases.createIndex(query.databaseId, query.collectionId, query.key, query.extra.type, attributes)
  }

  async read(query: { databaseId: string; collectionId: string; key: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Index") {
      if (query.key) {
        return await this.databases.getIndex(query.databaseId, query.collectionId, query.key)
      }
      return await this.databases.listIndexes(query.databaseId, query.collectionId)
    }
    if (query.key) {
      return await this.databases.getAttribute(query.databaseId, query.collectionId, query.key)
    }
    return await this.databases.listAttributes(query.databaseId, query.collectionId)
  }

  async delete(query: { databaseId: string; collectionId: string; key: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Index") {
      return await this.databases.deleteIndex(query.databaseId, query.collectionId, query.key)
    }
    return await this.databases.deleteAttribute(query.databaseId, query.collectionId, query.key)
  }
}

export default CustomIntegration
