/*global 
	triggersPoints: [],
	hashElements: [],
	currentHashEl: "some string",
	contentScrollTop: 200
	testessss
asdfas 
*/

var slideMenu;
var playVis = $("html").hasClass("no-svg");

$(window).load(function() {
	resizeRows();
	// if ($(window).width() > mobileWidth) {
	// 	slideMenu = $("#nav").pullSlider({
	// 		inmode: false
	// 	});
	// } else {
	// 	slideMenu = $("#nav").pullSlider({
	// 		inmode: true
	// 	});
	// }

	// bringOutStaticBackground();
	// $("#nav").removeClass('hidden-nav');

	// $(window).on("resize", function() {
	// 	if ($(window).width() > mobileWidth) {
	// 		slideMenu.disable();
	// 	} else {
	// 		slideMenu.enable();
	// 	}
	// });
});

$(window).resize(function() {
	resizeRows();
});

function resizeRows() {
	var subRows = $(".sub-row");
	subRows.each(function(index) {
		var height = findChildrenHeight(subRows[index]);
		subRows[index].style.height = height + "px";
	});

	var rows = $(".row");
	rows.each(function(index) {
		var height = findChildrenHeight(rows[index]);
		rows[index].style.height = height + "px";
	});
	$("#cover").css({
		"minHeight": $(window).outerHeight(true)
	});
	// findTriggerPoints();
}

function findChildrenHeight(parent) {
	var children = $(parent).children();
	var height = 0;
	if ($(children[0]).css("position") == "absolute") {
		for (var a = 0, max = children.length; a < max; ++a) {
			var nheight = $(children[a]).outerHeight(true);
			if (nheight > height) {
				height = nheight;
			}
			if (children[a].nodeName === "IMG") {
				children[a].onload = resizeRows;
			}
		}
	} else {
		for (var a = 0, max = children.length; a < max; ++a) {
			height += $(children[a]).outerHeight(true);
			if (children[a].nodeName === "IMG") {
				children[a].onload = resizeRows;
			}
		}
	}

	return height;
}









function setupnav() {
	var links = $(".link-to-page");
	links.each(function(index) {
		$(links[index]).click(function() {
			var linkto = this.getAttribute("href").split("/");
			clearHighLight();
			heighLightEl(this);
			linkto = linkto[linkto.length - 1];
			loadNextPage(linkto);
			return false;
		});
	});

	//$("#nav img").on("click",loadNextPage);//for the home being the index page
	$("#nav img").on("click", function() {
		clearHighLight();
		loadNextPage("home");
	});
}

function loadNextPage(address) {
	document.getElementById('main-title').innerHTML = "Sick Kids Orthopaedic Surgery Fellowship: " + titleFormat(address);
	//document.title = "Sick Kids Orthopaedic Surgery Fellowship: "+titleFormat(address);

	if (loading || address == pageSlug) {
		return false;
	}
	loading = true;
	loadingElement.style.display = "block";
	var newPage = "";
	if (typeof address !== "object") {
		newPage = "/ajax/" + address + "/";
	} else {
		newPage = "/ajax/index/";
	}
	var nextpage = $("#next-page");
	slideMenu.refindHeight();

	nextpage.load(newPage, function() {

		this.style.left = "0%";
		this.className = "page animated slideInRight " + address;
		bringInStaticBackground();
		$(this).scrollTop(0);
		$("#content").scrollTop(0);
		$("#content")[0].className = "page animated-out slideOutLeft";
		if (history && history.pushState) {
			var newAddress = "/";
			if (typeof address !== "object") {
				newAddress = "/" + address + "/";
			}
			history.pushState("", "", newAddress);
		}
		var newSubnav = $("#subnav-new")[0];
		var oldSubnav = $("#subnav")[0];
		newSubnav.style.display = "block";
		oldSubnav.className = "animated slideOutUp";
		$("#subnav")[0].parentNode.appendChild(newSubnav);
		moveButtonDown();
		newSubnav.className = "animated slideInDown";
		resizeRows();
		setTimeout(clearAnimation, 1000);
		setTimeout(resetTheNames, 1001);
		currentHashEl = "";
	});
	nextpage.addClass(address);
}

