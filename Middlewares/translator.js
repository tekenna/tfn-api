const { TranslationServiceClient } = require("@google-cloud/translate");

// const translationClient = new TranslationServiceClient();
const { Translate } = require("@google-cloud/translate").v2;
const CREDENTIALS = require("../gc.json");

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
});

const translator = {
  detectLanguage: async (text) => {
    try {
      let response = await translate.detect(text);
      return response[0].language;
    } catch (error) {
      throw error;
    }
  },
  translateText: async (text, target) => {
    try {
      let [response] = await translate.translate(text, target);
      return response;
    } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      throw error;
    }
  },
};

module.exports = translator;
