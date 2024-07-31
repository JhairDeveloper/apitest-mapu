// Definir el plugin personalizado

const timestampsPlugin = (schema, options) => {
  // console.log("Ejecutando plugin  mongoose");
  schema.add({
    createdAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  });

  schema.pre("save", function (next) {
    if (this.isNew) {
      this.createdAt = Date.now();
    }
    next();
  });

  // Si deseas utilizar eliminación suave, puedes agregar
  // una función de instancia pre llamada 'softDelete'
  // que actualiza el valor de 'deletedAt'
  schema.methods.softDelete = function () {
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.deletedAt = null;
    return this.save();
  };

  schema.statics.findDeleted = function () {
    return this.find({ deletedAt: { $ne: null } });
  };
};

module.exports = timestampsPlugin;
