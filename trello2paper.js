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
            success: onAuthorized,
            error: onError
        };
        Trello.authorize(opts);

    });              
}

function clearErrors() {
    $('#authorizeerror').text('');
}

function onAuthorized() {
    console.log('logged in');
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
    return developerKey;
}

function setStoredDeveloperKey(developerKey) {
    localStorage.setItem('developerKey', developerKey);
}

function clearStoredDeveloperKey() {
    localStorage.removeItem('developerKey');
}

function preserveDeveloperKey() {
    var developerKey = $('#developerkey').val();
    setStoredDeveloperKey(developerKey);
}
function initDeveloperKey() {
    var developerKey = getStoredDeveloperKey();
    if (developerKey !== null && developerKey !== undefined) {
        $('#developerkey').val(developerKey);
    }
}

function init() {
    $('#authorize').click(onAuthorizeClicked);
    $('#getlists').click(onRefreshListsClicked);
    $('#listslist').on('change', onListChanges);
    $('#boardslist').on('change', onBoardChanges);
    $('#getboards').click(onRefreshBoardsClicked);
    $('#getcards').click(onRefreshCardsClicked);
    $('#print').click(onPrintClicked);
    initDeveloperKey();
	EnableControl('authorize');
}

init();
