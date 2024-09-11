import {Central} from '@lionrockjs/central';

export default class Translate{
  static values = new Map();
  static update(){
    /* translates format:
    {
      'en': { 'language': 'English', foo: {name:"foo"} },
      'zh-hant': { 'language': '繁體中文', foo: {name:"扶"} },
      'zh-hans': { 'language': '简体中文', foo: {name:"夫"} },
    }

    this.values format:
    "language" => "English"
    "foo.name" => "foo"
   */
    const languages= Object.keys(Central.config.liquidjs.translates);

    //create maps
    languages.forEach(language => {
      this.values.set(language, new Map());
      this.setKey('', Central.config.liquidjs.translates[language], language);
    });
  }

  static setKey(key, value, language='en'){
    if(typeof value === 'object'){
      Object.keys(value).forEach(subKey => {
        this.setKey(`${key}.${subKey}`, value[subKey], language);
      });
    }else{
      this.values.get(language).set(key.replace(/^./, ''), value);
    }
  }

  static t(key, language='en'){
    const languageKeys = this.values.get(language);
    if(!languageKeys) {
      Central.log('translate key not found : '+ key);
      return "";
    }
    return languageKeys.get(key);
  }
}