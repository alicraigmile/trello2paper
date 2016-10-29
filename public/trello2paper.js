function onError(e) {
    console.log('trello2paper error');
    console.log(e);
    if(e.status == 401 || e.status == 400) {
        $('#authorize').fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        $('#authorizeerror').text(e.responseText);
    } 
    console.log(e);
}

function onAuthorizeClicked() {

    developerkey = $('#developerkey').val();

    var src = "https://api.trello.com/1/client.js?key=" + developerkey;
    $.getScript( src, function( data, textStatus, jqxhr ) {
        console.log( data ); // Data returned
        console.log( textStatus ); // Success
        console.log( jqxhr.status ); // 200
        console.log( "Load was performed." );

        opts = {
						type: "popup",
						name: "trello2paper",
            success: onAuthorized,
            error: onError
        };
        Trello.authorize(opts);

    });              
}

function onLogoutClicked() {

		DisableControl('getboards');
		DisableControl('getlists');
		DisableControl('boardslist');
		DisableControl('listslist');
		DisableControl('print');
		ClearLists();
		ClearBoards();
		ClearCards();

		DisableControl('logout');
		HideControl('logout');
		EnableControl('authorize');
		ShowControl('authorize');
}


function setAuthorizedAsText(username) {
    $('#authorizedas').text('Logged in as: ' + username);
}

function clearAuthorizedAsText() {
    $('#authorizedas').text('');
}

function clearErrors() {
    $('#authorizeerror').text('');
}

function onAuthorized() {
    console.log('onAuthorized: logged in');

		DisableControl('authorize');
		HideControl('authorize');
		EnableControl('logout');
		ShowControl('logout');

    preserveDeveloperKey();
    clearErrors();
    GetBoards();
}

function onRefreshBoardsClicked() {
    GetBoards();
}
            
function onBoardChanges() {
    GetLists();
}

function ShowControl(id) {
    $('#' + id).show();
}

function HideControl(id) {
    $('#' + id).hide();
}

function EnableControl(id) {
    $('#' + id).prop('disabled', false);
}

function DisableControl(id) {
    $('#' + id).prop('disabled', true);
}

function onBoardsUpdated() {
    EnableControl('boardslist');
    EnableControl('getboards');
    GetLists();
}

function GetBoards() {
    id = "me";
    error = onError;
    params = { boards: "open"};
    success = function(r) {

        ClearBoards();
        ClearLists();
        ClearCards();

        $.each(r.boards,function( pos, item ) {
            $('#boardslist').append($("<option></option>")
                    .attr("value",item.id)
                    .text(item.name)); 
        });

        onBoardsUpdated();

				setAuthorizedAsText(r.fullName);

    };
    Trello.members.get(id, params, success, onError);

}

function ClearBoards() {
    $('#boardslist')
        .find('option')
        .remove();
}


function ClearCards() {
    $('#cards')
        .find('div')
        .remove()
        .end();
}

function ClearLists() {
    $('#listslist')
        .find('option')
        .remove();
}

function onRefreshListsClicked() {
    GetLists();
}

function GetLists() {
	error = onError;
	id = $('#boardslist option:selected').val();
    params = { lists: "open"};
	success = function(r) {

        ClearLists();
        ClearCards();

		$.each(r.lists,function( pos, item ) {
			$('#listslist').append($("<option></option>")
                    .attr("value",item.id)
                    .text(item.name)); 
		});

        onListsUpdated();

	};
	Trello.boards.get(id, params, success, onError);

}

function onRefreshCardsClicked() {
    GetCards();
}

function onCardsUpdated() {
    EnableControl('print');
}

function onListsUpdated() {
    EnableControl('listslist');
    EnableControl('getlists');
    GetCards();
}

function onListChanges() {
    GetCards();
}

function GetCards() {
	error = onError;
    id = $( "#listslist option:selected" ).val();
	params = { cards: "open" };
	success = function(r) {

        ClearCards();

		$.each(r.cards,function( pos, item ) {
			$('#cards').append($("<div class='card'><h2>"+item.name+"</h2><div class='desc'>"+item.desc+"</div>"));
		});

        onCardsUpdated();

		console.log(r);
	};
	Trello.lists.get(id, params, success, error);

}

function onPrintClicked() {
    window.print();
}

function getStoredDeveloperKey() {
    var developerKey = localStorage.getItem('developerKey');
		debug('Developer key retreived from local storage');
    return developerKey;
}

function setStoredDeveloperKey(developerKey) {
    localStorage.setItem('developerKey', developerKey);
}

function clearStoredDeveloperKey() {
    localStorage.removeItem('developerKey');
		debug('Developer key cleared from local storage');
}

function preserveDeveloperKey() {
    var developerKey = $('#developerkey').val();
    setStoredDeveloperKey(developerKey);
		debug('Developer key saved to local storage');
}
function initDeveloperKey() {
    var developerKey = getStoredDeveloperKey();
    if (developerKey !== null && developerKey !== undefined) {
        $('#developerkey').val(developerKey);
    }
}

function init() {
		debug('init started')

    $('#authorize').click(onAuthorizeClicked);
    $('#logout').click(onLogoutClicked);
    $('#getlists').click(onRefreshListsClicked);
    $('#listslist').on('change', onListChanges);
    $('#boardslist').on('change', onBoardChanges);
    $('#getboards').click(onRefreshBoardsClicked);
    $('#getcards').click(onRefreshCardsClicked);
    $('#print').click(onPrintClicked);
    initDeveloperKey();

	  ShowControl('authorize');
	  EnableControl('authorize');
	  DisableControl('logout');
		HideControl('logout');
		clearAuthorizedAsText();

		debug('init finished')
}

function debug(msg) {
	console.log(msg);
}

init();
