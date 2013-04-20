var common = {
    En: {
        entityHasNotProperty: "Entity hasn't property '{0}'",
        invalidDataFormat : "Invalid data format"
    },
    Ru: {
        entityHasNotProperty: "Сущность не содержит свойство: '{0}'",
        invalidDataFormat : "Неверный формат данных"
    }
},

messages = {
    ru: {
        register:
        {
            invalidData: "Неверные регистрационные данные",
            entityHasNotProperty: common.Ru.entityHasNotProperty,
            invalidDataFormat : common.Ru.invalidDataFormat,
            successfullyRegistered : "Регистрация прошла успешно"
        },

        signin: {
            invalidData: "Неверные данные для авторизации пользователя",
            entityHasNotProperty: common.Ru.entityHasNotProperty,
            invalidDataFormat : common.Ru.invalidDataFormat
        }
    },
    en:
    {
        register:
        {
            invalidData: "Invalid data for user registration",
            entityHasNotProperty: common.En.entityHasNotProperty,
            invalidDataFormat : common.En.invalidDataFormat,
            successfullyRegistered : "Registration successfully completed"
        },

        signin: {
            invalidData: "Not valid data for user authorization",
            entityHasNotProperty: common.En.entityHasNotProperty,
            invalidDataFormat : common.En.invalidDataFormat
        }
    }
};

exports.messages = messages;