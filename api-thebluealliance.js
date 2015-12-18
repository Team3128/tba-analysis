window.nar.api.TBA = (function( window ){
  var nar = window.nar;
  var obj = {
    'current_version' : '0.1',
    'team_number'     : 'frc3128',
    'app_identifier'  : 'team-analysis',
    'api_base_url'    : 'https://www.thebluealliance.com/api/v2/',
  };

  obj.version = function(){
    return 'Currently running version ' + obj.current_version + ' of TBA API';
  }

  obj.team = {};
  obj.team.get = function( team_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key given.";
    }

    path = "team/" + team_key;
    return http_get( generate_api_url( path ) );
  }

  obj.team.list = function( page_num ) {

    if ( typeof page_num === "undefined" ) {
      page_num = 1;
    }

    page_num = parseInt( page_num );
    path = "teams/" + page_num;
    return http_get( generate_api_url( path ) );

  }

  obj.team.years_participated = function ( team_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }

    path = "team/" + team_key + "/years_participated";
    return http_get( generate_api_url( path ) );

  }

  obj.team.media = function ( team_key, year ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }
    if ( typeof year === "function" ) {
      callback = year;
      year = undefined;
    }

    if ( year !== undefined ) {
      year = parseInt( year );
      path = "team/" + team_key + "/" + year + "/media";
    } else {
      path = "team/" + team_key + "/media";
    }

    return http_get( generate_api_url( path ) );

  }

  obj.team.history = {};
  obj.team.history.events = function ( team_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }

    path = "team/" + team_key + "/history/events";
    return http_get( generate_api_url( path ) );

  }

  obj.team.history.awards = function ( team_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }

    path = "team/" + team_key + "/history/awards";
    return http_get( generate_api_url( path ) );

  }

  obj.team.history.robots = function ( team_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }

    path = "team/" + team_key + "/history/robots";
    return http_get( generate_api_url( path ) );

  }

  obj.team.event = {};
  obj.team.event.list = function ( team_key, year ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }
    if ( typeof year === "undefined" ) {
      throw "Invalid year argument given.";
    }

    year = parseInt( year );
    path = "team/" + team_key + "/" + year + "/events";
    return http_get( generate_api_url( path ) );

  }

  obj.team.event.awards = function ( team_key, event_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }
    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "team/" + team_key + "/event/" + event_key + "/awards";
    return http_get( generate_api_url( path ) );

  }

  obj.team.event.matches = function ( team_key, event_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "Invalid team key argument given.";
    }
    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "team/" + team_key + "/event/" + event_key + "/matches";
    return http_get( generate_api_url( path ) );

  }

  obj.event = {};
  obj.event.list = function ( year ) {

    if ( typeof year === "undefined" ) {
      throw "Invalid year argument given.";
    }

    year = parseInt( year );
    path = "events/" + year;
    return http_get( generate_api_url( path ) );

  }

  obj.event.get = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key;
    return http_get( generate_api_url( path ) );

  }

  obj.event.teams = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key + "/teams";
    return http_get( generate_api_url( path ) );

  }

  obj.event.matches = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key + "/matches";
    return http_get( generate_api_url( path ) );

  }

  obj.event.stats = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key + "/stats";
    return http_get( generate_api_url( path ) );

  }

  obj.event.rankings = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key + "/rankings";
    return http_get( generate_api_url( path ) );

  }

  obj.event.awards = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key + "/awards";
    return http_get( generate_api_url( path ) );

  }

  obj.event.distrct_points = function ( event_key ) {

    if ( typeof event_key === "undefined" ) {
      throw "Invalid event key argument given.";
    }

    path = "event/" + event_key + "/district_points";
    return http_get( generate_api_url( path ) );

  }

  obj.match = {};
  obj.match.get = function ( match_key ) {

    if ( typeof match_key === "undefined" ) {
      throw "Invalid match key argument given.";
    }

    path = "match/" + match_key;
    return http_get( generate_api_url( path ) );

  }

  obj.district = {};
  obj.district.list = function ( year ) {

    if ( typeof year === "undefined" ) {
      throw "Invalid year argument given.";
    }

    path = "districts/" + year;
    return http_get( generate_api_url( path ) );

  }

  obj.district.events = function ( district_key, year, callback ) {

    if ( typeof district_key === "undefined" ) {
      throw "Invalid district key argument given.";
    }
    if ( typeof year === "undefined" ) {
      throw "Invalid year argument given.";
    }

    year = parseInt( year );
    path = "district/" + district_key + "/" + year + "/events";
    return http_get( generate_api_url( path ) );

  }

  obj.district.rankings = function ( district_key, year, callback ) {

    if ( typeof district_key === "undefined" ) {
      throw "Invalid district key argument given.";
    }
    if ( typeof year === "undefined" ) {
      throw "Invalid year argument given.";
    }

    year = parseInt( year );
    path = "district/" + district_key + "/" + year + "/rankings";
    return http_get( generate_api_url( path ) );

  }

  function http_get( url )
  {
    run_config_check();
    var indentifier = obj.team_number + ':' + obj.app_identifier + ':' + obj.current_version;

    var promise = new Promise( function( resolve, reject ) {

      // Resolve instantly if cache is available
      if ( obj.cache.exists( url ) ) {
        resolve( obj.cache.get( url ) );
        return true;
      }

      // Otherwise, get via resource
      var resource = new XMLHttpRequest();
      resource.open( "GET", url, true );

      resource.onload = function() {
          if ( resource.status == 200 ) {
              var data = JSON.parse(resource.responseText);
              obj.cache.put( url, data );
              resolve( data );
          } else {
            reject( Error( resource.statusText ) );
          }
      }

      resource.onerror = function() {
        reject( Error( "Network error" ) );
      }

      resource.setRequestHeader( 'X-TBA-App-Id', indentifier );
      resource.send();
    } );
    return promise;
  }

  function run_config_check() {
    if ( obj.team_number === '' || obj.app_identifier === '' ) {
      throw 'Configuration error: Please configure team_number and app_identifier';
    }
  }

  function generate_api_url( path ) {
    return obj.api_base_url + path;
  }

  obj.cache = ( function() {
    var data = window.localStorage.narCache;
    var obj = {
      'enabled' : true,
      'stats'   : {
        'writes' : 0,
        'hits'   : 0,
        'misses' : 0,
      },
    };

    obj.put = function( key, value ) {

      value = JSON.stringify( value );
      localStorage.setItem( key, value );

      obj.stats.writes += 1;
      return true;
    }

    obj.get = function( key ) {

      var result = undefined;
      if ( obj.exists ( key ) ) {
        result = localStorage.getItem( key );
        result = JSON.parse( result );
      }
      return result;
    }

    obj.exists = function( key ) {
      var result = false;
      if ( localStorage.getItem( key ) ) {
        result = true;
      }

      // Always record hits/misses for debugging
      if ( result === true ) {
        obj.stats.hits += 1;
      } else {
        obj.stats.misses += 1;
      }

      if ( obj.enabled === false ) {
        result = false;
      }
      return result;
    }

    obj.dump = function() {
      return data;
    }

    return obj;
  })();

  return obj;
})(window);
