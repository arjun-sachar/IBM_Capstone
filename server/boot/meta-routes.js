module.exports = function(app) {
  // Returns {modelName: xxx, acls: []}
  app.get('/api/meta/models', (req, res) => {
    const activeModels = app
      .models()
      .filter((model) => {
        return (
          model.config.public &&
          model.settings.acls &&
          model.modelName != 'FilterData'
        );
      })
      .map((model) => {
        return {
          modelName: model.modelName,
          acls: model.settings.acls,
          remoteMethods: model.settings.methods,
        };
      });
    res.json(activeModels);
  });
};
