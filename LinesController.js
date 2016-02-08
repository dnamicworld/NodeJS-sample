/**
 * LinesController
 *
 * @description :: Server-side logic for managing Lines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict';

var validator = require('validator'),
    _ = require('lodash'),
    validateLineParams = function(lineParams) {
      var lineParamsOk = false;
      if (((lineParams.familyGameId &&
        lineParams.games &&
        lineParams.top &&
        lineParams.leagues &&
        lineParams.periods &&
        lineParams.part)) && (validator.isNumeric(lineParams.familyGameId) &&
        validator.isNumeric(lineParams.games) &&
        validator.isNumeric(lineParams.top) &&
        validator.isNumeric(lineParams.sports) &&
        validator.isLength(lineParams.leagues.trim(), 1) &&
        validator.isAscii(lineParams.leagues.trim()) &&
        validator.isLength(lineParams.periods.trim(), 1) &&
        validator.isAscii(lineParams.periods.trim()) &&
        validator.isLength(lineParams.part.trim(), 1) &&
        validator.isAscii(lineParams.part.trim()))) {
        /*
         * TODO: Add validation for each element in the array
         * */
        lineParamsOk = true;

      }
      return lineParamsOk;
    };

module.exports = {
  createFavoriteLeague: function(req, res) {
    var cookieToken = req.cookies[sails.config.capilleiraCookieName];
    sails.services.jwtservice.decodeCookieToken(cookieToken).then(function(decoded) {
      sails.services.leaguesservice.createFavoriteLeague(_.assign(decoded, req.body)).then(function() {
        res.json(200, {msg: 'OK'});
      }, function(err) {
        res.json(400, err);
      });
    }, function(err) {
      res.json(400, {message: err.message});
    });
  },
  deleteFavoriteLeague: function(req, res) {
    var cookieToken = req.cookies[sails.config.capilleiraCookieName];
    sails.services.jwtservice.decodeCookieToken(cookieToken).then(function(decoded) {
      sails.services.leaguesservice.deleteFavoriteLeague(_.assign(decoded, req.body)).then(function() {
        res.json(200, {msg: 'OK'});
      }, function(err) {
        res.json(400, err);
      });
    }, function(err) {
      res.json(400, {message: err.message});
    });
  },
  retrieveFavoriteLeagues: function(req, res) {
    var cookieToken = req.cookies[sails.config.capilleiraCookieName];
    sails.services.jwtservice.decodeCookieToken(cookieToken).then(function(decoded) {
      sails.services.leaguesservice.getFavoriteLeagues(decoded).then(function(favoriteLeagues) {
        res.json(200, favoriteLeagues);
      }, function(err) {
        res.json(400, {message: err.message});
      });
    }, function(err) {
      res.json(400, {message: err.message});
    });
  },
  lines: function(req, res) {
    var lineParams = req.body,
      cookieToken;

    if (validateLineParams(lineParams)) {
      cookieToken = req.cookies[sails.config.capilleiraCookieName];
      sails.services.jwtservice.decodeCookieToken(cookieToken)
        .then(function(decoded) {
        sails.services.linesservice.getLines(_.assign(lineParams,
          {customerId: decoded.customer})).then(function(lines) {
          res.json(200, lines);
        }, function(err) {
          res.json(400, {message: err.message});
        });
      }, function(err) {
        res.json(400, {message: err.message});
      });
    }else {
      res.json(400, {error: 'Error retrieving lines'});
    }
  }

};
