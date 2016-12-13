/* global confirm */
(function( $, undefined ) {

	// Show/hide profile fields when the main nav changes.
	$( '.group-picker' ).on( 'change', function() {
		var $this = $( this ),
			groupID = $this.find( 'option:selected' ).val();

		$( $this.data( 'groups-id' ) + ' .xprofile-group' ).addClass( 'hide' );
		$( $this.data( 'groups-id' ) + ' .xprofile-group[data-group-id="' + groupID + '"]' ).removeClass( 'hide' );
	} );


	/**
	 * Drag and drop within profile field groups.
	 */
	$( '.xprofile-group' ).sortable({
		forcePlaceholderSize: true,
		handle:               '.change-button'
	});


	$( '.xprofile-groups' ).on( 'click', '.change-button', function( e ) {
		e.preventDefault();
	} );


	/**
	 * Add a new, empty form field to the displayed group.
	 *
	 * For the POC, this just duplicates the primary group's first field into the same group as-is.
	 */
	$( '.xprofile-controls' ).on( 'click', '.add-button', function( e ) {
		e.preventDefault();

		var group = $( '.xprofile-group:visible' );
		group.find( '.xprofile-field' ).first().clone().appendTo( group );

		// This is required, but we should probably just fix the external library.
		$( '.xprofile-group' ).sortable({
			forcePlaceholderSize: true,
			handle:               '.change-button'
		});
	} );


	/**
	 * Strip HTML from contenteditable=true elements on copy/paste.
	 */
	$( '.xprofile-groups' ).on( 'paste', 'header,p', function( e ) {
		var clipboard, newRange, origPosition, range, selection,
			field         = $( e.target ),
			targetElement = e.target;

		e.preventDefault();

		if ( e.originalEvent.clipboardData ) {
			clipboard = e.originalEvent.clipboardData.getData( 'text/plain' );
		} else {  // IE 9
			clipboard = window.clipboardData.getData( 'Text' );
		}

		// Get the caret position.
		selection    = window.getSelection ? window.getSelection() : document.selection;
		range        = selection.getRangeAt ? selection.getRangeAt( 0 ) : selection.createRange();
		origPosition = range.startOffset;

		field.text(
			field.text().substring( 0, range.startOffset ) +
			clipboard +
			field.text().substring( range.endOffset, field.text().length )
		);

		// If the DOM node has multiple children, grab the first.
		if ( e.target.childNodes.length > 0 ) {
			targetElement = e.target.childNodes[0];
		}

		// Move the caret to the end of the text that we just inserted.
		if ( window.getSelection ) {
			newRange = document.createRange();
			newRange.setStart( targetElement, origPosition + clipboard.length );
			newRange.setEnd( targetElement, origPosition + clipboard.length );

			if ( selection.rangeCount > 0 ) {
				selection.removeAllRanges();
			}
			selection.addRange( newRange );

		} else {  // IE 9
			newRange = document.selection.createRange();
			newRange.moveToElementText( e.target );
			newRange.setStart( targetElement, origPosition + clipboard.length );
			newRange.setEnd( targetElement, origPosition + clipboard.length );
			newRange.select();
		}
	} );


	/**
	 * Strip HTML from contenteditable=true elements on drag/drop.
	 */
	$( '.xprofile-groups' ).on( 'drop', 'header,p', function( e ) {
		var clipboard,
			field = $( e.target );

		e.preventDefault();

		if ( e.originalEvent.dataTransfer ) {
			clipboard = e.originalEvent.dataTransfer.getData( 'text/plain' );
		} else {  // IE 9
			clipboard = window.event.dataTransfer.getData( 'Text' );
		}

		field.text( field.text() + clipboard );
	} );


	/**
	 * Destructive action "are you sure?" prompt.
	 */
	$( '.xprofile-groups' ).on( 'click', '.trash-button', function( e ) {
		e.preventDefault();

		if ( confirm( 'Please confirm that you want to delete this profile field. It cannot be restored.' ) ) {
			$( this ).parents( '.xprofile-field' ).remove();
		}
	} );


	$( document ).ready(function() {
	});

})( jQuery );

/*
Credits:
---

https://github.com/samshelley/contentEditable/blob/master/contentEditable.js
*/