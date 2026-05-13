const loadSettings = async (themePath: string, sectionFile?: string) => {
  if (!themePath) return { current: {} };

  const configPath = `${themePath}/config/settings_data.json`;
  try {
    const { default: config } = await import(configPath, { with: { type: 'json' } });
    if (!config) return { current: {} };
    if (config.current === 'Default') {
      config.current = config.presets.Default;
    }
    return config;
  } catch {
    return { current: {} };
  }
};

const loadSectionSettings = async (themePath: string, sectionName: string) => {
  if (!themePath) return {};

  const config = await loadSettings(themePath);
  config.current.sections = config.current.sections || {};
  config.current.sections[sectionName] = config.current.sections[sectionName] || {};

  // get the section setting
  return config.current.sections[sectionName].settings;
};

export default {
  loadSectionSettings,
  loadSettings,
}
