'use strict';

var _ = require('lodash');

module.exports = {
  /*looks up whether user already exists, if it does league is added to fav league array
  if it doesnt, creates the user and adds legue*/
  createFavoriteLeague: function(params) {
    var Promise = require('bluebird');
    return new Promise(function(fullfill, reject) {
      sails.models.favoriteleagues.findOne({
        user: params.username
      }).exec(function(err, favoriteLeague) {
        var newLeagues;
        if (err) {
          reject(new Error('Error finding user'));
          console.error(err);
        }else if (favoriteLeague) {
          newLeagues =  favoriteLeague.league;
          console.log('newLeagues', newLeagues);
          sails.models.favoriteleagues.update({
            user: params.username
          },
          {
            league: newLeagues
          }).exec(function(err, favoriteLeagueUpdated) {
            if (err) {
              console.error(err);
              reject(new Error('Error creating Favorite League'));
            }else {
              fullfill(favoriteLeagueUpdated);
            }
          });
          if (_.includes(favoriteLeague.league, params.league)) {
            console.log('League already exists');
          }else {
            if (favoriteLeague.league) {
              favoriteLeague.league.push(params.league);
              console.log('New league added');
            }else {
              favoriteLeague.league = [params.league];
            }
          }
        }else {
          sails.models.favoriteleagues.create({
            league: [params.league],
            user: params.username
          }).exec(function(err, created) {
              if (err) {
                reject(new Error('Error creating Favorite League'));
              }else {
                fullfill(created);
              }
            });
        }
      });
    });
  },
  deleteFavoriteLeague: function(params) {
    var Promise = require('bluebird');
    return new Promise(function(fullfill, reject) {
      sails.models.favoriteleagues.findOne({
        user: params.username
      }).exec(function(err, favoriteLeague) {
        var newLeagues;
        if (err) {
          reject(new Error('Error finding user'));
          console.error(err);
        }else if (favoriteLeague) {
          newLeagues =  favoriteLeague.league;
          sails.models.favoriteleagues.update({
            user: params.username
          },
          {
            league: newLeagues
          }).exec(function(err, favoriteLeagueUpdated) {
            if (err) {
              console.error(err);
              reject(new Error('Error updating'));
            }else {
              fullfill(favoriteLeagueUpdated);
            }
          });
          if (_.includes(favoriteLeague.league, params.league)) {
            console.log('League deleted from favorites');
            _.pull(favoriteLeague.league, params.league);
          }
        }
      });
    });
  },
  /*leagues get are refreshed when loading sports view for the first time
  or if changes to favorites are made*/
  getFavoriteLeagues: function(params) {
    var Promise = require('bluebird');
    return new Promise(function(fullfill, reject) {
      sails.models.favoriteleagues.findOne({
        user: params.username
      }).exec(function(err, favoriteLeagues) {
        if (err) {
          reject(new Error('Error finding favorite leagues'));
          console.error(err);
        }else {
          if (favoriteLeagues) {
            fullfill(favoriteLeagues.league);
          }else {
            sails.models.favoriteleagues.create({
              league: [],
              user: params.username
            }).exec(function(err, created) {
              if (err) {
                console.error(err);
                reject(new Error('Error creating Favorite League'));
              }else {
                fullfill(created);
              }
            });
          }
        }
      });
    });
  }
};
