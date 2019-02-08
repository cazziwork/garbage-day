module.exports = class DAO {
  constructor(hadler) {
    const { attributesManager } = hadler;
    this.attributesManager = attributesManager;
  }

  async getData() {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    return persistentAttributes.data;
  }

  async createData(data) {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    persistentAttributes.data = data;
    this.save(persistentAttributes);
  }

  async insertData(data) {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    persistentAttributes.push(data);
    this.save(persistentAttributes);
  }

  async save(persistentAttributes) {
    this.attributesManager.setPersistentAttributes(persistentAttributes);
    await this.attributesManager.savePersistentAttributes();
  }
}