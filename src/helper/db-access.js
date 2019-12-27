module.exports = class DAO {
  constructor(hadler) {
    const { attributesManager } = hadler;
    this.attributesManager = attributesManager;
  }

  async getTemplateActionMode() {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    return persistentAttributes.template_action;
  }

  async setTemplateActionMode(mode) {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    persistentAttributes.template_action = mode;
    this.save(persistentAttributes);
  }

  async getData() {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    return persistentAttributes.data;
  }

  async createData(data) {
    this.putData([data]);
  }

  async putData(data) {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    persistentAttributes.data = data;
    this.save(persistentAttributes);
  }

  async clearData() {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    persistentAttributes.data = [];
    this.save(persistentAttributes);
  }

  async pushData(data) {
    let persistentAttributes = await this.attributesManager.getPersistentAttributes();
    persistentAttributes.data.push(data);
    this.save(persistentAttributes);
  }

  async save(persistentAttributes) {
    this.attributesManager.setPersistentAttributes(persistentAttributes);
    await this.attributesManager.savePersistentAttributes();
  }
}