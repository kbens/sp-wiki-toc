//<![CDATA[
/********* 
Create Table of Contents - ToC for a SharePoint Wiki
Description: This will create a nested list of links to all H tags on a SharePoint wiki page
Assumptions: H tags must start with H1 and be in sequential order. Example, going from H1 to H3, then back to H2 will give unexpected results.
**********/

/* use SP function below instead of $(document).ready */
_spBodyOnLoadFunctions.push(function(){ 
    /* set options */
	var isTopLinkEnabled = false; /* true; */
	var isStickEnabled = true; /* false; */
	
	if (isStickEnabled) {
		enableStick();
	};
	
	var prevHLevel = 1;
	var listArray = [];
	listArray[0] = $("#toc-list"); // H1
	
	/* select inner content areas of a wiki page */
	$(".ms-rte-layoutszone-inner").each(function(wikiAreaCount, wikiArea){ 
		/* we ONLY want the first(left most) wiki content area, else return */
		/* todo - is there a better way to select this specific wikiArea? */
	    if(wikiAreaCount>0){return;} 
		
		/* loop through H tags within wikiArea */
		$(" H1, H2, H3, H4",wikiArea).each(function(i){   
		    var current = $(this);
			current.attr("id", "title" + i);   
			var curHLevel = getHLevel(current.prop('tagName'));
			
			if (isTopLinkEnabled) {
				addTopLink(current);
			}
			
			/* indent? */
			if (curHLevel > prevHLevel) {
				var tempList = $("<ul>");
				listArray[prevHLevel-1].append(tempList);
				listArray[curHLevel-1] = tempList;
			}  
			else if (curHLevel < prevHLevel) { // clear reference to previous list
				listArray[prevHLevel-1] = null;
			}
			
			/* create new link */        
			var newLink = $("<a>");
			newLink.text(current.text()); /* Strip out an HTML */
			newLink.attr("id","");
			newLink.attr("href","#title" + i);
			newLink.attr("class","toc-" + current.prop('tagName'));
			
			/* create new list item and add to list */
			var newItem = $("<li>");
			newItem.append(newLink);
			newItem.appendTo(listArray[curHLevel-1]);
			
			/* set previous level for next iteration */
			prevHLevel = curHLevel;
		}) 
	}) 
});

/* return the level of H tag */
function getHLevel(tag) {
	if (tag.substring(0,1) != 'H') {
		/* error, not H tag */
		return 0;
	}
	
	return tag.substring(1,2);	
};

/* add a link to the top of page, after H tag */
function addTopLink(hTag) {
	var topLink = $("<div>");
    topLink.attr("class","top-link");
	
	var aHref = $("<a>");
	aHref.attr("href","#toc-list");
	aHref.text("Back to Top");
	
	topLink.append(aHref);	
	hTag.after(topLink);
};

/* stick the ToC on the right side bar as you scroll */
function enableStick(){
	$('#toc').each(function(i){   
		$(this).attr("class","stick");
	});
};
//]>
