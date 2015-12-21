window.nar = (function( window ){
  var obj = {
    'current_version' : '0.1',
    'api' : {},
    'provide_default_callback' : true,
    'current_event' : '',
    'current_view' : '',
  };
  var $ = window.jQuery;

  obj.version = function(){
    return 'Currently running version ' + obj.current_version + ' of TBA Analysis';
  }

  obj.draw = function () {
    console.log( 'View ' + obj.current_view + ' / Event ' + obj.current_event )
    obj.renderer.notify();

    $('li[data-event=' + obj.current_event + ']').addClass('selected');
  }

  obj.renderer = {
    'callbacks' : [],
    'register' : function ( callback ) {
      obj.renderer.callbacks.push( callback );
    },
    'notify' : function () {
      obj.renderer.callbacks.forEach( function( callback ) {
        callback( obj );
      } );
    }
  }

  obj.selectView = function ( view ) {
    obj.current_view = view;
    obj.draw();
  }

  obj.selectEvent = function ( event_key ) {
    obj.current_event = event_key;
    obj.draw();
  }

  obj.displayTeamList = function() {

    if ( obj.current_view !== 'team-list' ) {
      return;
    }
    if ( obj.current_event == '' ) {
      return;
    }

    var event_key = obj.current_event;
    var teams = obj.api.TBA.event.teams( event_key );
    var htmlTeamList = htmlTable([
      'Number',
      'Team Name'
    ]);
    teams.then( function( teams ){
      teams.forEach( function( team ) {
        htmlTeamList.add([
          team.team_number,
          team.nickname,
        ]);
      } );
      $('#results').html( htmlTeamList.getHTML() );
      $("#results table").tablesorter( {
        sortList: [[0,0]],
      });
    } );

  }
  obj.renderer.register( obj.displayTeamList );

  obj.displayListYearlyAverage = function( year ) {

    if ( obj.current_event == '' ) {
      return;
    }

    var event_key = obj.current_event;
    var teamData = obj.getTeamsYearAverageByEvent( event_key, year );

    var htmlTeamList = htmlTable([
      'Team',
      'Qualification Score',
      'Quarterfinals Score',
      'Semifinals Score',
      'Finals Score',
      'Events',
    ]);
    teamData.then( function( teams ){
      teams.forEach( function( team ) {
        team = MatchHelper.cleanStats( team );
        team = MatchHelper.cleanTeam( team );
        team = MatchHelper.stripZeros( team );
        htmlTeamList.add([
          team.key,
          team.qm,
          team.qf,
          team.sf,
          team.f,
          team.event_count,
        ]);
      } );

      $('#results').html( htmlTeamList.getHTML() );
      $("#results table").tablesorter( {
        sortList: [[0,0]],
      });
    } );

  }
  obj.renderer.register( function(){
    if ( obj.current_view === '2015-avg-score' ) {
      obj.displayListYearlyAverage( "2015" );
    }
  } );
  obj.renderer.register( function(){
    if ( obj.current_view === '2014-avg-score' ) {
      obj.displayListYearlyAverage( "2014" );
    }
  } );
  obj.renderer.register( function(){
    if ( obj.current_view === '2013-avg-score' ) {
      obj.displayListYearlyAverage( "2013" );
    }
  } );

  obj.getTeamsYearAverageByEvent = function( event_key, year ) {

    if ( typeof event_key === "undefined" ) {
      throw "No event key argument provided.";
    }
    if ( typeof year === "undefined" ) {
      throw "No year argument provided.";
    }

    var teams = obj.api.TBA.event.teams( event_key );
    return new Promise( function( resolve, reject ) {
      var teamResults = [];
      teams.then( function( teamList ){
        teamList.forEach( function( team ){
          teamResults.push( obj.getTeamYearAverage( team.key, year ) );
        } );
        Promise.all( teamResults ).then( function( results ){
          resolve( results );
        } );
      } )
    } );
  }

  obj.getTeamYearAverage = function( team_key, year ) {
    if ( typeof team_key === "undefined" ) {
      throw "No team key argument provided.";
    }
    if ( typeof year === "undefined" ) {
      throw "No year argument provided.";
    }

    var eventList = obj.api.TBA.team.event.list( team_key, year );
    return new Promise( function( resolve, reject ) {
      eventList.then( function( data ){
        var eventResults = [];
        data.forEach( function( event ){
          eventResults.push( obj.getTeamEventAverage( team_key, event.key ) );
        } );

        var scores = {
          'key' : team_key,
          'year' : year,
          'qm' : 0,
          'ef' : 0,
          'qf' : 0,
          'sf' : 0,
          'f' : 0,
          'event_count' : 0,
        }
        Promise.all(eventResults).then( function( results ) {

          results.forEach( function( result ){
            scores.qm += result.qm;
            scores.ef += result.ef;
            scores.qf += result.qf;
            scores.sf += result.sf;
            scores.f  += result.f;
          } );

          scores.qm = scores.qm/results.length;
          scores.ef = scores.ef/results.length;
          scores.qf = scores.qf/results.length;
          scores.sf = scores.sf/results.length;
          scores.f  = scores.f/results.length;
          scores.event_count = results.length;
          resolve( scores );

        });
      } );
    });
  }

  obj.getTeamEventAverage = function( team_key, event_key ) {

    if ( typeof team_key === "undefined" ) {
      throw "No team key argument provided.";
    }
    if ( typeof event_key === "undefined" ) {
      throw "No event key argument provided.";
    }

    matches = obj.api.TBA.team.event.matches( team_key, event_key );
    return new Promise( function( resolve, reject ) {
      matches.then( function( data ) {
        var sorted = MatchHelper.separateMatches( data );
        resolve({
          'team'  : team_key,
          'event' : event_key,
          'qm'    : MatchHelper.getMatchesAverage( team_key, sorted.qm ),
          'ef'    : MatchHelper.getMatchesAverage( team_key, sorted.ef ),
          'qf'    : MatchHelper.getMatchesAverage( team_key, sorted.qf ),
          'sf'    : MatchHelper.getMatchesAverage( team_key, sorted.sf ),
          'f'     : MatchHelper.getMatchesAverage( team_key, sorted.f ),
        });
      } );
    } );
  }

  var MatchHelper = {
    'separateMatches' : function ( matches ) {
      var results = {
        "qm" : [],
        "ef" : [],
        "qf" : [],
        "sf" : [],
        "f"  : [],
      };

      matches.forEach( function ( entry ) {
        results[ entry.comp_level ].push(entry);
      } );

      return results;
    },
    'getMatchesAverage' : function ( team_key, matches ) {
      if ( matches.length < 1 ) {
        return 0;
      }

      var total = 0;
      var count = 0;
      matches.forEach( function( match ) {

        var alliance = MatchHelper.findMatchTeamAlliance( team_key, match );
        if ( alliance === "none" ) {
          return;
        }

        var score = match.alliances[alliance].score;
        total += score;
        count += 1;

      } );
      return total / count;
    },
    'findMatchTeamAlliance' : function ( team_key, match ) {
      var blue_teams = match.alliances.blue.teams;
      if ( blue_teams.indexOf( team_key ) !== -1 ) {
        return 'blue';
      }

      var red_teams = match.alliances.red.teams;
      if ( red_teams.indexOf( team_key ) !== -1 ) {
        return 'red';
      }

      return 'none';
    },
    'cleanStats' : function ( summary ) {
      var round = MatchHelper.round;
      summary.qm = round( summary.qm, 1 );
      summary.ef = round( summary.ef, 1 );
      summary.qf = round( summary.qf, 1 );
      summary.sf = round( summary.sf, 1 );
      summary.f = round( summary.f, 1 );
      return summary;
    },
    'cleanTeam' : function ( summary ) {
      summary.key = summary.key.replace( "frc", "" );
      return summary;
    },
    'stripZeros' : function ( summary ) {
      summary.qm = ( summary.qm == 0 ? '-' : summary.qm )
      summary.ef = ( summary.ef == 0 ? '-' : summary.ef )
      summary.qf = ( summary.qf == 0 ? '-' : summary.qf )
      summary.sf = ( summary.sf == 0 ? '-' : summary.sf )
      summary.f = ( summary.f == 0 ? '-' : summary.f )
      return summary;
    },
    'round' : function ( number, places ) {
      var factor = Math.pow( 10, places );
      return ( Math.round( number * factor ) / factor );
    }
  };

  obj.defaultCallback = function( results ){
    console.log( 'No callback provided. Printing to log.')
    console.log( results );
  };

  obj.parseCallback = function( callback ) {

    if ( obj.provide_default_callback === false ) {
      return callback;
    }

    if ( typeof callback !== "function" ) {
      callback = obj.defaultCallback;
    }
    return callback;

  }

  var htmlTable = function( columns ){
    var obj = {
      'columns' : columns,
      'data' : [],
    };

    obj.add = function( row_data ) {
      obj.data.push( row_data );
    }

    obj.getHTML = function() {

      var head = '<tr>';
      obj.columns.forEach( function( value ){
        head += '<th>' + value + '</th>';
      } );
      head += '</tr>';

      var rows = '';
      obj.data.forEach( function( values ){
        var rowHTML = '<tr>';
        values.forEach( function( value ){
          rowHTML += '<td>' + value + '</td>';
        } );
        rowHTML += '</tr>';
        rows += rowHTML;
      } );

      return '<table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>';

    }

    return obj;
  }

  return obj;
})(window);