function titleFormat(urlTitle) {
	urlText = urlTitle.split("-").join(" ");

	return urlText;
}

function moveButtonDown() {
	var lastB = $(".last-button")[0];
	lastB.parentNode.appendChild(lastB);
}

function clearAnimation() {
	var elements = $(".animated");
	elements.removeClass('animated');
	elements.removeClass('slideInRight');
}

function setupNav() {
	var subNav = $("#subnav");
}

function clearHighLight() {
	$(".heighlight").removeClass('heighlight');
}

function heighLightEl(element) {
	$(element).addClass('heighlight');
}

function resetTheNames() {
	loadingElement.style.display = "none";
	var oldcontent = $("#content")[0];
	var newcontent = $("#next-page")[0];
	oldcontent.id = "next-page";
	oldcontent.style.left = "100%";
	oldcontent.className = "page";
	oldcontent.innerHTML = "";
	newcontent.id = "content";

	newcontent.parentNode.appendChild(newcontent);
	var newSubnav = $("#subnav-new")[0];
	var oldSubnav = $("#subnav")[0];
	var parent = oldSubnav.parentNode;
	parent.removeChild(oldSubnav);
	newSubnav.id = "subnav";
	newSubnav.className = "";
	setupNavClicks(newSubnav);

	bringOutStaticBackground();

	loading = false;
}

function bringOutStaticBackground() {
	var el = $(".background.fullscreen.fixed")[0];
	if (el) {
		console.log("bringing out ", el);
		document.body.appendChild(el);
	}
}

function bringInStaticBackground() {
	var el = $("body .background.fullscreen.fixed")[0]
	if (el) {
		console.log("bringing in ", el.parentNode.id, el);
		if (el.parentNode.id != "next-page") {
			console.log("bring it in performed");
			$("#content")[0].appendChild(el);
		}
	}
}

function setupNavClicks(element) {
	var elements = $(element).children();
	for (var a = 0, max = elements.length; a < max; a += 1) {
		$(elements[a]).click(function(event) {
			event.preventDefault();
			currentHashEl = this.href.split("#")[1];
			jumpToLocation();
			setURL();
		});
	}
}

//google analytics function
//when ever we load in new content we replace the hashElements with the id's of the elements
//we also then reload the height triggering points loading them into the triggersPoints array
function findTriggerPoints() {
	triggersPoints = [];
	var offset = $("#content").scrollTop();
	for (var a = 0, max = hashElements.length; a < max; a += 1) {
		triggersPoints.push($("#" + hashElements[a]).offset().top + offsetfindtrigger + offset);
		if (a + 1 >= max) {
			triggersPoints.push(triggersPoints[triggersPoints.length - 1] + $("#" + hashElements[a]).height() + offsetfindtrigger);
		}
	}
}

function scrollDetectionFunc() {
	contentScrollTop = $(this).scrollTop();
	//check if there is more than 1 point
	if (triggersPoints.length > 1) {
		//for each point check if it crossed it
		for (var a = 0; a < triggersPoints.length; a += 1) {
			//if the scroll point is less than then next but greater than current
			if (hashElements[a] !== currentHashEl && triggersPoints[a] < contentScrollTop && triggersPoints[a + 1] > contentScrollTop) {
				currentHashEl = hashElements[a];
				setURL();
			}
		}
	}
}

function setURL() {
	if (history && history.pushState) {
		var newAddress = "/";
		var gaAddress = "/";
		if (typeof address !== "object") {
			newAddress = "/" + pageSlug + "/" + currentHashEl + "/";
			gaAddress = "/" + pageSlug + "/" + currentHashEl;
		}
		history.pushState(currentHashEl, "", newAddress);
		//console.log(newAddress);
		_gaq.push(['_trackPageview', gaAddress]);
	}
}

function jumpToLocation() {
	$("#content").scrollTop($("#" + currentHashEl).offset().top + $("#content").scrollTop());
}

function trackOutboundLink(link, category, action) {
	try {
		_gaq.push(['_trackEvent', category, action]);
	} catch (err) {}

	setTimeout(function() {
		document.location.href = link.href;
	}, 100);
}

var link = document.getElementById('my-link-id');