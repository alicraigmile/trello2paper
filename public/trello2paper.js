var config = null;

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

    var developerKey = config['trello-developer-key'];

    var src = "https://api.trello.com/1/client.js?key=" + developerKey;
    $.getScript( src, function( data, textStatus, jqxhr ) {
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
		DisableSpectrumControl('cardColour');
		DisableControl('print');

		ClearLists();
		ClearBoards();
		ClearCards();

		DisableControl('logout');
		HideControl('logout');
		EnableControl('authorize');
		ShowControl('authorize');
		clearAuthorizedAsText();
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
    debug('onAuthorized: logged in');

		DisableControl('authorize');
		HideControl('authorize');
		EnableControl('logout');
		ShowControl('logout');

    clearErrors();
    GetBoards();
}

function onRefreshBoardsClicked() {

    //ClearBoards();
    //ClearLists();
    //ClearCards();

    DisableControl('getlists');
    DisableControl('boardslist');
    DisableControl('listslist');
    DisableSpectrumControl('cardColour');
    DisableControl('print');

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

function EnableSpectrumControl(id) {
		debug('enable spectrum control ' + id);
    $('#' + id).spectrum('enable');
}

function DisableSpectrumControl(id) {
		debug('disable spectrum control ' + id);
    $('#' + id).spectrum('disable');
}

function onBeforeBoardsUpdated() {
		ClearBoards();
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

				onBeforeBoardsUpdated();

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
    //ClearLists();
    ClearCards();

    DisableControl('listslist');
    DisableSpectrumControl('cardColour');
    DisableControl('print');

    GetLists();
}

function GetLists() {
	error = onError;
	id = $('#boardslist option:selected').val();
    params = { lists: "open"};
	success = function(r) {

				onBeforeListsUpdated();

		$.each(r.lists,function( pos, item ) {
			$('#listslist').append($("<option></option>")
                    .attr("value",item.id)
                    .text(item.name)); 
		});

        onListsUpdated();

	};
	Trello.boards.get(id, params, success, onError);

}

function onBeforeCardsUpdated() {
		ClearCards();
}

function onRefreshCardsClicked() {
    GetCards();
}

function onCardsUpdated() {
    EnableSpectrumControl('cardColour');
    EnableControl('print');
}

function onBeforeListsUpdated() {
		ClearLists();
		ClearCards();
}

function onListsUpdated() {
    EnableControl('listslist');
    EnableControl('getlists');
    GetCards();
}

function onListChanges() {
    DisableSpectrumControl('cardColour');
    DisableControl('print');
    GetCards();
}

function GetCards() {
	error = onError;
    id = $( "#listslist option:selected" ).val();
	params = { cards: "open" };
	success = function(r) {

				onBeforeCardsUpdated();

		$.each(r.cards,function( pos, item ) {
			$('#cards').append($("<div class='card'><h2>"+item.name+"</h2><div class='desc'>"+item.desc+"</div>"));
		});

        onCardsUpdated();

		//debug(r);
	};
	Trello.lists.get(id, params, success, error);

}

function onPrintClicked() {
    window.print();
}

function onChangeColour(colour) {
		debug('Colour changed to ' + colour);
		$('.card').css('background-color', colour);
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

		debug('loading /config');
		$.getJSON( '/config', {}, function(data) {
				debug('/config loaded');
				config = data;
				onConfigLoaded();
		});

		debug('loading spectrum.js');
		$.getScript( 'spectrum.js', function( data, textStatus, jqxhr ) {
				debug("spectrum.js loaded");
				AddSpectrumToControl('cardColour');
				DisableSpectrumControl('cardColour');
		});

		debug('init finished')
}

function onConfigLoaded() {
		ShowControl('authorize');
		EnableControl('authorize');
		DisableControl('logout');
		HideControl('logout');
		clearAuthorizedAsText();
}

function AddSpectrumToControl(id) {
		debug('add spectrum to control ' + id);
	  $('#cardColour').spectrum({
        showPaletteOnly: true,
        showPalette:true,
        color: 'lightgray',
				change: onChangeColour,
        palette: [
            ['lightgray', 'black', 'white', 'blanchedalmond',
            'rgb(255, 128, 0);', 'hsv 100 70 50'],
            ['red', 'yellow', 'green', 'blue', 'violet']
        ]
		});
}

function debug(msg) {
	console.log(msg);
}

init();
