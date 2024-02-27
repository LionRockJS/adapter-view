import fs from 'node:fs';

const loadSettings = themePath => {
  if (!themePath) return { current: {} };

  // TODO: cache config
  const configPath = `${themePath}/config/settings_data.json`;
  if (!fs.existsSync(configPath)) return { current: {} };

  const configText = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(configText);

  if (!config) return { current: {} };
  if (config.current === 'Default') {
    config.current = config.presets.Default;
  }
  return config;
};

const loadSectionSettings = (themePath, sectionName) => {
  if (!themePath) return {};

  const config = loadSettings(themePath);
  config.current.sections[sectionName] = config.current.sections[sectionName] || {};

  // get the section setting
  return config.current.sections[sectionName].settings;
};

export default {
  loadSectionSettings,
  loadSettings,
}