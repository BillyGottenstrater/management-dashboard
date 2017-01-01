/**
 * users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        username: 'string',
        password: 'string',
        first_name: 'string',
        last_name: 'string',
        email: 'string',
        picture: 'binary',
        is_moderator: 'boolean',
        status: 'string',
        user_status_id: {
            model: 'userStatus'
        },
        last_activity: 'time',
        facebookId: {
            type: 'string',
            required: true,
            unique: true
        }
    }
};
