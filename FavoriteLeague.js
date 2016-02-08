/**
* FavoriteLeagues.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
'use strict';

module.exports = {
  connection: 'capilleiraRedisServer',
  attributes: {
    user: {
      type: 'string',
      required: true
    },
    league: {
      type: 'string',
      required: true
    }
  }
};